import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function PublicHeader({ tag = 'Licensed & Certified Technicians' }) {
  return (
    <header className="landing-header">
      <div className="wrap landing-header-bar">
        <Link to="/">
          <img src={logo} alt="LG Home Comfort" className="landing-logo" />
        </Link>

        <div className="header-actions">
          <a className="header-icon-link" href="tel:18664385442" aria-label="Call 1-866-438-5442">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.8 2.5A17.5 17.5 0 0 1 3.5 5.8 2.5 2.5 0 0 1 6 3Z"
                fill="#e8437c"
              />
            </svg>
          </a>

          <a className="header-icon-link" href="mailto:support@lghomecomfort.ca" aria-label="Email support@lghomecomfort.ca">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="#fff" stroke="#e08a3c" strokeWidth="1.6" />
              <path d="m3.5 6.5 8.5 6.5 8.5-6.5" stroke="#e08a3c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
          </a>

          <span className="cert-pill">{tag}</span>
        </div>
      </div>
    </header>
  );
}
