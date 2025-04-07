# ASAiASA Project

## Project Overview
This project consists of three main components:
- **admin-ui**: Admin dashboard interface built with Next.js
- **website**: Public-facing website built with Next.js
- **backend**: Go-based API backend

## Project Structure
```
/
├── admin-ui/          # Admin dashboard interface
│   ├── src/           # Source files
│   ├── public/        # Static assets
│   └── ...
├── backend/           # Go backend API
│   ├── internal/      # Internal packages
│   ├── pkg/           # Public packages
│   ├── utils/         # Utility functions
│   └── ...
└── website/           # Public-facing website
    ├── src/           # Source files
    ├── public/        # Static assets
    └── ...
```

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Go (v1.20+ recommended)
- Docker and Docker Compose (for backend services)
- Git

### Backend Setup
1. Change to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Install Go dependencies:
   ```bash
   go mod tidy
   ```

4. Run the backend:
   ```bash
   go run main.go
   ```

   **For hot reload during development:**
   ```bash
   # Install Air first
   go install github.com/air-verse/air@latest
   
   # Then run with hot reload
   air
   ```

5. The backend will be available at http://localhost:8080

### Admin UI Setup
1. Change to the admin-ui directory:
   ```bash
   cd admin-ui
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. The admin UI will be available at http://localhost:3000

### Website Setup
1. Change to the website directory:
   ```bash
   cd website
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. The website will be available at http://localhost:3000 (Note: You'll need to run on a different port if running admin-ui simultaneously)

## Running with Docker
For running the backend with Docker:

```bash
cd backend
docker-compose up
```

For full development stack with Docker:
```bash
docker-compose -f docker-compose-developer.yml up
```

## API Documentation
Backend API documentation is generated with Swagger:

```bash
cd backend
swag init -g ./main.go -o ./docs --parseDependency --parseInternal
```

Access the API documentation at http://localhost:8080/swagger/index.html when running the backend. 