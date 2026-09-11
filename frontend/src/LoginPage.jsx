import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PublicHeader from './components/PublicHeader.jsx';
import { useAuth, PORTAL_HOME } from './lib/auth.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      // Administrators always start from the ticket-management home instead of
      // returning to an individual user's ticket detail page.
      const destination = user.role === 'ADMIN'
        ? `${PORTAL_HOME.ADMIN}/tickets`
        : from ?? PORTAL_HOME[user.role] ?? '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PublicHeader tag="Staff Sign-in" />

      <main className="hero">
        <div className="wrap page-narrow">
          <Link to="/staff" className="page-back">
            &larr; Back to Portal Picker
          </Link>
          <h1 className="page-title">Sign in</h1>
          <p className="lede page-lede">Use your LG Home Comfort staff account to continue.</p>

          <div className="panel">
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="loginEmail">Email</label>
                <input
                  id="loginEmail"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@lghomecomfort.com"
                />
              </div>
              <div className="field">
                <label htmlFor="loginPassword">Password</label>
                <input
                  id="loginPassword"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
              </div>
              <button className="submit" type="submit" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      </main>
    </>
  );
}
