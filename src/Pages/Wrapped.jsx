import { useContext, useState } from 'react';
import { BookDataContext } from '../BookDataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './pages.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function Wrapped() {
  const { parsedData } = useContext(BookDataContext);
  const [selectedYear, setSelectedYear] = useState(null);

  if (parsedData.length === 0) {
    return <div className="empty-state"><p>No data yet, upload your CSV on the home page.</p></div>;
  }

  // only care about books i've finished with a date
  const booksRead = parsedData.filter(b => b["Exclusive Shelf"] === "read");
  const withDates = booksRead.filter(b => b["Date Read"]);

  const currentYear = new Date().getFullYear();

  // figure out which years i have data for, default to most recent
  const years = [...new Set(withDates.map(b => new Date(b["Date Read"]).getFullYear()))]
    .filter(Boolean)
    .filter(y => y < currentYear)
    .sort((a, b) => b - a);
  const year = selectedYear || years[0] || new Date().getFullYear();

  // filter down to just that year
  const thisYear = withDates.filter(b => new Date(b["Date Read"]).getFullYear() === year);

  // count books per month for the bar chart
  const monthCounts = Array(12).fill(0);
  thisYear.forEach(b => {
    const month = new Date(b["Date Read"]).getMonth();
    monthCounts[month]++;
  });
  const monthData = MONTHS.map((month, i) => ({ month, count: monthCounts[i] }));

  // top 5 authors this year
  const authorMap = {};
  thisYear.forEach(b => {
    const author = b["Author"] || "Unknown";
    authorMap[author] = (authorMap[author] || 0) + 1;
  });
  const topAuthors = Object.entries(authorMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // average rating (only for books i actually rated)
  const ratedThisYear = thisYear.filter(b => parseInt(b["My Rating"]) > 0);
  const avgRating = ratedThisYear.length
    ? (ratedThisYear.reduce((t, b) => t + parseInt(b["My Rating"]), 0) / ratedThisYear.length).toFixed(2)
    : null;

  const totalPages = thisYear.reduce((t, b) => t + (parseInt(b["Number of Pages"]) || 0), 0);
  const bestMonth = monthData.reduce((a, b) => b.count > a.count ? b : a, monthData[0]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{year} Wrapped</h1>
        <p className="page-sub">Your years in books</p>
      </div>

      {years.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {years.map(y => (
            <span
              key={y}
              className={`year-chip ${y === year ? 'active' : ''}`}
              onClick={() => setSelectedYear(y)}
              style={{ cursor: 'pointer' }}
            >
              {y}
            </span>
          ))}
        </div>
      )}

      {thisYear.length === 0 ? (
        <div className="chart-card"><p className="muted">No books with dates found for {year}.</p></div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card accent">
              <span className="stat-num">{thisYear.length}</span>
              <span className="stat-label">Books in {year}</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{totalPages.toLocaleString()}</span>
              <span className="stat-label">Pages Read</span>
            </div>
            {avgRating && (
              <div className="stat-card">
                <span className="stat-num">{avgRating}</span>
                <span className="stat-label">Avg Rating</span>
              </div>
            )}
            {bestMonth.count > 0 && (
              <div className="stat-card">
                <span className="stat-num">{bestMonth.month}</span>
                <span className="stat-label">Best Month ({bestMonth.count} books)</span>
              </div>
            )}
          </div>

          <div className="charts-grid">
            <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
              <h2 className="chart-title">Books per Month</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthData} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip formatter={(v) => [`${v} books`, '']} cursor={{ fill: 'rgba(200,135,58,0.08)' }} />
                  <Bar dataKey="count" fill="var(--amber)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {topAuthors.length > 0 && (
            <div className="chart-card">
              <h2 className="chart-title">Top Authors in {year}</h2>
              <ul className="author-rank-list">
                {topAuthors.map(([author, count], i) => (
                  <li key={author} className="author-rank-row">
                    <span className="author-rank-pos">{i + 1}</span>
                    <span className="author-rank-name">{author}</span>
                    <span className="author-rank-bar-wrap">
                      <span className="author-rank-bar" style={{ width: `${(count / topAuthors[0][1]) * 100}%` }} />
                    </span>
                    <span className="author-rank-count">{count} book{count > 1 ? 's' : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}