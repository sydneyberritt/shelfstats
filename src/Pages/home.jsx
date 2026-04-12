import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { BookDataContext } from '../BookDataContext';
import './Home.css';

export function Home() {
    // Get parseCSV function 
    const { parseCsv } = useContext(BookDataContext);

    const fileUpload = (event) => {
        // Parsing file data 
        if(event.target.files.length > 0){
            parseCsv(event.target.files[0])
        }
    };

    return (
    <>
      <div>
      </div>
      <h1>Goodreads Profile</h1>
      <div className="card">
        <a href = "https://www.goodreads.com/review/import">
        <button>
          Export Goodreads Data 
        </button>
        </a>
      </div>
      <p className="read-the-docs">
        Upload your Goodreads CSV here
      </p>
      <input type="file" 
      name = "file"
      accept = ".csv"
      onChange={fileUpload}/>
      <div className="card">
      <Link to="/profile">
        <button>
            View your Goodreads Profile
        </button>
      </Link>
      </div>
    </>
  )
}
