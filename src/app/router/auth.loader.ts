import type { LoaderFunctionArgs } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store';

/**
 * Loader function that checks authentication
 * Redirects to login if user is not authenticated
 */
export async function requireAuthLoader({ request }: LoaderFunctionArgs) {
  const { isAuthenticated } = useAuthStore.getState();
  
  if (!isAuthenticated) {
    const url = new URL(request.url);
    console.log(url);
    return redirect(`/login?redirect=${encodeURIComponent(url.pathname)}`);
  }
  
  return null;
}

