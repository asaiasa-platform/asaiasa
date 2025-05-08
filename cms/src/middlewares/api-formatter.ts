/**
 * API response formatter middleware
 * Formats all API responses to a standard structure
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Call the next middleware and wait for it to finish
    await next();

    // Skip formatting for non-API routes, webhooks, or already formatted responses
    if (
      !ctx.url.startsWith('/api') || 
      ctx.url.startsWith('/api/webhook') ||
      ctx.response.body && ctx.response.body.code !== undefined
    ) {
      return;
    }

    // Handle error responses
    if (ctx.response.status >= 400) {
      ctx.response.body = {
        code: ctx.response.status,
        data: null,
        message: ctx.response.body?.error?.message || 'An error occurred',
        data_schema: null
      };
      return;
    }

    // Check if the response is successful
    const originalBody = ctx.response.body;

    // Get pagination info if available
    const pagination = originalBody?.meta?.pagination;
    
    // Parse pagination parameters from the query
    const page = ctx.query._page ? 
      parseInt(ctx.query._page as string, 10) : 1;
    const pageSize = ctx.query._pageSize ? 
      parseInt(ctx.query._pageSize as string, 10) : 10;

    // Format the response
    ctx.response.body = {
      code: 0,
      data: originalBody?.data || originalBody || null, // Default to null if no data
      message: '',
      data_schema: null
    };

    // Add pagination if it exists
    if (pagination) {
      ctx.response.body.page = page;
      ctx.response.body.page_size = pageSize;
      ctx.response.body.total_page = Math.ceil(pagination.total / pageSize) || 1; // Ensure at least 1 page
      ctx.response.body.total_data = pagination.total || 0; // Default to 0 if no total
    }
    
    // For collection types without pagination info, add default pagination
    else if (Array.isArray(ctx.response.body.data)) {
      ctx.response.body.page = page;
      ctx.response.body.page_size = pageSize;
      ctx.response.body.total_page = 1;
      ctx.response.body.total_data = ctx.response.body.data.length;
    }
    
    // For single types, add standard pagination fields
    else if (ctx.url.includes('/api/about')) {
      ctx.response.body.page = page;
      ctx.response.body.page_size = pageSize;
      ctx.response.body.total_page = 1;
      ctx.response.body.total_data = 1;
    }
  };
}; 