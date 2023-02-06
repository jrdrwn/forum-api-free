const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // Dummy dependency

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepositoryPostgres);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment function', () => {
      it('should persist new comment and return added comment correctly', async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'wan' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-2', body: 'body', owner: 'user-123' });

        const newComment = new AddComment({
          content: 'content',
          thread: 'thread-2',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        const addedComment = await commentRepositoryPostgres.addComment(newComment);

        const comment = await CommentsTableTestHelper.findCommentsById(
          `comment-${fakeIdGenerator()}`
        );
        expect(addedComment).toStrictEqual(
          new AddedComment({
            id: `comment-${fakeIdGenerator()}`,
            content: 'content',
            owner: 'user-123',
          })
        );
        expect(comment).toHaveLength(1);
      });
    });

    describe('existsComment function', () => {
      it('should throw NotFoundError if comment not available', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const comment = 'xxx';

        // Action & Assert
        await expect(commentRepositoryPostgres.existsComment(comment)).rejects.toThrow(
          NotFoundError
        );
      });

      it('should not throw NotFoundError if comment available', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'wan' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-1', body: 'body', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-1',
          content: 'content',
          thread: 'thread-1',
          owner: 'user-123',
        });

        // Action & Assert
        await expect(commentRepositoryPostgres.existsComment('comment-1')).resolves.not.toThrow(
          NotFoundError
        );
      });
    });

    describe('isOwner function', () => {
      it('should throw AuthorizationError if comment not belong to owner', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'wan' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-1', body: 'body', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-1',
          content: 'content',
          thread: 'thread-1',
          owner: 'user-123',
        });
        const comment = 'comment-1';
        const owner = 'user-1234'; // user lain

        // Action & Assert
        await expect(commentRepositoryPostgres.isOwner(comment, owner)).rejects.toThrow(
          AuthorizationError
        );
      });

      it('should not throw AuthorizationError if comment is belongs to owner', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'wan' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-1', body: 'body', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-1',
          content: 'content',
          thread: 'thread-1',
          owner: 'user-123',
        });

        // Action & Assert
        await expect(
          commentRepositoryPostgres.isOwner('comment-1', 'user-123')
        ).resolves.not.toThrow(AuthorizationError);
      });
    });

    describe('deleteToken', () => {
      it('should delete token from database', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'wan' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-1', body: 'body', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-1',
          content: 'content',
          thread: 'thread-1',
          owner: 'user-123',
        });

        // Action
        await commentRepositoryPostgres.deleteComment('comment-1');

        // Assert
        const comment = await CommentsTableTestHelper.findCommentsById('comment-1');
        expect(comment).toHaveLength(1);
        expect(comment[0].is_deleted).toBeTruthy();
      });
    });
    describe('getCommentsThread', () => {
      it('should get comments of thread', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const userPayload = { id: 'user-123', username: 'wan' };
        const threadPayload = {
          id: 'thread-1',
          title: 'title',
          body: 'body',
          owner: 'user-123',
        };
        const commentPayload = {
          id: 'comment-1',
          content: 'content',
          thread: threadPayload.id,
          owner: userPayload.id,
          createdAt: new Date().toISOString(),
        };

        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);
        await CommentsTableTestHelper.addComment(commentPayload);
        await CommentsTableTestHelper.deleteComment(commentPayload.id);

        const comments = await commentRepositoryPostgres.getCommentsThread(threadPayload.id);

        expect(Array.isArray(comments)).toBeTruthy();
        expect(comments).toStrictEqual([
          {
            is_deleted: 1,
            date: commentPayload.createdAt,
            id: commentPayload.id,
            username: userPayload.username,
            content: commentPayload.content,
          },
        ]);
      });
    });
  });
});
