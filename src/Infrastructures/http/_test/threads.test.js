const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  let server;

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    server = await createServer(container);
  });

  describe('when POST /threads', () => {
    it('should response 401 if payload not access token', async () => {
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
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
          fullname: 'Jordi Irawan',
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
        url: '/threads',
        payload: {
          title: 123,
          body: true,
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });

    it('should response 201 and create new thread', async () => {
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
          fullname: 'Jordi Irawan',
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
        url: '/threads',
        payload: {
          title: 'title',
          body: 'body',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.title).toEqual('title');
    });
  });
  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when thread not valid', async () => {
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
          fullname: 'Jordi Irawan',
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
        method: 'GET',
        url: '/threads/xxxx',
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ada');
    });

    it('should response 200 and return detail thread', async () => {
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
          fullname: 'Jordi Irawan',
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
        method: 'GET',
        url: `/threads/${threadResponse.data.addedThread.id}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.id).toEqual(threadResponse.data.addedThread.id);
      expect(responseJson.data.thread.title).toEqual('title');
      expect(responseJson.data.thread.body).toEqual('body');
      expect(responseJson.data.thread.username).toEqual('wan');
      expect(Array.isArray(responseJson.data.thread.comments)).toBeTruthy();
    });
  });
});
