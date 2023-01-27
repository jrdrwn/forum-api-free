const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should get return detail thread correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-1',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.existsThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentsThread = jest.fn().mockImplementation(() => Promise.resolve());

    const threadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await threadUseCase.execute(useCasePayload);
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
