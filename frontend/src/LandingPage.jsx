import { Link } from 'react-router-dom';
import PublicHeader from './components/PublicHeader.jsx';
import heroProducts from './assets/hero-products.png';

const ACTIONS = [
  { key: 'report', to: '/report', title: 'Report a Concern', subtitle: "Tell us what went wrong and we'll get it moving." },
  { key: 'track', to: '/track', title: 'Track a Concern', subtitle: 'Check the live status of your open request.' },
  { key: 'feedback', to: '/feedback', title: 'Give Feedback', subtitle: 'Tell us how we did - share feedback about LG Home Comfort services.' },
];

export default function LandingPage() {
  return (
    <>
      <PublicHeader />

      <main className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>
              Customer Care <span className="accent">Portal</span>
            </h1>
            <p className="lede">Your comfort, our promise - one friendly call away, day or night.</p>

            <div className="actions">
              {ACTIONS.map(({ key, to, title, subtitle }) => (
                <Link key={key} className="action" data-panel={key} to={to}>
                  <span className="t">{title}</span>
                  <span className="s">{subtitle}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="media">
            <div className="frame">
              <img
                src={heroProducts}
                alt="LG Home Comfort product lineup - heat pump, tankless water heater, water softener and smart thermostat."
              />
            </div>
          </div>
        </div>
      </main>

      <p className="staff-link">
        LG Home Comfort team member? <Link to="/staff">Staff sign-in &rarr;</Link>
      </p>
    </>
  );
}
