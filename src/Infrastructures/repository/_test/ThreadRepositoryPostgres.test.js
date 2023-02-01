const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist new thread and return added thread correctly', async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'wan' });
        const newThread = new AddThread({
          title: 'a thread',
          body: 'lorem ipsum dolor sit amet',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        const addedThread = await threadRepositoryPostgres.addThread(newThread);

        const thread = await ThreadsTableTestHelper.findThreadsById(`thread-${fakeIdGenerator()}`);
        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: `thread-${fakeIdGenerator()}`,
            title: 'a thread',
            owner: 'user-123',
          })
        );
        expect(thread).toHaveLength(1);
      });
    });
    describe('existsThread function', () => {
      it('should throw NotFoundError if thread not available', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        const threadId = 'xxx';

        // Action & Assert
        await expect(threadRepositoryPostgres.existsThread(threadId)).rejects.toThrow(
          NotFoundError
        );
      });

      it('should not throw NotFoundError if thread available', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-321', username: 'wan' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-1', body: 'body', owner: 'user-321' });

        // Action & Assert
        await expect(threadRepositoryPostgres.existsThread('thread-1')).resolves.not.toThrow(
          NotFoundError
        );
      });
    });
    describe('getThread function', () => {
      it('should get a thread with detail thread', async () => {
        const threadRepository = new ThreadRepositoryPostgres(pool, {});
        const userPayload = { id: 'user-123', username: 'wan' };
        const threadPayload = {
          id: 'thread-1',
          title: 'title',
          body: 'body',
          owner: userPayload.id,
          createdAt: new Date().toISOString(),
        };
        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);

        const thread = await threadRepository.getThread(threadPayload.id);
        expect(thread.id).toEqual(threadPayload.id);
        expect(thread.title).toEqual(threadPayload.title);
        expect(thread.date).toEqual(threadPayload.createdAt);
        expect(thread.body).toEqual(threadPayload.body);
        expect(thread.username).toEqual(userPayload.username);
      });
    });
  });
});
