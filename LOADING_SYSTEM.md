# Loading System Documentation

This document describes the comprehensive loading system implemented across both the website and admin-ui applications to improve user experience during slow responses.

## Overview

The loading system consists of:
1. **Global Loading Page** - Shows when the application first loads
2. **Page Navigation Loading** - Shows when navigating between pages
3. **Route-specific Loading** - Shows for specific routes using Next.js loading.tsx files
4. **Component-level Loading** - For forms, API calls, and other async operations

## Components

### 1. LoadingSpinner Component
A reusable spinner component with different sizes.

**Location:**
- `website/src/components/LoadingSpinner.tsx`
- `admin-ui/src/components/LoadingSpinner.tsx`

**Usage:**
```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

<LoadingSpinner size="lg" className="text-blue-600" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `className`: Additional CSS classes

### 2. GlobalLoadingPage Component
Full-screen loading page with logo and branding.

**Location:**
- `website/src/components/GlobalLoadingPage.tsx`
- `admin-ui/src/components/GlobalLoadingPage.tsx`

**Features:**
- Animated logo
- Loading spinner
- Branded loading text
- Full-screen overlay

### 3. LoadingProvider Context
Manages global loading state across the application.

**Location:**
- `website/src/context/LoadingContext.tsx`
- `admin-ui/src/context/LoadingContext.tsx`

**Features:**
- Initial page load (1.5 seconds)
- Page navigation loading (0.8 seconds)
- Manual loading control
- Automatic pathname-based loading

**Usage:**
```tsx
import { useLoading } from '@/context/LoadingContext';

const { isLoading, showPageLoading, hidePageLoading } = useLoading();
```

### 4. LoadingLink Component
Enhanced Link component that triggers loading state on navigation.

**Location:**
- `website/src/components/LoadingLink.tsx`
- `admin-ui/src/components/LoadingLink.tsx`

**Usage:**
```tsx
import LoadingLink from '@/components/LoadingLink';

<LoadingLink href="/dashboard" className="nav-link">
  Dashboard
</LoadingLink>
```

### 5. useLoadingState Hook
Custom hook for managing loading states in components.

**Location:**
- `website/src/hooks/useLoadingState.ts`
- `admin-ui/src/hooks/useLoadingState.ts`

**Usage:**
```tsx
import { useLoadingState } from '@/hooks/useLoadingState';

const { isLoading, withLoading } = useLoadingState();

const handleSubmit = async () => {
  await withLoading(async () => {
    // Your async operation
    await submitForm();
  });
};
```

## Implementation Details

### 1. Root Layout Integration
Both applications have the LoadingProvider wrapped around the entire app in their root layouts:

```tsx
// layout.tsx
<NextIntlClientProvider messages={messages}>
  <LoadingProvider>
    <Toaster />
    <GoogleAuthProvider>
      <AuthProvider>{children}</AuthProvider>
    </GoogleAuthProvider>
  </LoadingProvider>
</NextIntlClientProvider>
```

### 2. Next.js Loading Files
Route-specific loading states using Next.js App Router:

**Website:**
- `src/app/[locale]/loading.tsx` - Root level loading
- `src/app/[locale]/(pages)/loading.tsx` - Pages group loading

**Admin-UI:**
- `src/app/[locale]/loading.tsx` - Root level loading
- `src/app/[locale]/(pages)/loading.tsx` - Pages group loading
- `src/app/[locale]/(auth)/loading.tsx` - Auth group loading

### 3. Loading Timing
- **Initial Load**: 1.5 seconds (configurable in LoadingProvider)
- **Page Navigation**: 0.8 seconds (configurable in LoadingProvider)
- **Route Loading**: Automatic based on Next.js Suspense boundaries

## Customization

### Changing Loading Duration
Edit the timeout values in `LoadingContext.tsx`:

```tsx
// Initial load duration
setTimeout(() => {
  setIsLoading(false);
}, 1500); // Change this value

// Page navigation duration
setTimeout(() => {
  setIsPageLoading(false);
}, 800); // Change this value
```

### Styling
The loading components use Tailwind CSS classes. Customize by:
1. Modifying the component classes directly
2. Using the `className` prop for additional styling
3. Updating the Tailwind configuration

### Logo and Branding
Update the logo in `GlobalLoadingPage.tsx`:
```tsx
<Image
  src="/your-logo.svg"  // Change logo path
  alt="Your App Name"   // Change alt text
  width={120}
  height={120}
  className="animate-pulse"
  priority
/>
```

## Best Practices

### 1. Use LoadingLink for Navigation
Replace regular Next.js Link components with LoadingLink for better UX:

```tsx
// Instead of
<Link href="/dashboard">Dashboard</Link>

// Use
<LoadingLink href="/dashboard">Dashboard</LoadingLink>
```

### 2. Wrap Async Operations
Use the `withLoading` function for API calls and form submissions:

```tsx
const handleSubmit = async (data: FormData) => {
  await withLoading(async () => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  });
};
```

### 3. Manual Loading Control
For complex scenarios, use manual loading control:

```tsx
const { showPageLoading, hidePageLoading } = useLoading();

const handleComplexOperation = async () => {
  showPageLoading();
  try {
    // Complex operation
    await performComplexTask();
  } finally {
    hidePageLoading();
  }
};
```

## Performance Considerations

1. **Loading Duration**: Keep loading times reasonable (1-2 seconds max)
2. **Image Optimization**: Use `priority` prop for loading page images
3. **Lazy Loading**: Components are client-side only where needed
4. **Memory Management**: Timers are properly cleaned up in useEffect

## Browser Compatibility

The loading system is compatible with:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Loading Not Showing
1. Check if LoadingProvider is wrapped around your app
2. Verify the loading duration isn't too short
3. Ensure components are properly imported

### Loading Stuck
1. Check for JavaScript errors in console
2. Verify async operations are properly handled
3. Check if hidePageLoading is called in error cases

### Performance Issues
1. Reduce loading duration if too long
2. Optimize images used in loading screens
3. Check for memory leaks in useEffect cleanup

## Future Enhancements

Potential improvements to consider:
1. Progress bars for long operations
2. Skeleton loading for specific content
3. Preloading strategies
4. Loading state persistence across page refreshes
5. Analytics for loading performance
