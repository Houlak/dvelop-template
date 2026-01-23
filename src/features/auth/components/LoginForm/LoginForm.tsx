import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button } from '../../../../shared/components/ui/Button/Button';
import { FieldError, FieldGroup, FieldLabel } from '../../../../shared/components/ui/Field/Field';
import { Input } from '../../../../shared/components/ui/Input/Input';

const loginFormSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, ({ min }) => `Password must be at least ${min} characters`).required('Password is required'),
});

export type LoginFormData = yup.InferType<typeof loginFormSchema>;

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  isLoading?: boolean;
};

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

      <Button type="submit" disabled={isLoading || !isValid} className="w-full mt-4">
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}

