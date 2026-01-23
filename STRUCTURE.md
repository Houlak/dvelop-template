# React Architecture & Folder Structure

## Recommended Architecture: Feature-Based with Domain Separation

### Core Principles
1. **Feature-based organization** — Group by business domain/feature
2. **Separation of concerns** — Clear boundaries between layers
3. **Reusability** — Shared components and utilities
4. **Scalability** — Easy to add features without refactoring
5. **Testability** — Co-located tests with features
6. **No barrel files** — Avoid index.ts barrel exports; import directly from source files

### Folder Structure with feature examples

```
src/
├── app/                          # App-level configuration
│   ├── providers/                # Global providers (QueryClient, Theme, etc.)
│   │   ├── AppProviders.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── store/                    # Global state (if using Redux/Zustand)
│   │   ├── slices/
│   │   └── store.ts
│   ├── router/                   # Route configuration
│   │   ├── routes.tsx
│   │   ├── protected-route.tsx
│   │   └── route-guards.tsx
│   └── config/                   # App configuration
│       ├── constants.ts
│       ├── env.ts
│       └── api.config.ts
│
├── features/                     # Feature modules (business domains)
│   ├── auth/
│   │   ├── api/                  # Feature-specific API calls
│   │   │   ├── auth.api.ts
│   │   │   └── auth.types.ts
│   │   ├── components/           # Feature-specific components
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LoginForm.test.tsx
│   │   │   │   └── LoginForm.styles.ts
│   │   │   └── RegisterForm/
│   │   ├── hooks/               # Feature-specific hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── store/               # Feature-specific state (if needed)
│   │   │   └── auth.slice.ts
│   │   └── utils/               # Feature-specific utilities
│   │       └── token.utils.ts
│   │
│   ├── dashboard/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── DashboardLayout/
│   │   │   ├── StatsCard/
│   │   │   └── ChartWidget/
│   │   └── hooks/
│   │       └── useDashboardData.ts
│   │
│   ├── users/
│   │   ├── api/
│   │   │   ├── users.api.ts
│   │   │   └── users.types.ts
│   │   ├── components/
│   │   │   ├── UserList/
│   │   │   ├── UserCard/
│   │   │   ├── UserForm/
│   │   │   └── UserDetails/
│   │   └── hooks/
│   │       ├── useUsers.ts
│   │       ├── useUser.ts
│   │       └── useCreateUser.ts
│   │
│   └── products/                # Another feature example
│       ├── api/
│       ├── components/
│       └── hooks/
│
├── shared/                       # Shared across features
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Base UI components (Button, Input, etc.)
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── Button.types.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Select/
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── Container/
│   │   │
│   │   └── feedback/           # Feedback components
│   │       ├── LoadingSpinner/
│   │       ├── ErrorBoundary/
│   │       └── Toast/
│   │
│   ├── hooks/                   # Shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── useClickOutside.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── format/
│   │   │   ├── date.utils.ts
│   │   │   ├── currency.utils.ts
│   │   │   └── number.utils.ts
│   │   ├── validation/
│   │   │   └── validators.ts
│   │   ├── helpers/
│   │   │   ├── array.helpers.ts
│   │   │   └── object.helpers.ts
│   │   └── constants/
│   │       └── regex.constants.ts
│   │
│   ├── services/                # API services
│   │   ├── api/
│   │   │   ├── client.ts        # Axios instance
│   │   │   ├── interceptors.ts
│   │   │   └── endpoints.ts     # API endpoint constants
│   │   ├── storage/
│   │   │   ├── localStorage.service.ts
│   │   │   └── sessionStorage.service.ts
│   │   └── analytics/
│   │       └── analytics.service.ts
│   │
│   ├── types/                   # Shared TypeScript types
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── lib/                     # Third-party library wrappers
│   │   ├── react-query/
│   │   │   └── query-keys.ts
│   │   └── react-hook-form/
│   │       └── form-schemas.ts
│   │
│   └── styles/                  # Global styles
│       ├── themes/
│       │   ├── light.theme.ts
│       │   └── dark.theme.ts
│       ├── globals.css
│       └── variables.css
│
├── pages/                        # Page-level components (route entry points)
│   ├── HomePage/                 # Example: Expanded page structure (as it grows)
│   │   ├── HomePage.tsx          # Main page component
│   │   ├── HomePage.test.tsx     # Page-specific tests
│   │   ├── components/           # Page-specific components (used only on this page)
│   │   │   ├── HeroSection/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   └── HeroSection.test.tsx
│   │   │   ├── FeaturedProducts/
│   │   │   │   ├── FeaturedProducts.tsx
│   │   │   │   └── FeaturedProducts.test.tsx
│   │   │   └── NewsletterSignup/
│   │   │       ├── NewsletterSignup.tsx
│   │   │       └── NewsletterSignup.test.tsx
│   │   ├── hooks/                # Page-specific hooks
│   │   │   └── useHomePageData.ts
│   │   ├── utils/                # Page-specific utilities
│   │   │   └── homePage.helpers.ts
│   │   ├── types/                # Page-specific types (if not used elsewhere)
│   │   │   └── homePage.types.ts
│   │   └── constants/            # Page-specific constants
│   │       └── homePage.constants.ts
│   ├── LoginPage/
│   ├── DashboardPage/
│   └── NotFoundPage/
│
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── videos/
│
├── tests/                        # Global test utilities
│   ├── setup.ts
│   ├── test-utils.tsx
│   └── mocks/
│
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
└── vite-env.d.ts
```

