import { useContext } from 'react';
import { BookDataContext } from '../BookDataContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './pages.css';

export function Profile() {
  
  const { parsedData } = useContext(BookDataContext);

  if (parsedData.length === 0) {
    return(
    <div className="empty-state">
      <p>No data yet, upload your CSV on the home page.</p>;
    </div>
    );
  }

  const booksRead = parsedData.filter( book => book["Exclusive Shelf"] == "read");
  const toRead = parsedData.filter( book => book["Exclusive Shelf"] == "to-read");
  const reading = parsedData.filter( book => book["Exclusive Shelf"] == "currently-reading");

  // Total Books Read
  const totalBooksRead = booksRead.length;
  const totalPagesRead = booksRead.reduce((total, book) => {
    const pages = parseInt(book["Number of Pages"]); 
    return total + pages;
  }, 0);

  // Average Rating
  const booksRated = parsedData.filter( book => book["Exclusive Shelf"] == "read" && book['My Rating'] != "");
  const totalRating = booksRated.reduce((total, book) => {
    const rating = parseInt(book["My Rating"]);
    return total + rating;
  }, 0);
  const averageRating = (totalRating / booksRated.length).toFixed(2);

  const authorCounts = {};
  booksRead.forEach(b => {
    const a = b["Author"] || "Unknown";
    authorCounts[a] = (authorCounts[a] || 0) + 1;
  });
  const topAuthor = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0];

  // Ratings Chart
  const ratingCounts = {1:0, 2:0, 3:0, 4:0, 5:0};
  booksRated.forEach(book => {
    const bookRating = parseInt(book["My Rating"]);
    if(bookRating >= 1 && bookRating <= 5){
      ratingCounts[bookRating]++;
    }
  });


  // Books by year read
  const yearCounts = {};
  booksRead.forEach(b => {
    const yr = b["Date Read"]?.split("/")[0] || b["Date Read"]?.split("-")[0];
    if (yr && yr.length === 4) yearCounts[yr] = (yearCounts[yr] || 0) + 1;
  });

  const yearData = Object.entries(yearCounts).sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count }));
  const ratingData = Object.entries(ratingCounts)
  .map(([rating, count]) => ({ rating: `${rating} ★`, count }));

  const avgPages = booksRead.length ? Math.round(totalPagesRead / booksRead.length) : 0;

  const totalRated = ratingData.reduce((t, d) => t + d.count, 0);
  

  console.log("sample date:", booksRead[0]?.["Date Read"]);
  console.log("yearData:", yearData);

  return (
    <div className="page">

      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-sub">Your reading life at a glance</p>
      </div>

      {/* top section: stats on left, author card on right */}
      <div className="profile-top">
        <div className="stat-grid">
          <div className="stat-card accent">
            <span className="stat-num">{totalBooksRead}</span>
            <span className="stat-label">Books Read</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{totalPagesRead.toLocaleString()}</span>
            <span className="stat-label">Pages Read</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{averageRating}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{avgPages}</span>
            <span className="stat-label">Avg Pages</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{toRead.length}</span>
            <span className="stat-label">Want to Read</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{reading.length}</span>
            <span className="stat-label">Reading Now</span>
          </div>
        </div>

        {topAuthor && (
          <div className="author-spotlight">
            <p className="author-spotlight-label">Most-read author</p>
            <p className="author-spotlight-name">{topAuthor[0]}</p>
            <p className="author-spotlight-count">{topAuthor[1]} books read</p>
          </div>
        )}
      </div>

      <div className="charts-grid">
        {ratingData.some(d => d.count > 0) && (
          <div className="chart-card">
            <h2 className="chart-title">Ratings Breakdown</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ratingData} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
                <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} allowDecimals={false} />
                <Tooltip
                  formatter={(v, name, props) => {
                    const star = props.payload.rating;
                    const pct = totalRated > 0 ? ((v / totalRated) * 100).toFixed(1) : 0;
                    return [`${v} ${star} reads (${pct}%)`, ''];
                  }}
                  cursor={{ fill: 'rgba(200,135,58,0.08)' }}
                  contentStyle={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--ink)'
                  }}
                />
                <Bar dataKey="count" fill="var(--amber)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {yearData.length > 0 && (
          <div className="chart-card">
            <h2 className="chart-title">Books by Year</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={yearData} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} allowDecimals={false} />
                <Tooltip
                  formatter={(v) => [`${v} books`, '']}
                  cursor={{ fill: 'rgba(200,135,58,0.08)' }}
                  contentStyle={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--ink)'
                  }}
                />
                <Bar dataKey="count" fill="var(--amber)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  )
}
