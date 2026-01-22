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

## 📦 Query Options Pattern: Centralized Query Definitions

The recommended pattern is to **centralize query definitions** using `queryOptions()` from TanStack Query. This ensures type safety and reusability across loaders and components.

### File Structure

```
src/pages/HomePage/
├── HomePage.tsx              # Component
├── HomePage.loader.ts        # Route loader
├── HomePage.queries.ts       # ← Query definitions (NEW)
└── useHomePageMutation.ts    # Mutation hook
```

### Define Query Options Once

```typescript
// src/pages/HomePage/HomePage.queries.ts
import { queryOptions } from '@tanstack/react-query';

export type HomePageData = {
  message: string;
};

export const homePageQueryKey = ['homePageData'] as const;

export const homePageQueryOptions = queryOptions<HomePageData>({
  queryKey: homePageQueryKey,
  queryFn: async () => {
    // Your API call here
    return await apiClient.get('/home-data');
  },
});
```

### Benefits of Query Options

1. **Type Safety**: Types are inferred automatically in both loaders and components
2. **DRY**: Define queryKey and queryFn once, use everywhere
3. **Consistency**: Same query logic in prefetching and client-side fetching
4. **Easy Refactoring**: Change the API call in one place
5. **Better Testing**: Mock the query options, not individual functions

---

## 🔄 Loaders: Prefetch with Query Options

**Loaders** run before a route renders and prefetch data using the centralized query options.

```typescript
// src/pages/HomePage/HomePage.loader.ts
import { QueryClient } from '@tanstack/react-query';
import { homePageQueryOptions, type HomePageData } from './HomePage.queries';

export const homePageLoader = (queryClient: QueryClient) => {
  return async ({ request, params }): Promise<HomePageData> => {
    const response = await queryClient.ensureQueryData(homePageQueryOptions);
    return response;
  };
};
```

### `ensureQueryData` vs `fetchQuery`

- **`ensureQueryData`**: Returns cached data if available, only fetches if missing or stale
  - Use when you want to reuse cached data for better performance
  
- **`fetchQuery`**: Always fetches fresh data, ignoring cache
  - Use when you need guaranteed fresh data on every navigation

### Loader Benefits:
- **No loading spinners**: Data is ready before the page renders
- **Auth guards**: Redirect unauthenticated users before they see protected content
- **Better UX**: Users see complete content immediately, not skeletons
- **SSR-ready**: Loaders can run on the server for true SSR/SSG

---

## 🔍 Queries: Reuse Options in Components

Use the same query options in your component to read from the cache and subscribe to updates.

```typescript
// src/pages/HomePage/HomePage.tsx
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';
import { homePageQueryOptions } from './HomePage.queries';

function HomePage() {
  const initialData = useLoaderData();
  
  // Use the same query options - automatically typed!
  const { data } = useQuery({
    ...homePageQueryOptions,
    initialData, // Use loader data as initial data
  });
  
  return <div>{data.message}</div>;
}
```

### Query Benefits:
- **Automatic caching**: Fetch once, reuse everywhere
- **Background refetching**: Keep data fresh without user interaction
- **Deduplication**: Multiple components requesting the same data = one network request
- **Built-in loading/error states**: No need to manage `useState` for every fetch
- **Optimistic updates**: Update UI instantly, roll back on error
- **Automatic updates**: When cache is invalidated, component refetches automatically

**The Full Picture**: Loader prefetches → Component uses cached data → Mutation invalidates → Component automatically refetches. All with type safety!

---

## ✍️ Mutations: Invalidate and Refetch

**Mutations** handle data modifications (POST, PUT, DELETE) and trigger cache invalidation to keep data fresh.

```typescript
// src/pages/HomePage/useHomePageMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRevalidator } from 'react-router-dom';
import { homePageQueryKey } from './HomePage.queries';

export const useHomePageMutation = () => {
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  return useMutation({
    mutationFn: async (data: FormData) => {
      return await apiClient.post('/submit', data);
    },
    onSuccess: async (data) => {
      // Invalidate the query - marks it as stale
      await queryClient.invalidateQueries({ queryKey: homePageQueryKey });
      
      // Revalidate the route - re-runs the loader
      revalidator.revalidate();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });
};
```

### How Invalidation Works

1. **Form Submission**: User submits form
2. **Mutation Executes**: API call completes successfully
3. **Invalidate Query**: `invalidateQueries` marks the query as stale (data still in cache)
4. **Revalidate Route**: `revalidator.revalidate()` re-runs the loader
5. **Loader Prefetches**: Loader fetches fresh data
6. **Component Refetches**: `useQuery` automatically refetches because query is stale
7. **UI Updates**: Component displays fresh data

### Mutation Benefits:
- **Automatic cache updates**: Invalidate or update related queries
- **Loading states**: Track submission status without manual state
- **Error handling**: Centralized error management
- **Retry logic**: Built-in retry on failure
- **Integration with loaders**: Revalidate routes to prefetch fresh data

---

## 🔗 Complete Data Flow Example

Here's a complete example showing how query options, loaders, queries, and mutations work together:

### 1. Define Query Options (`HomePage.queries.ts`)

```typescript
import { queryOptions } from '@tanstack/react-query';

export type HomePageData = {
  message: string;
  count: number;
};

export const homePageQueryKey = ['homePageData'] as const;

export const homePageQueryOptions = queryOptions<HomePageData>({
  queryKey: homePageQueryKey,
  queryFn: async () => {
    const response = await fetch('/api/home-data');
    return response.json();
  },
});
```

### 2. Prefetch in Loader (`HomePage.loader.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query';
import { homePageQueryOptions, type HomePageData } from './HomePage.queries';

export const homePageLoader = (queryClient: QueryClient) => {
  return async (): Promise<HomePageData> => {
    // Prefetch data before page renders
    return await queryClient.ensureQueryData(homePageQueryOptions);
  };
};
```

### 3. Use in Component (`HomePage.tsx`)

```typescript
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from 'react-router-dom';
import { homePageQueryOptions } from './HomePage.queries';
import { useHomePageMutation } from './useHomePageMutation';

function HomePage() {
  const initialData = useLoaderData();
  
  // Read from cache, subscribe to updates
  const { data, isLoading } = useQuery({
    ...homePageQueryOptions,
    initialData,
  });
  
  const mutation = useHomePageMutation();
  
  const handleSubmit = (formData: FormData) => {
    mutation.mutate(formData, {
      onSuccess: () => {
        // Component-specific: show toast, navigate, etc.
        console.log('Form submitted!');
      },
    });
  };
  
  return (
    <div>
      <h1>{data.message}</h1>
      <p>Count: {data.count}</p>
      {/* Form here */}
    </div>
  );
}
```

### 4. Mutate and Invalidate (`useHomePageMutation.ts`)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRevalidator } from 'react-router-dom';
import { homePageQueryKey } from './HomePage.queries';

export const useHomePageMutation = () => {
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  return useMutation({
    mutationFn: async (data: FormData) => {
      return await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then(r => r.json());
    },
    onSuccess: async () => {
      // Default behavior: Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: homePageQueryKey });
      revalidator.revalidate();
    },
  });
};
```

### The Complete Flow

```
User visits /home
    ↓
Loader runs (prefetch)
    ↓
homePageQueryOptions.queryFn() → Fetch from API
    ↓
Data cached in TanStack Query
    ↓
Component renders with initialData
    ↓
useQuery subscribes to cache updates
    ↓
User submits form
    ↓
Mutation executes
    ↓
onSuccess: invalidateQueries + revalidate
    ↓
Loader re-runs → ensureQueryData fetches fresh data
    ↓
useQuery refetches (because invalidated)
    ↓
Component automatically updates with fresh data ✨
```

---

## 🎯 Mutation Hook Pattern: Override `onSuccess`/`onError`

### The Pattern

**Define mutations in hooks** with sensible defaults (like cache invalidation), then **override in components** for specific behaviors:

```typescript
// ✅ In hook: useHomePageMutation.ts
import { homePageQueryKey } from './HomePage.queries';

export const useHomePageMutation = () => {
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  return useMutation({
    mutationFn: async (data: FormData) => {
      return await apiClient.post('/submit', data);
    },
    onSuccess: async (data) => {
      // Default: Invalidate cache and revalidate route
      await queryClient.invalidateQueries({ queryKey: homePageQueryKey });
      revalidator.revalidate();
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
      // (Default invalidation still happens first)
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

1. **Reusability**: The same mutation hook can be used in multiple components with different success behaviors
   ```typescript
   // AdminPanel.tsx: Redirect to admin dashboard after cache update
   mutation.mutate(data, { 
     onSuccess: () => navigate('/admin') 
   });
   
   // SettingsPage.tsx: Just show a toast after cache update
   mutation.mutate(data, { 
     onSuccess: () => toast('Updated!') 
   });
   
   // Both cases: Cache is invalidated and data refetches automatically
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
4. **Use query options pattern**: Centralize query definitions in `*.queries.ts` files
5. **Use loaders for prefetching**: Use `ensureQueryData` or `fetchQuery` with query options
6. **Use queries in components**: Reuse the same query options with `useQuery`
7. **Define mutations in hooks**: Include default behaviors and invalidation logic
8. **Customize in components**: Override `onSuccess`/`onError` for component-specific behavior

---

## 📖 Learn More

- [React Router Loaders](https://reactrouter.com/en/main/route/loader)
- [TanStack Query](https://tanstack.com/query/latest)
- [Feature-Based Architecture](https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25)
