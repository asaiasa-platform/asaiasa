/**
 * about router.
 */

import { factories } from '@strapi/strapi';

// Instead of extending the default router, define routes directly
export default {
  routes: [
    // Default routes that Strapi would create
    {
      method: 'GET',
      path: '/about',
      handler: 'api::about.about.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/about',
      handler: 'api::about.about.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/about',
      handler: 'api::about.about.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Custom route for full population
    {
      method: 'GET',
      path: '/about/full',
      handler: 'api::about.about.full',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
