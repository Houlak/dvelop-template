import { Outlet } from 'react-router-dom';

/**
 * Layout component for protected routes
 * The auth check happens in the loader, this just renders children
 */
export function ProtectedLayout() {
  return <Outlet />;
}

