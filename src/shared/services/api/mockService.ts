import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

type User = {
  id: number;
  name: string;
  email: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
};

export const mockData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ] as User[],
  posts: [
    { id: 1, title: 'First Post', content: 'Hello World!', authorId: 1 },
    { id: 2, title: 'Second Post', content: 'Hello World 2!', authorId: 2 },
  ] as Post[],
};

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json({ data: mockData.users });
  }),

  http.get('/api/users/:id', ({ params }) => {
    const userId = Number(params.id);
    const user = mockData.users.find((u) => u.id === userId);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: user });
  }),

  http.post('/api/users', async ({ request }) => {
    const user = (await request.json()) as Partial<User>;
    const newUser = { ...user, id: mockData.users.length + 1 } as User;
    mockData.users.push(newUser);
    return HttpResponse.json({ data: newUser }, { status: 201 });
  }),

  http.get('/api/posts', () => {
    return HttpResponse.json({ data: mockData.posts });
  }),

  http.get('/api/posts/:id', ({ params }) => {
    const postId = Number(params.id);
    const post = mockData.posts.find((p) => p.id === postId);
    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: post });
  }),

  http.post('/api/posts', async ({ request }) => {
    const post = (await request.json()) as Partial<Post>;
    const newPost = { ...post, id: mockData.posts.length + 1 } as Post;
    mockData.posts.push(newPost);
    return HttpResponse.json({ data: newPost }, { status: 201 });
  }),
];

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}
