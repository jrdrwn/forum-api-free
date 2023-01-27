const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain thread id and comment id', async () => {
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD'
    );
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    const useCasePayload = {
      thread: 1,
      comment: 2,
      owner: 3,
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-1',
      comment: 'comment-1',
      owner: 'user-123',
    };
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.existsThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.existsComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.isOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.existsThread).toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.existsComment).toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockCommentRepository.isOwner).toHaveBeenCalledWith(
      useCasePayload.comment,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.comment);
  });
});
