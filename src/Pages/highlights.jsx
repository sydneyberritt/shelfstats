import { useContext } from 'react';
import { BookDataContext } from '../BookDataContext';
import './pages.css';

export function Highlights() {

  const { parsedData } = useContext(BookDataContext);

  if (parsedData.length === 0) {
    return (
      <div className="empty-state"> 
        <p>No data yet - upload your CSV on the home page.</p>
      </div>
    );
  }

  const booksRead = parsedData.filter(b => b["Exclusive Shelf"] === "read");

  if (booksRead.length === 0) {
    return <p>No books marked as read yet.</p>;
  }

  // Longest / shortest
  const withPages = booksRead.filter(b => parseInt(b["Number of Pages"]) > 0);
  const longestBook = withPages.reduce((a, b) => parseInt(b["Number of Pages"]) > parseInt(a["Number of Pages"]) ? b : a, withPages[0]);
  const shortestBook = withPages.reduce((a, b) => parseInt(b["Number of Pages"]) < parseInt(a["Number of Pages"]) ? b : a, withPages[0]);

  // Highest rated
  const rated = booksRead.filter(b => parseInt(b["My Rating"]) === 5);
  const fiveStarCount = rated.length;

  // Most read author
  const authorCounts = {};
  booksRead.forEach(b => { const a = b["Author"] || "Unknown"; authorCounts[a] = (authorCounts[a] || 0) + 1; });
  const topAuthorEntry = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0];
  const topAuthorBooks = booksRead.filter(b => b["Author"] === topAuthorEntry?.[0]);

  // Earliest & latest read
  const withDates = booksRead.filter(b => b["Date Read"]);
  withDates.sort((a, b) => new Date(a["Date Read"]) - new Date(b["Date Read"]));
  const firstBook = withDates[0];
  const lastBook = withDates[withDates.length - 1];


  return (
    <div className="page">

      <div className="page-header">
        <h1 className="page-title">Highlights</h1>
        <p className="page-sub">Your most notable reads</p>
      </div>

      {topAuthorEntry && (
        <div className="highlight-banner">
          <span className="highlight-label">Favourite author</span>
          <span className="highlight-value">
            {topAuthorEntry[0]} <em>({topAuthorEntry[1]} books)</em>
          </span>
        </div>
      )}

      <div className="stat-grid">
        <div className="stat-card accent">
          <span className="stat-num">{fiveStarCount}</span>
          <span className="stat-label">5-star reads</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">
            {firstBook ? new Date(firstBook["Date Read"]).getFullYear() : '—'}
          </span>
          <span className="stat-label">Reading since</span>
        </div>
      </div>

      <div className="book-card-grid">
        {longestBook && (
          <div className="book-card">
            <span className="book-card-label">📖 Longest Read</span>
            <p className="book-card-title">{longestBook["Title"]}</p>
            <p className="book-card-author">by {longestBook["Author"]}</p>
            <p className="book-card-detail">{longestBook["Number of Pages"]} pages</p>
          </div>
        )}
        {shortestBook && (
          <div className="book-card">
            <span className="book-card-label">🌱 Shortest Read</span>
            <p className="book-card-title">{shortestBook["Title"]}</p>
            <p className="book-card-author">by {shortestBook["Author"]}</p>
            <p className="book-card-detail">{shortestBook["Number of Pages"]} pages</p>
          </div>
        )}
        {firstBook && (
          <div className="book-card">
            <span className="book-card-label">🕰 First Tracked</span>
            <p className="book-card-title">{firstBook["Title"]}</p>
            <p className="book-card-author">by {firstBook["Author"]}</p>
            <p className="book-card-detail">Read: {firstBook["Date Read"]}</p>
          </div>
        )}
        {lastBook && lastBook !== firstBook && (
          <div className="book-card">
            <span className="book-card-label">🆕 Most Recent</span>
            <p className="book-card-title">{lastBook["Title"]}</p>
            <p className="book-card-author">by {lastBook["Author"]}</p>
            <p className="book-card-detail">Read: {lastBook["Date Read"]}</p>
          </div>
        )}
      </div>

      {topAuthorBooks.length > 0 && (
        <div className="chart-card">
          <h2 className="chart-title">All read books by {topAuthorEntry[0]}</h2>
          <ul className="simple-list">
            {topAuthorBooks.map((b, i) => (
              <li key={i}>
                {b["Title"]} <span className="muted">({b["Number of Pages"]} pp)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
