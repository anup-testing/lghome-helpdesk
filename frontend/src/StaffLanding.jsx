import { Link } from 'react-router-dom';
import PublicHeader from './components/PublicHeader.jsx';

const PORTALS = [
  {
    to: '/technician',
    tag: 'Technician',
    title: 'Technician Portal',
    description: "See today's jobs, open a work order, and log completed service.",
  },
  {
    to: '/dispatcher',
    tag: 'Dispatcher',
    title: 'Dispatcher Portal',
    description: 'Triage incoming tickets, assign technicians, and manage the schedule.',
  },
  {
    to: '/admin',
    tag: 'Admin',
    title: 'Admin Portal',
    description: 'Manage users, technicians, customers, reports, and billing.',
  },
];

export default function StaffLanding() {
  return (
    <div className="landing">
      <PublicHeader tag="Staff Sign-in" />

      <main className="wrap landing-hero">
        <h1>Pick your portal</h1>
        <p className="lede">Internal tools for technicians, dispatch, and admin staff.</p>

        <div className="portal-grid">
          {PORTALS.map((portal) => (
            <Link key={portal.to} to={portal.to} className="portal-card">
              <span className="portal-card-tag">{portal.tag}</span>
              <span className="portal-card-title">{portal.title}</span>
              <span className="portal-card-desc">{portal.description}</span>
              <span className="portal-card-cta">Enter portal &rarr;</span>
            </Link>
          ))}
        </div>

        <p className="staff-link">
          Here to report an issue instead? <Link to="/">Back to Customer Care &rarr;</Link>
        </p>
      </main>
    </div>
  );
}
