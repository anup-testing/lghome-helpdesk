import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../lib/auth.jsx';

export default function PortalShell({ title, links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

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
          <div className="shell-topbar-user">
            <span className="shell-user-badge">{user?.name ?? 'Signed in'}</span>
            <button type="button" className="shell-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>
        <main className="shell-main">
          <div className="shell-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
