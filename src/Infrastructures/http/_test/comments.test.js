const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  let server;

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    server = await createServer(container);
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 if payload not access token', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if payload not contain needed property', async () => {
      const payload = {
        username: 'wan',
        password: 'wan',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wan',
          password: 'wan',
          fullname: 'wanwan',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {},
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 if payload not meet data type specification', async () => {
      const payload = {
        username: 'wan',
        password: 'wan',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wan',
          password: 'wan',
          fullname: 'wanwan',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 123,
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
      );
    });

    it('should response 404 if thread id not valid', async () => {
      const payload = {
        username: 'wan',
        password: 'wan',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wan',
          password: 'wan',
          fullname: 'wanwan',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });

      const responseAuth = JSON.parse(authentication.payload);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {
          content: 'content',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ada');
    });

    it('should response 201 and return addedComment', async () => {
      const payload = {
        username: 'wan',
        password: 'wan',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wan',
          password: 'wan',
          fullname: 'wanwan',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'content',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toEqual('content');
    });
  });

  describe('when DELETE /threads/{threadId}/comments', () => {
    it('should response 403 if another user delete the comment', async () => {
      const anotherUser = {
        id: 'user-1',
        username: 'asdf',
        password: 'asdf',
      };

      const payload = {
        username: 'wan',
        password: 'wan',
      };
      await UsersTableTestHelper.addUser(anotherUser);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wan',
          password: 'wan',
          fullname: 'wanwan',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);
      const commentId = 'comment-1';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread: threadResponse.data.addedThread.id,
        owner: anotherUser.id,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak bisa menghapus komentar orang lain.');
    });

    it('should response 404 if token not found', async () => {
      const payload = {
        username: 'wan',
        password: 'wan',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wan',
          password: 'wan',
          fullname: 'wanwan',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/xxx/comments/xxx',
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ada');
    });

    it('should response 404 if comment not found', async () => {
      const payload = {
        username: 'wan',
        password: 'wan',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wan',
          password: 'wan',
          fullname: 'wanwan',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/xxx`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ada');
    });

    it('should response 200 and return success', async () => {
      const payload = {
        username: 'wan',
        password: 'wan',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wan',
          password: 'wan',
          fullname: 'wanwan',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'title',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'content',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const commentResponse = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
