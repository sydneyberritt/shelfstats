import { useContext } from 'react';
import { BookDataContext } from '../BookDataContext';
import './pages.css';

const STARS = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export function Recent() {
  const { parsedData } = useContext(BookDataContext);

  if (parsedData.length === 0) {
    return <div className="empty-state"><p>No data yet, upload your CSV on the home page.</p></div>;
  }

  // get only the books i've finished
  const booksRead = parsedData.filter(b => b["Exclusive Shelf"] === "read");

  // sort by date, most recent first, and only show 15
  const withDates = booksRead.filter(b => b["Date Read"]);
  withDates.sort((a, b) => new Date(b["Date Read"]) - new Date(a["Date Read"]));
  const recent = withDates.slice(0, 15);

  // fallback if no dates are filled in
  const noDate = booksRead.filter(b => !b["Date Read"]).slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Recent Reads</h1>
        <p className="page-sub">Your last {recent.length} finished books</p>
      </div>

      {recent.length > 0 ? (
        <div className="recent-list">
          {recent.map((book, i) => {
            const rating = parseInt(book["My Rating"]) || 0;
            const title = book["Title"];
            const author = book["Author"];
            const pages = book["Number of Pages"];
            const dateRead = book["Date Read"];

            return (
              <div className="recent-row" key={i}>
                <span className="recent-num">{i + 1}</span>

                <div className="recent-info">
                  <p className="recent-title">{title}</p>
                  <p className="recent-author">{author}</p>
                </div>

                <div className="recent-meta">
                  {rating > 0 && <span className="recent-stars">{STARS(rating)}</span>}
                  {dateRead && <span className="recent-date">{dateRead}</span>}
                  {pages && <span className="recent-pages">{pages} pp</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="chart-card">
          <p className="muted">No dates found on your books. Here are some recent entries:</p>
          <ul className="simple-list" style={{ marginTop: '1rem' }}>
            {noDate.map((b, i) => (
              <li key={i}>{b["Title"]} — {b["Author"]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}