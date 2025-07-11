import { useContext } from 'react';
import { BookDataContext } from '../BookDataContext';

export function Highlights() {

  const { parsedData } = useContext(BookDataContext);
  const booksRead = parsedData.filter( book => book["Exclusive Shelf"] == "read");
  let longestBook = null;
  let shortestBook = null;
  if(booksRead.length > 0){
    longestBook = booksRead[0]
    shortestBook = booksRead[0]
    for(const book of booksRead){
      const currentPages = parseInt(book["Number of Pages"])
      const longestPages = parseInt(longestBook["Number of Pages"])
      const shortestPages = parseInt(shortestBook["Number of Pages"])
      if(currentPages > longestPages){
        longestBook = book;
      }
      if(currentPages < shortestPages){
        shortestBook = book;
      }
    }
  }


  return (
    <>
      <h1>Highlights</h1>
      <p>Longest Book: {longestBook["Title"]} by {longestBook["Author"]} ( {longestBook["Number of Pages"]} pages )</p>
      <p>Shortest Book: {shortestBook["Title"]} by {shortestBook["Author"]} ( {shortestBook["Number of Pages"]} pages )</p>
    </>
  )
}
