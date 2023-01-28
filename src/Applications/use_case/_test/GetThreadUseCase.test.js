const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should get return detail thread correctly', async () => {
    const fakeThreadId = 'thread-1';
    const useCasePayload = {
      threadId: fakeThreadId,
    };
    const fakeThread = {
      id: fakeThreadId,
      title: 'title',
      body: 'body',
      date: new Date().toISOString(),
      username: 'wan',
    };
    const fakeComments = [
      {
        id: 'comment-1',
        username: 'wan1',
        date: new Date().toISOString(),
        content: 'content',
      },
      {
        id: 'comment-2',
        username: 'wan2',
        date: new Date().toISOString(),
        content: '**komentar telah dihapus**',
      },
    ];
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    jest.spyOn(mockThreadRepository, 'existsThread').mockResolvedValue(true);
    jest.spyOn(mockThreadRepository, 'getThread').mockResolvedValue(fakeThread);
    jest.spyOn(mockCommentRepository, 'getCommentsThread').mockResolvedValue(fakeComments);

    const threadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const thread = await threadUseCase.execute(useCasePayload);
    expect(mockThreadRepository.getThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(thread).toStrictEqual({ ...fakeThread, comments: fakeComments });
  });
});
