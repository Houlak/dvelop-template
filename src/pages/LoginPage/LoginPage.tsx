import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, type LoginFormData } from '../../features/auth/components/LoginForm/LoginForm';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { useLoginPageMutation } from './useLoginPageMutation';

function LoginPage() {
  const mutation = useLoginPageMutation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await mutation.mutateAsync(data);
      // Redirect after successful login (auth is stored in Zustand store)
      navigate('/');
    } catch (error) {
      // Error is handled by mutation.onError
      console.error('Login submission error:', error);
    }
  };

  return (
    <main className="min-h-[inherit] min-[block-size:inherit] grid place-content-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
        
        <LoginForm onSubmit={onSubmit} isLoading={mutation.isPending} />

        {mutation.isError && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
            {mutation.error instanceof Error
              ? mutation.error.message
              : 'An error occurred during login. Please try again.'}
          </div>
        )}

        {mutation.isSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            Login successful! Redirecting...
          </div>
        )}
      </div>
    </main>
  );
}

export default LoginPage;

