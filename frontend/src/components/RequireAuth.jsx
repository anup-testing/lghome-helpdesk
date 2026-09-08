import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, PORTAL_HOME } from '../lib/auth.jsx';

export default function RequireAuth({ roles, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={PORTAL_HOME[user.role] ?? '/'} replace />;
  }

  return children;
}
