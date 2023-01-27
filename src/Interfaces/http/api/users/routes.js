const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (r, h) => handler.postUserHandler(r, h),
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
