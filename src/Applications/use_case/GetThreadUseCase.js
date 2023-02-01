const GetComments = require('../../Domains/comments/entities/GetComments');
const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = new GetThread(useCasePayload);
    await this._threadRepository.existsThread(threadId);
    const thread = await this._threadRepository.getThread(threadId);
    const getCommentsThread = await this._commentRepository.getCommentsThread(threadId);
    const { comments } = new GetComments({
      comments: getCommentsThread,
    });
    return {
      ...thread,
      comments,
    };
  }
}

module.exports = GetThreadUseCase;
