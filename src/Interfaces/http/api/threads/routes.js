const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (r, h) => handler.postThreadHandler(r, h),
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (r, h) => handler.getThreadHandler(r, h),
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
