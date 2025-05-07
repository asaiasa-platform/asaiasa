# Custom Middlewares

This directory contains custom middlewares for the Strapi application.

## API Formatter Middleware

The `api-formatter.ts` middleware standardizes all API responses to follow a consistent format:

```json
{
  "code": 0,           // 0 for success, HTTP status code for errors
  "data": [],          // Response data
  "page": 1,           // Current page (for paginated results)
  "page_size": 10,     // Page size (for paginated results)
  "total_page": 1,     // Total number of pages (for paginated results)
  "total_data": 0,     // Total number of items (for paginated results)
  "message": "",       // Error message or empty string for success
  "data_schema": null  // Schema information (if needed)
}
```

This middleware automatically intercepts all API responses and formats them according to this structure.

### Usage

The middleware is registered in `config/middlewares.ts` and applies to all API routes by default.

### Exceptions

- It skips formatting for non-API routes (not starting with `/api`)
- It skips formatting for webhook routes
- It skips formatting for responses that already have the `code` property defined 