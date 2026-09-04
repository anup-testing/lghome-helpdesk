import { Link } from 'react-router-dom';
import Header from './Header.jsx';
import FeedbackPanel from './FeedbackPanel.jsx';

export default function FeedbackPage() {
  return (
    <>
      <Header />
      <main className="hero">
        <div className="wrap page-narrow">
          <Link to="/" className="page-back">← Back to Portal</Link>
          <h1 className="page-title">Give Feedback</h1>
          <p className="lede page-lede">Tell us how we did - share feedback about LG Home Comfort services.</p>
          <FeedbackPanel />
        </div>
      </main>
    </>
  );
}
