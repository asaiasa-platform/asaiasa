'use strict';

/**
 * team controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::team.team', ({ strapi }) => ({
  async find(ctx) {
    // Set default populate for images
    ctx.query = {
      ...ctx.query,
      populate: '*'  // Use * to populate all first-level relations
    };
    
    // Call the default find method
    const { data, meta } = await super.find(ctx);
    
    // Parse pagination parameters
    const page = ctx.query._page ? 
      parseInt(ctx.query._page, 10) : 1;
    const pageSize = ctx.query._pageSize ? 
      parseInt(ctx.query._pageSize, 10) : 10;
    
    // Format response to match the required structure
    return {
      code: 0,
      data,
      page,
      page_size: pageSize,
      total_page: meta.pagination ? Math.ceil(meta.pagination.total / pageSize) : 1,
      total_data: meta.pagination ? meta.pagination.total : data.length,
      message: '',
      data_schema: null
    };
  },

  async findOne(ctx) {
    // Set default populate for images
    ctx.query = {
      ...ctx.query,
      populate: '*'  // Use * to populate all first-level relations
    };
    
    // Call the default findOne method
    const { data, meta } = await super.findOne(ctx);
    
    // Format response to match the required structure
    return {
      code: 0,
      data,
      message: '',
      data_schema: null
    };
  }
})); 