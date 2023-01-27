const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (r, h) => handler.postCommentHandler(r, h),
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (r, h) => handler.deleteCommentHandler(r, h),
  },
];

module.exports = routes;
