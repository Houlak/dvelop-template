import { Link, useLoaderData } from 'react-router-dom';
import { Button } from '../../shared/components/ui/Button/Button';
import { Card } from '../../shared/components/ui/Card/Card';
import type { exampleDetailPageLoader } from './ExampleDetailPage.loader';

function ExampleDetailPage() {
  const data = useLoaderData() as Awaited<ReturnType<ReturnType<typeof exampleDetailPageLoader>>>;
  
  return (
    <main className="min-h-[inherit] min-[block-size:inherit] grid place-content-center p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline">← Back to Example List</Button>
          </Link>
        </div>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
          
          <div className="mb-4 text-sm text-gray-500">
            Item ID: {data.id}
          </div>

          <p className="text-lg text-gray-700 mb-6">{data.description}</p>

          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-line">{data.content}</p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link to="/">
              <Button>Back to Example List</Button>
            </Link>
            
            {/* Navigation to other example items */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <Link key={num} to={`/example/${num}`}>
                  <Button 
                    variant={data.id === String(num) ? 'default' : 'outline'}
                    size="sm"
                  >
                    {num}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default ExampleDetailPage;

