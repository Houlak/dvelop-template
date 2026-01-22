import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../assets/logo.png';
import { useLogout } from '../../features/auth/hooks/useLogout';
import { Button } from '../../shared/components/ui/Button/Button';
import { FieldError, FieldGroup, FieldLabel } from '../../shared/components/ui/Field/Field';
import { Input } from '../../shared/components/ui/Input/Input';
import type { homePageLoader } from './HomePage.loader';
import { homePageQueryOptions } from './HomePage.queries';
import { useHomePageMutation, type FormData } from './useHomePageMutation';

const formSchema = yup.object({
  name: yup.string().min(5, ({ min }) => `Name must be at least ${min} characters`).required('Name is required'),
});

function HomePage() {
  const initialData = useLoaderData() as Awaited<ReturnType<ReturnType<typeof homePageLoader>>> | undefined;
  
  const { data } = useQuery({...homePageQueryOptions, initialData });
  
  const mutation = useHomePageMutation();
  const { logout, isLoggingOut } = useLogout();

  const {
    control,
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
    defaultValues: { name: '' }
  }); 

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <main className="min-h-[inherit] min-[block-size:inherit] grid place-content-center">
      <img 
        src={logo} 
        className="mx-auto animate-bounce" 
        alt="" 
      />
      <h1>Houlak frontend template</h1>
      
      {data?.message && (
        <p className="text-center mb-4">{data.message}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Controller 
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FieldGroup>
                <FieldLabel>Name</FieldLabel>
                <Input {...field} id="name" placeholder="Name" />
                <FieldError errors={[error]} />
              </FieldGroup>
            )}
          />
        </div>
        <Button 
          type="submit" 
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>

      {mutation.isSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          Success! Form submitted successfully.
        </div>

        
      )}

      <Button type="button" onClick={logout} disabled={isLoggingOut}>
        Logout
      </Button>
    </main>
  );
}

export default HomePage;

