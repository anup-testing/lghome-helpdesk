import { Link, NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function PortalShell({ title, links }) {
  return (
    <div className="shell">
      <aside className="shell-sidebar">
        <Link to="/" className="shell-logo">
          <img src={logo} alt="LG Home Comfort" />
        </Link>

        <span className="shell-portal-tag">{title}</span>

        <nav className="shell-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => 'shell-nav-link' + (isActive ? ' is-active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="shell-body">
        <header className="shell-topbar">
          <span className="cert-pill">{title}</span>
          <span className="shell-user-badge">Signed in</span>
        </header>
        <main className="shell-main">
          <div className="panel">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
