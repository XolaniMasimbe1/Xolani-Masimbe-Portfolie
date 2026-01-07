import { NavLink, Outlet } from 'react-router-dom'
import Footer from './Footer'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' }
]

export default function Layout() {
  return (
    <div className="portfolio">
      <header className="nav">
        <div className="logo">Xolani Masimbe</div>
        <nav className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

