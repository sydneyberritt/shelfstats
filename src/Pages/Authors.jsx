import { useContext, useState } from 'react';
import { BookDataContext } from '../BookDataContext';
import './pages.css';

const STARS = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export function Authors() {
  const { parsedData } = useContext(BookDataContext);
  const [openAuthor, setOpenAuthor] = useState(null);

  if (parsedData.length === 0) {
    return (
      <div className="empty-state">
        <p>No data yet - upload your CSV on the home page.</p>
      </div>
    );
  }

  const booksRead = parsedData.filter(b => b["Exclusive Shelf"] === "read");

  // group books by author and calculate stats
  const authorMap = {};
  booksRead.forEach(b => {
    const author = b["Author"] || "Unknown";
    if (!authorMap[author]) {
      authorMap[author] = { books: [], totalRating: 0, ratedCount: 0 };
    }
    authorMap[author].books.push(b);
    const rating = parseInt(b["My Rating"]);
    if (rating > 0) {
      authorMap[author].totalRating += rating;
      authorMap[author].ratedCount++;
    }
  });

  // sort by book count, then alpha as tiebreaker
  const ranked = Object.entries(authorMap)
    .map(([name, data]) => ({
      name,
      books: data.books,
      bookCount: data.books.length,
      avgRating: data.ratedCount > 0 ? (data.totalRating / data.ratedCount).toFixed(1) : null
    }))
    .sort((a, b) => b.bookCount - a.bookCount || a.name.localeCompare(b.name));

  const uniqueAuthors = ranked.length;
  const mostReadAuthor = ranked[0];

  const toggleAuthor = (name) => {
    setOpenAuthor(prev => prev === name ? null : name);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Top Authors</h1>
        <p className="page-sub">Every author you've read, ranked by books read</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card accent">
          <span className="stat-num">{uniqueAuthors}</span>
          <span className="stat-label">Unique Authors</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{mostReadAuthor?.bookCount}</span>
          <span className="stat-label">Most books by one author</span>
        </div>
      </div>

      <div className="author-list">
        {ranked.map((author, i) => (
          <div key={author.name} className="author-entry">

            {/* clickable row */}
            <div
              className={`author-row ${openAuthor === author.name ? 'open' : ''}`}
              onClick={() => toggleAuthor(author.name)}
            >
              <span className="author-pos">{i + 1}</span>
              <span className="author-name">{author.name}</span>
              <div className="author-row-meta">
                {author.avgRating && (
                  <span className="author-avg-rating">★ {author.avgRating}</span>
                )}
                <span className="author-book-count">
                  {author.bookCount} book{author.bookCount > 1 ? 's' : ''}
                </span>
                <span className="author-chevron">{openAuthor === author.name ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* expanded book list */}
            {openAuthor === author.name && (
              <div className="author-books">
                {author.books.map((book, j) => {
                  const rating = parseInt(book["My Rating"]) || 0;
                  return (
                    <div className="author-book-row" key={j}>
                      <div className="author-book-info">
                        <p className="author-book-title">{book["Title"]}</p>
                        <p className="author-book-detail">
                          {book["Number of Pages"] && `${book["Number of Pages"]} pp`}
                          {book["Date Read"] && ` · read ${book["Date Read"]}`}
                        </p>
                      </div>
                      {rating > 0 && (
                        <span className="author-book-stars">{STARS(rating)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}