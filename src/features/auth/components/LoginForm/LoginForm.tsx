import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { FieldError, FieldGroup, FieldLabel } from '../../../../shared/components/ui/Field/Field';
import { Input } from '../../../../shared/components/ui/Input/Input';

const loginFormSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  isLoading?: boolean;
};

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
      <div className="grid gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FieldGroup>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="email"
              />
              <FieldError errors={[error]} />
            </FieldGroup>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <FieldGroup>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <FieldError errors={[error]} />
            </FieldGroup>
          )}
        />
      </div>

      <button
        type="submit"
        className="block mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={isLoading || !isValid}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

