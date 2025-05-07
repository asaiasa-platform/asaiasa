'use strict';

/**
 * team router
 */

// Define routes directly instead of using createCoreRouter
module.exports = {
  routes: [
    // Default team routes
    {
      method: 'GET',
      path: '/teams',
      handler: 'api::team.team.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/teams',
      handler: 'api::team.team.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/teams/:id',
      handler: 'api::team.team.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/teams/:id',
      handler: 'api::team.team.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/teams/:id',
      handler: 'api::team.team.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 