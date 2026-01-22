# React Frontend Template

A production-ready React template built with TypeScript, React Router, TanStack Query, and feature-based architecture.

## 🏗️ Architecture Principles

This template follows a **feature-based architecture** with clear separation of concerns. See [STRUCTURE.md](./STRUCTURE.md) for the complete folder structure.

### Why These Core Principles?

#### 1. **Feature-Based Organization**
- **What**: Group code by business domain (e.g., `auth/`, `users/`, `products/`)
- **Why**: As your app grows, features are easier to locate, modify, and remove. New developers can understand one feature at a time without navigating the entire codebase.

#### 2. **Separation of Concerns**
- **What**: Each layer has a clear responsibility (API, components, hooks, state)
- **Why**: Changes in one layer don't cascade through the app. You can swap your API client, UI library, or state management without touching business logic.

#### 3. **Reusability Through `shared/`**
- **What**: Common components, hooks, and utilities live in `shared/`
- **Why**: Prevents code duplication and ensures consistency. Update a Button component once, it reflects everywhere.

#### 4. **Scalability**
- **What**: Add new features by creating new folders, not refactoring existing code
- **Why**: Teams can work in parallel on different features without merge conflicts. Onboarding is faster when structure is predictable.

#### 5. **Co-located Tests**
- **What**: Tests live next to the code they test (`Component.tsx` → `Component.test.tsx`)
- **Why**: When you modify code, the test is right there. Reduces context switching and makes TDD natural.

#### 6. **No Barrel Files**
- **What**: Import directly from source files, not from `index.ts` re-exports
- **Why**: Better tree-shaking, clearer dependencies, and no circular import issues. Your IDE can navigate to the actual file instantly.

---

## 🛣️ Routing System

We use **React Router v6** with **loaders** and **TanStack Query** for data management.

### How It Works

```typescript
// src/app/router/routes.tsx
const getRoutes = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          element: <ProtectedLayout />,
          loader: requireAuthLoader,  // ← Auth check happens here
          children: [
            {
              index: true,
              element: <HomePage />,
              loader: homePageLoader(queryClient),  // ← Data prefetch
            },
          ],
        },
      ],
    },
  ]);
```

**Flow**:
1. User navigates to `/`
2. `requireAuthLoader` runs → checks authentication, redirects if needed
3. `homePageLoader` runs → prefetches data
4. `<HomePage />` renders with data already available

---

## 🔄 Why Use Loaders?

**Loaders** run before a route renders and can prefetch data or perform checks.

```typescript
// src/pages/HomePage/HomePage.loader.ts
export const homePageLoader = (queryClient: QueryClient) => {
  return async ({ request, params }) => {
    const response = await queryClient.ensureQueryData({
      queryKey: ['homePageData'],
      queryFn: async () => fetchData(),
    });
    return response;
  };
};
```

### Benefits:
- **No loading spinners**: Data is ready before the page renders
- **Auth guards**: Redirect unauthenticated users before they see protected content
- **Better UX**: Users see complete content immediately, not skeletons
- **SSR-ready**: Loaders can run on the server for true SSR/SSG

---

## 🔍 Why Use Queries (TanStack Query)?

**Queries** handle data fetching with automatic caching, refetching, and state management.

```typescript
// In a component
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

### Benefits:
- **Automatic caching**: Fetch once, reuse everywhere
- **Background refetching**: Keep data fresh without user interaction
- **Deduplication**: Multiple components requesting the same data = one network request
- **Built-in loading/error states**: No need to manage `useState` for every fetch
- **Optimistic updates**: Update UI instantly, roll back on error

**When combined with loaders**: The loader prefetches, the query reads from cache. Instant render + always fresh data.

---

## ✍️ Why Use Mutations?

**Mutations** handle data modifications (POST, PUT, DELETE) with side effects.

```typescript
// src/pages/HomePage/useHomePageMutation.ts
export const useHomePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      return await apiClient.post('/submit', data);
    },
    onSuccess: (data) => {
      // Default success behavior
      queryClient.invalidateQueries({ queryKey: ['relatedData'] });
    },
    onError: (error) => {
      // Default error handling
      console.error('Mutation error:', error);
    },
  });
};
```

### Benefits:
- **Automatic cache updates**: Invalidate or update related queries
- **Loading states**: Track submission status without manual state
- **Error handling**: Centralized error management
- **Retry logic**: Built-in retry on failure

---

## 🎯 Mutation Hook Pattern: Override `onSuccess`/`onError`

### The Pattern

**Define mutations in hooks** with sensible defaults, then **override in components** for specific behaviors:

```typescript
// ✅ In hook: useHomePageMutation.ts
export const useHomePageMutation = () => {
  return useMutation({
    mutationFn: submitForm,
    onSuccess: (data) => {
      // Default: Invalidate cache
      queryClient.invalidateQueries({ queryKey: ['relatedData'] });
    },
    onError: (error) => {
      // Default: Log error
      console.error('Error:', error);
    },
  });
};

// ✅ In component: HomePage.tsx
const mutation = useHomePageMutation();

const onSubmit = (data: FormData) => {
  mutation.mutate(data, {
    onSuccess: () => {
      // Override: Add component-specific behavior
      reset();  // Clear form
      navigate('/success');  // Navigate away
      toast.success('Saved!');  // Show notification
    },
    onError: (error) => {
      // Override: Show user-friendly error
      setErrorMessage(error.message);
    },
  });
};
```

### Benefits

1. **Reusability**: The same mutation hook can be used in multiple components
   ```typescript
   // AdminPanel.tsx: Redirect to admin dashboard
   mutation.mutate(data, { onSuccess: () => navigate('/admin') });
   
   // SettingsPage.tsx: Just show a toast
   mutation.mutate(data, { onSuccess: () => toast('Updated!') });
   ```

2. **Sensible defaults**: Every mutation automatically updates the cache, even if you forget

3. **Flexibility**: Each component can customize behavior without duplicating API logic

4. **Testing**: Mock the mutation hook once, test component-specific behaviors separately

5. **Single Source of Truth**: API endpoint and base logic defined once, used everywhere

---

## 🚀 Getting Started

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

---

## 📚 Tech Stack

- **React 18** + **TypeScript**
- **React Router v6** (with loaders)
- **TanStack Query v5** (data fetching)
- **React Hook Form** + **Yup** (form management)
- **Vite** (build tool)
- **Tailwind CSS** (styling)

---

## 🤝 Contributing

1. Follow the folder structure in [STRUCTURE.md](./STRUCTURE.md)
2. Import directly from source files (no `index.ts` barrels)
3. Co-locate tests with components
4. Use loaders for prefetching, queries for reading, mutations for writing
5. Define mutations in hooks, customize in components

---

## 📖 Learn More

- [React Router Loaders](https://reactrouter.com/en/main/route/loader)
- [TanStack Query](https://tanstack.com/query/latest)
- [Feature-Based Architecture](https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25)
