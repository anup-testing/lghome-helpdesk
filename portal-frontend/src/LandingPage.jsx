import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import heroProducts from './assets/hero-products.png';

const ACTIONS = [
  { key: 'report', to: '/report', title: 'Report a Concern', subtitle: "Tell us what went wrong and we'll get it moving." },
  { key: 'track', to: '/track', title: 'Track a Concern', subtitle: 'Check the live status of your open request.' },
  { key: 'feedback', to: '/feedback', title: 'Give Feedback', subtitle: 'Tell us how we did - share feedback about LG Home Comfort services.' },
];

export default function LandingPage() {
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(text) {
    setToastMessage(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2200);
  }

  async function copyValue(value) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(`Copied ${value}`);
    } catch {
      showToast(value);
    }
  }

  return (
    <>
      <Header />

      <main className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="rating">
              <span className="stars" aria-hidden="true">★★★★★</span>
              <b>4.6</b>
              <span>· 2,800+ happy reviews</span>
            </div>

            <h1>Customer Care <span className="accent">Portal</span></h1>
            <p className="lede">Your comfort, our promise - one friendly call away, day or night.</p>

            <div className="actions">
              {ACTIONS.map(({ key, to, title, subtitle }) => (
                <Link key={key} className="action" data-panel={key} to={to}>
                  <span className="t">{title}</span>
                  <span className="s">{subtitle}</span>
                </Link>
              ))}
            </div>

            <div className="contact-row">
              <button className="contact" type="button" onClick={() => copyValue('1-866-438-5442')}>
                <span className="ic" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.8 2.5A17.5 17.5 0 0 1 3.5 5.8 2.5 2.5 0 0 1 6 3Z" fill="#e8437c" />
                  </svg>
                </span>
                <span>
                  <span className="lbl">24/7 phone line</span>
                  <span className="val">1-866-438-5442</span>
                </span>
              </button>

              <button className="contact" type="button" onClick={() => copyValue('support@lghomecomfort.ca')}>
                <span className="ic" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="#fff" stroke="#e08a3c" strokeWidth="1.6" />
                    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" stroke="#e08a3c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                <span>
                  <span className="lbl">Support email</span>
                  <span className="val">support@lghomecomfort.ca</span>
                </span>
              </button>
            </div>
          </div>

          <div className="media">
            <div className="frame">
              <img src={heroProducts} alt="LG Home Comfort product lineup - heat pump, tankless water heater, water softener and smart thermostat." />
            </div>

            <div className="cert-card">
              <span className="ic" aria-hidden="true">🔧</span>
              <span>
                <span className="t">Licensed &amp; Certified</span>
                <span className="s">Technicians</span>
              </span>
            </div>
          </div>
        </div>
      </main>

      <div className={`toast${toastMessage ? ' show' : ''}`} role="status">
        {toastMessage}
      </div>
    </>
  );
}
