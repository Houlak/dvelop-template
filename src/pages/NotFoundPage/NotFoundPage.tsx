import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="min-h-[inherit] [min-block-size:inherit] grid place-content-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;

