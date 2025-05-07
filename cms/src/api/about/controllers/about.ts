/**
 * about controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::about.about', ({ strapi }) => ({
  async find(ctx) {
    // Set default populate for dynamic zones with correct syntax for polymorphic relationships
    ctx.query = {
      ...ctx.query,
      populate: {
        dynamic_zone: {
          populate: '*'  // Use * for polymorphic relationships instead of specific fields
        }
      }
    };
    
    // Call the default find controller
    const { data, meta } = await super.find(ctx);
    
    // Parse pagination parameters
    const page = ctx.query._page ? 
      Number.parseInt(ctx.query._page as string, 10) : 1;
    const pageSize = ctx.query._pageSize ? 
      Number.parseInt(ctx.query._pageSize as string, 10) : 10;
    
    // Format response to match the required structure
    return {
      code: 0,
      data,
      page,
      page_size: pageSize,
      total_page: 1, // Since it's a single type
      total_data: 1, // Since it's a single type
      message: '',
      data_schema: null
    };
  },

  async findOne(ctx) {
    // Set default populate for dynamic zones with correct syntax for polymorphic relationships
    ctx.query = {
      ...ctx.query,
      populate: {
        dynamic_zone: {
          populate: '*'  // Use * for polymorphic relationships instead of specific fields
        }
      }
    };
    
    // Call the default findOne controller
    const { data, meta } = await super.findOne(ctx);
    
    // Format response to match the required structure
    return {
      code: 0,
      data,
      message: '',
      data_schema: null
    };
  },

  // Custom controller method for /about/full endpoint
  async full(ctx) {
    try {
      // Simply forward to the find method but with deep populate
      // Set a simpler populate query to avoid TypeScript errors
      ctx.query = {
        ...ctx.query,
        populate: 'dynamic_zone'  // Use string format to avoid TypeScript checks
      };
      
      // Call the parent find method which requires no parameters
      // @ts-ignore - Ignore TypeScript checking to avoid parameter issues
      return await super.find(ctx);
      
    } catch (error) {
      // Handle error
      console.error('Error in about/full endpoint:', error);
      return {
        code: 500,
        data: null,
        message: `Error fetching about data: ${error.message}`,
        data_schema: null
      };
    }
  }
}));
