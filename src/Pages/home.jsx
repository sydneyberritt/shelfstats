import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { BookDataContext } from '../BookDataContext';
import './Home.css';

export function Home() {
  const { parseCsv, parsedData } = useContext(BookDataContext);

  const fileUpload = (event) => {
    if (event.target.files.length > 0) parseCsv(event.target.files[0]);
  };

  const hasData = parsedData.length > 0;

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-text">
          <p className="home-eyebrow">Your reading life, visualized</p>
          <h1 className="home-title">ShelfStats</h1>
          <p className="home-subtitle">Upload your Goodreads library and explore detailed stats about your reading habits.</p>
        </div>

        <div className="home-card">
          <div className="home-step">
            <span className="step-num">01</span>
            <div>
              <p className="step-label">Export your data</p>
              <a href="https://www.goodreads.com/review/import" target="_blank" rel="noreferrer" className="btn btn-outline">
                Go to Goodreads
              </a>
            </div>
          </div>

          <div className="home-step">
            <span className="step-num">02</span>
            <div>
              <p className="step-label">Upload your CSV</p>
              <label className="btn btn-outline file-label">
                {hasData ? `✓ ${parsedData.length} books loaded` : 'Choose file'}
                <input type="file" name="file" accept=".csv" onChange={fileUpload} hidden />
              </label>
            </div>
          </div>

          <div className="home-step">
            <span className="step-num">03</span>
            <div>
              <p className="step-label">Explore your stats</p>
              <Link to="/profile">
                <button className="btn btn-primary" disabled={!hasData}>View Profile</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}