const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-1',
      content: 'content',
      owner: 'user-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-1',
      content: 'content',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    jest.spyOn(mockThreadRepository, 'existsThread').mockResolvedValue();
    jest.spyOn(mockCommentRepository, 'addComment').mockResolvedValue(expectedAddedComment);

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await getCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.existsThread).toBeCalledWith(useCasePayload.thread);
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        thread: useCasePayload.thread,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
  });
});
