const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (r, h) => handler.postAuthenticationHandler(r, h),
    options: {
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (r, h) => handler.putAuthenticationHandler(r, h),
    options: {
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (r, h) => handler.deleteAuthenticationHandler(r, h),
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
