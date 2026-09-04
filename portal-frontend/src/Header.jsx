import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo.svg';

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header>
      <div className="wrap bar">
        <Link to="/" className="logo">
          <img src={logo} alt="LG Home Comfort" />
        </Link>

        <nav className={navOpen ? 'open' : ''}>
          <a href="#">Services</a>
          <a href="#">Book a Visit</a>
          <a href="#">Financing</a>
        </nav>

        <span className="cert-pill">Licensed &amp; Certified Technicians</span>

        <a className="call-btn" href="tel:18664385442">
          <span className="ic" aria-hidden="true">☎</span> 1-866-438-5442
        </a>

        <button
          className="burger"
          aria-label="Open menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((open) => !open)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
