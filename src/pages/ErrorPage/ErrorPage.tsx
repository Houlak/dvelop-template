import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    // Error from route loader/action
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || 'An error occurred';
  } else if (error instanceof Error) {
    // Standard JavaScript error
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    // String error
    errorMessage = error;
  } else {
    // Unknown error
    errorMessage = 'An unknown error occurred';
  }

  return (
    <main className="min-h-[inherit] min-[block-size:inherit] grid place-content-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          {errorStatus ? `Error ${errorStatus}` : 'Oops!'}
        </h1>
        <p className="text-xl mb-2">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-600 mb-4">
          <i>{errorMessage}</i>
        </p>
        {error instanceof Error && error.stack && (
          <details className="mt-4 text-left max-w-2xl mx-auto">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              Error Details
            </summary>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {error.stack}
            </pre>
          </details>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    </main>
  );
}

export default ErrorPage;

