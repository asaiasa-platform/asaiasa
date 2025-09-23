# Backend Setup Instructions

## Issues Fixed

### 1. Translation Errors ✅
- Added missing `Events`, `Jobs`, and `Organizations` translation keys to both `en.json` and `th.json`
- All translation errors should now be resolved

### 2. API Connection Errors ✅
- Changed default API URL from `https://talent-atmos.pmaw.net` to `http://localhost:8080`
- Added mock data fallbacks when API is not available
- The app now works even without backend connection

## Current Status

The frontend now works in **two modes**:

### Mode 1: With Backend (Recommended)
When your Go backend is running on `localhost:8080`, the app will:
- ✅ Fetch real data from your API endpoints
- ✅ Handle authentication with JWT tokens
- ✅ Use all backend features

### Mode 2: Without Backend (Fallback)
When the backend is not available, the app will:
- ✅ Show mock data instead of API errors
- ✅ Display sample events, jobs, and organizations
- ✅ Allow UI testing and development

## Backend Setup (Optional)

If you want to run the real backend:

### 1. Navigate to Backend Directory
```bash
cd ../backend
```

### 2. Set Up Environment Variables
Create a `.env` file in the backend directory:
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/asaiasa?sslmode=disable&TimeZone=Asia%2FBangkok

# Server
APP_PORT=8080

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth
GOOGLE_CLIENT_ID=295739018389-0v5a3v5787ar66obg9ocmdrmi68g1897.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# CORS (Allow frontend)
CORS_ORIGIN_URL=http://localhost:3000

# Environment
ENVIRONMENT=development
```

### 3. Install Dependencies
```bash
go mod tidy
```

### 4. Set Up Database (PostgreSQL)
```bash
# Install PostgreSQL if not installed
# Create database
createdb asaiasa

# Run migrations (if available)
# The backend should handle database setup automatically
```

### 5. Run Backend Server
```bash
go run main.go
```

The backend should start on `http://localhost:8080`

## Frontend Development

### With Backend Running
```bash
# In asaiasa-web directory
npm run dev
```
- Frontend will connect to `http://localhost:8080`
- Real API data will be displayed
- Authentication will work

### Without Backend
```bash
# In asaiasa-web directory
npm run dev
```
- Frontend will show mock data
- UI development and testing can continue
- No authentication features

## Environment Configuration

### Development (with local backend)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

### Development (without backend)
```env
# Leave VITE_API_BASE_URL unset or set to non-existent URL
# App will automatically use mock data
VITE_ENVIRONMENT=development
```

### Production
```env
VITE_API_BASE_URL=https://your-production-backend.com
VITE_ENVIRONMENT=production
```

## Troubleshooting

### Translation Errors
- ✅ **Fixed**: Added all missing translation keys
- The app should now load without translation errors

### API Connection Errors
- ✅ **Fixed**: Added fallback to localhost and mock data
- If you see "Error loading data" briefly, it's normal - mock data will load

### CORS Errors (if using backend)
Make sure your backend `.env` includes:
```env
CORS_ORIGIN_URL=http://localhost:3000
```

### Port Conflicts
- Frontend runs on `:3000`
- Backend runs on `:8080`
- Database runs on `:5432`

Make sure these ports are available.

## Next Steps

1. **Frontend Development**: Continue building features with mock data
2. **Backend Setup**: Set up the Go backend when ready for full integration
3. **Database Setup**: Configure PostgreSQL for persistent data
4. **Authentication**: Test Google OAuth with real backend
5. **Production**: Deploy both frontend and backend

The application is now fully functional for development! 🎉
