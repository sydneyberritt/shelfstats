import { useContext } from 'react';
import { BookDataContext } from '../BookDataContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Profile() {
  
  const { parsedData } = useContext(BookDataContext);

  if (parsedData.length === 0) {
    return <p>No data yet - upload your CSV on the home page.</p>;
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
    const yr = b["Date Read"]?.split("/")[2] || b["Date Read"]?.split("-")[0];
    if (yr && yr.length === 4) yearCounts[yr] = (yearCounts[yr] || 0) + 1;
  });
  const yearData = Object.entries(yearCounts).sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count }));

  const ratingData = Object.entries(ratingCounts)
  .map(([rating, count]) => ({ rating: rating, count }));

  const avgPages = booksRead.length ? Math.round(totalPagesRead / booksRead.length) : 0;

  return (
    <>
      <h1>Profile</h1>
      <p>Your reading life at a glance</p>
      <p> {totalBooksRead} Books Read</p>
      <p> {totalPagesRead} Pages Read</p>
      <p> {averageRating} Average Rating</p>
      <p> {avgPages} Avg Pages / Book</p>
      <p> {toRead.length} Want to Read</p>
      <p> {reading.length} Current Reading</p>

      <p> Most Read Author: {topAuthor[0]} ({topAuthor[1]} books) </p>

      <h2>Ratings Breakdown</h2>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={ratingData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <XAxis
            dataKey="rating"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 15 }}
          />
          <Tooltip 
            formatter={(value) => [`${value} books`, null]}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          />
          <Bar dataKey="count" fill="#808080" />
        </BarChart>
      </ResponsiveContainer>
      
    </>
  )
}
