import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import ReportPanel from './ReportPanel.jsx';

export default function ReportPage() {
  return (
    <>
      <Header />
      <main className="hero">
        <div className="wrap page-narrow">
          <Link to="/" className="page-back">← Back to Portal</Link>
          <h1 className="page-title">Report a Concern</h1>
          <p className="lede page-lede">Tell us what went wrong and we'll get it moving.</p>
          <ReportPanel />
        </div>
      </main>
    </>
  );
}
