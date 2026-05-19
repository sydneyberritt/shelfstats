import './NavBar.css'
import { Link, useLocation } from 'react-router-dom'
import { User, PenLine, BookOpen, Gift } from 'lucide-react'

export function NavBar() {
  const location = useLocation();

  if (location.pathname === '/') return null;

  const links = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/authors', label: 'Authors', icon: PenLine },
    { to: '/recent', label: 'Recent', icon: BookOpen },
    { to: '/wrapped', label: 'Wrapped', icon: Gift },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ShelfStats</Link>
      <ul>
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link to={to} className={location.pathname === to ? 'active' : ''}>
              <Icon size={20} strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}