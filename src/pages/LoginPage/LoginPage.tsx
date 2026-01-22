import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm, type LoginFormData } from '../../features/auth/components/LoginForm/LoginForm';
import { useLogin } from '../../features/auth/hooks/useLogin';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/Card/Card';

function LoginPage() {
  const mutation = useLogin();
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
    <main className="min-h-[inherit] min-[block-size:inherit] grid place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="flex-col gap-2">
          <LoginForm onSubmit={onSubmit} isLoading={mutation.isPending} />
          {mutation.isError && (
            <div className="w-fullmt-4 p-3 bg-red-100 text-red-800 rounded">
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'An error occurred during login. Please try again.'}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default LoginPage;

