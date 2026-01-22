import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../assets/logo.png';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { FieldError, FieldGroup, FieldLabel } from '../../shared/components/ui/Field/Field';
import { Input } from '../../shared/components/ui/Input/Input';
import type { homePageLoader } from './HomePage.loader';
import { useHomePageMutation, type FormData } from './useHomePageMutation';

const formSchema = yup.object({
  name: yup.string().min(5, (value) => `Name must be at least ${value} characters`).required('Name is required'),
});

function HomePage() {
  const initialData = useLoaderData() as Awaited<ReturnType<ReturnType<typeof homePageLoader>>> | undefined;
  const mutation = useHomePageMutation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.clearAuth);

  const {
    control,
    handleSubmit,
    formState,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
  }); 

  const { errors, isValid } = formState;

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data);
      // Reset form on success
      reset();
      navigate('/');
    } catch (error) {
      // Error is handled by mutation.onError and useEffect above
      console.error('Submission error:', error);
    }
  };

  return (
    <main className="min-h-[inherit] min-[block-size:inherit] grid place-content-center">
      <img 
        src={logo} 
        className="mx-auto animate-bounce" 
        alt="" 
      />
      <h1>Houlak frontend template</h1>
      
      {initialData?.message && (
        <p className="text-center mb-4">{initialData.message}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Controller 
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => {
              console.log(error);
              return (
              <>
              <FieldGroup>
                <FieldLabel>Name</FieldLabel>
                <Input {...field} id="name" placeholder="Name" />
                <FieldError errors={[error]} />
              </FieldGroup>
              </>
            )}}
          />
        </div>
        <button 
          type="submit" 
          className="block mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {mutation.isSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          Success! Form submitted successfully.
        </div>

        
      )}

    <button 
    type="button"
    className="block mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" 
    onClick={() => {
          logout();
        }}>
          Logout
          </button>
    </main>
  );
}

export default HomePage;

