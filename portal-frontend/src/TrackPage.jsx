import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import TrackPanel from './TrackPanel.jsx';

export default function TrackPage() {
  return (
    <>
      <Header />
      <main className="hero">
        <div className="wrap page-narrow">
          <Link to="/" className="page-back">← Back to Portal</Link>
          <h1 className="page-title">Track a Concern</h1>
          <p className="lede page-lede">Check the live status of your open request.</p>
          <TrackPanel />
        </div>
      </main>
    </>
  );
}
