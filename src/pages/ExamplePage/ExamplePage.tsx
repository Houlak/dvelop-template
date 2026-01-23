import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLoaderData } from 'react-router-dom';
import * as yup from 'yup';
import { useLogout } from '../../features/auth/hooks/useLogout';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { exampleQueryOptions } from '../../features/example/api/example.queries';
import { useExampleMutation, type FormData } from '../../features/example/hooks/useExampleMutation';
import { Button } from '../../shared/components/ui/Button/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../shared/components/ui/Card/Card';
import { FieldError, FieldGroup, FieldLabel } from '../../shared/components/ui/Field/Field';
import { Input } from '../../shared/components/ui/Input/Input';
import type { examplePageLoader } from './ExamplePage.loader';

const formSchema = yup.object({
  name: yup.string().min(5, ({ min }) => `Name must be at least ${min} characters`).required('Name is required'),
});

function ExamplePage() {
  const initialData = useLoaderData() as Awaited<ReturnType<ReturnType<typeof examplePageLoader>>> | undefined;
  
  const { data } = useQuery({...exampleQueryOptions, initialData });
  
  const mutation = useExampleMutation();
  const { logout, isLoggingOut } = useLogout();
  const clearAuth = useAuthStore((state) => state.clearAuth);

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
    <main className="min-h-[inherit] [min-block-size:inherit] grid place-items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>
            <h1>Houlak frontend template</h1>
          </CardTitle>
          <CardDescription>
            <p>This is a template for a frontend application.</p>

            {data?.message && (
              <p>{data.message}</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mb-4">
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
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={logout} disabled={isLoggingOut}>
            Test Logout
          </Button>
          <Button type="button" variant="outline" onClick={clearAuth} disabled={isLoggingOut}>
            Test Clear Auth
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Example Items</h2>
        <div className="grid gap-3 grid-cols-3">
          {[1, 2, 3, 4, 5].map((id) => (
            <Link key={id} to={`/example/${id}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-medium">Example Item {id}</h3>
                <p className="text-sm text-gray-600">Click to view details →</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ExamplePage;

