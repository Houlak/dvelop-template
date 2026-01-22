import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm, type LoginFormData } from '../../features/auth/components/LoginForm/LoginForm';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { Button } from '../../shared/components/ui/Button/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../shared/components/ui/Card/Card';
import { useLoginPageMutation } from './useLoginPageMutation';

function LoginPage() {
  const mutation = useLoginPageMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Get redirect path from query param or location state
  const redirectParam = searchParams.get('redirect');
  const from = redirectParam || (location.state as { from?: Location })?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        navigate(from, { replace: true });
      }
    });
  };

  return (
    <main className="min-h-[inherit] min-[block-size:inherit] grid place-content-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={onSubmit} isLoading={mutation.isPending} />
        </CardContent>
        <CardFooter>
          {mutation.isError && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'An error occurred during login. Please try again.'}
            </div>
          )}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export default LoginPage;

