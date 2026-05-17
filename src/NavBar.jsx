import './NavBar.css'
import { Link, useLocation } from 'react-router-dom'

export function NavBar() {
  const location = useLocation();

  // don't show the navbar on the home page
  if (location.pathname === '/') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">📚 ShelfStats</Link>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/highlights">Highlights</Link></li>
        <li><Link to="/recent">Recent</Link></li>
        <li><Link to="/wrapped">Wrapped</Link></li>
      </ul>
    </nav>
  )
}