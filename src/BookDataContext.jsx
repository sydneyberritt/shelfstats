import { createContext, useState } from 'react';
import Papa from 'papaparse';

export const BookDataContext = createContext(null);

export const BookDataProvider = ({ children }) => {
  // load from localStorage on first render if it exists
  const [parsedData, setParsedData] = useState(() => {
    try {
      const saved = localStorage.getItem('goodreads-data');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const parseCsv = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setParsedData(results.data);
        // save to localStorage so it survives refresh
        try {
          localStorage.setItem('goodreads-data', JSON.stringify(results.data));
        } catch {
          // localStorage can fail if data is too large
          console.warn('Could not save to localStorage');
        }
      },
    });
  };

  return (
    <BookDataContext.Provider value={{ parsedData, parseCsv }}>
      {children}
    </BookDataContext.Provider>
  )
}