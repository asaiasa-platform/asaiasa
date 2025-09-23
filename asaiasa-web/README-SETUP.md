# ASAiASA Web Frontend Setup

## Overview
This is the React + TypeScript + Vite frontend for the ASAiASA platform, featuring internationalization (TH/EN), Google OAuth integration, and API connectivity to the backend.

## Features Implemented
- ✅ **Internationalization (i18n)**: Full TH/EN translation support with flag icons
- ✅ **Page Structure**: Organized folder structure with separate folders for each page
- ✅ **Home Page**: Complete implementation following website layout with navbar and components
- ✅ **Login Page**: Authentication page with real API integration and Google OAuth
- ✅ **API Integration**: Real backend connectivity matching Go API endpoints
- ✅ **Translation System**: Enforced TH/EN translations for all components
- ✅ **Environment Configuration**: Complete env setup with backend reference
- ✅ **Asset Integration**: All website assets copied and integrated (logos, icons, images)
- ✅ **Authentication**: JWT token management and secure API calls
- ✅ **Real Data Types**: TypeScript interfaces matching backend models

## Project Structure
```
src/
├── components/
│   ├── common/           # Shared components (LangSwitcher, etc.)
│   └── layout/           # Layout components (Navbar, Layout)
├── config/
│   └── env.ts           # Environment configuration
├── i18n/
│   └── config.ts        # Internationalization setup
├── pages/
│   ├── home/            # Home page components
│   └── login/           # Login page components
├── providers/
│   └── intl-provider.tsx # Translation provider
└── services/
    └── api.ts           # API client and endpoints
messages/
├── en.json              # English translations
└── th.json              # Thai translations
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure it:
```bash
cp env.example .env
```

Then edit the `.env` file with your specific configuration. Key variables to update:

**Required:**
- `VITE_API_BASE_URL`: Your backend API URL
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

**For Local Development:**
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

**For Production:**
```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_ENVIRONMENT=production
VITE_COOKIE_SECURE=true
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Routes
- `/` - Redirects to home page
- `/home` - Main home page with events, jobs, and organizations
- `/login` - Authentication page with Google OAuth
- `/signup` - User registration (to be implemented)

## Translation System
The application uses `next-intl` for internationalization:

### Adding New Translations
1. Add translation keys to both `messages/en.json` and `messages/th.json`
2. Use the `useTranslations` hook in components:
```typescript
import { useTranslations } from 'next-intl';

const Component = () => {
  const t = useTranslations('SectionName');
  return <h1>{t('title')}</h1>;
};
```

### Language Switching
Users can switch languages using the language switcher in the navbar.

## API Integration
The application connects to the backend API using the configured API client:

### API Response Format
All list endpoints follow this format:
```json
{
  "code": 0,
  "data": [...],
  "page": 1,
  "page_size": 10,
  "total_page": 1,
  "total_data": 1,
  "message": "",
  "data_schema": null
}
```

### Using API Client
```typescript
import { api } from '@/services/api';

// Get events with pagination
const eventsResponse = await api.events.getAll({ _page: 1, _pageSize: 10 });
const events = eventsResponse.data; // Array of Event objects

// Get single event
const eventResponse = await api.events.getById('event-id');
const event = eventResponse.data; // Single Event object

// Authentication
const loginResponse = await api.auth.login({ email: 'user@example.com', password: 'password' });
const { token, user } = loginResponse.data;

// Search functionality
const searchResults = await api.events.search({ query: 'sustainability', _page: 1 });
```

### Available API Endpoints
- **Events**: `/events-paginate`, `/events/{id}`, `/events-paginate/search`
- **Jobs**: `/orgs/jobs/jobs-paginate`, `/jobs/get/{id}`, `/jobs-paginate/search`
- **Organizations**: `/orgs-paginate`, `/orgs/{id}`, `/orgs/list`
- **Authentication**: `/login`, `/signup`, `/logout`, `/auth/me`
- **Recommendations**: `/recommendation`

## Development Guidelines

### Translation Rules (MANDATORY)
- ✅ **NEVER** hardcode text strings in components
- ✅ **ALWAYS** use `useTranslations` hook
- ✅ **ALWAYS** add translations to both EN and TH files
- ✅ **ALWAYS** follow existing translation key structure

### Component Development
- ✅ Use TypeScript with proper types
- ✅ Follow folder structure conventions
- ✅ Implement responsive design (mobile-first)
- ✅ Use Tailwind CSS for styling
- ✅ Include proper error handling

### Code Quality
- ✅ Follow ESLint and Prettier configurations
- ✅ Write clean, readable code with comments
- ✅ Implement proper loading states
- ✅ Use React hooks appropriately

## Build and Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Next Steps
1. Implement additional pages (Events, Jobs, Organizations, etc.)
2. Add authentication context and protected routes
3. Implement search and filtering functionality
4. Add user profile and dashboard pages
5. Integrate real-time notifications
6. Add comprehensive testing

## Notes
- All text content is fully translated in both Thai and English
- The application follows the same design patterns as the main website
- API integration is ready and configured for the backend
- Google OAuth is configured and ready for authentication
- The .cursorrules file enforces translation requirements for all future development
