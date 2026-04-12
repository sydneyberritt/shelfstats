import { useContext } from 'react';
import { BookDataContext } from '../BookDataContext';

export function Highlights() {

  const { parsedData } = useContext(BookDataContext);

  if (parsedData.length === 0) {
    return <p>No data yet - upload your CSV on the home page.</p>;
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
    <>
      <h1>Highlights</h1>
      <p>Your most notable reads</p>

      <h2>Favourite Author</h2>
      <p>{topAuthorEntry[0]} ({topAuthorEntry[1]} books )</p>

      <h2>Stats</h2>
      <p> 5-star books: {fiveStarCount}</p>

      <p>
        Reading since:{' '}
        {firstBook ? new Date(firstBook["Date Read"]).getFullYear() : '—'}
      </p>

      <h2>Longest Book</h2>
      {longestBook && (
        <p>
          {longestBook["Title"]} by {longestBook["Author"]} — {' '}
          {longestBook["Number of Pages"]} pages
        </p>
      )}

      <h2>Shortest Book</h2>
      {shortestBook && (
        <p>
          {shortestBook["Title"]} by {shortestBook["Author"]} —{' '}
          {shortestBook["Number of Pages"]} pages
        </p>
      )}

      <h2>First Book Read</h2>
      {firstBook && (
        <p>
          {firstBook["Title"]} — {firstBook["Date Read"]}
        </p>
      )}

      <h2>Most Recent Book</h2>
      {lastBook && (
        <p>
          {lastBook["Title"]} — {lastBook["Date Read"]}
        </p>
      )}

      <h2>Books Read by Favourite Author</h2>
      <ul>
        {topAuthorBooks.map((b, i) => (
          <li key={i}>
            {b["Title"]} — {b["Number of Pages"]} pages
          </li>
        ))}
      </ul>
    </>
  )
}
