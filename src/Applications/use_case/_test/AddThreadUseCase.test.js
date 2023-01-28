const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const ownerId = 'user-123';
    const useCasePayload = {
      title: 'title',
      body: 'body',
      owner: ownerId,
    };
    const expectedAddedThread = new AddedThread({
      id: 'thread-1',
      title: useCasePayload.title,
      owner: ownerId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    jest.spyOn(mockThreadRepository, 'addThread').mockResolvedValue(
      new AddedThread({
        id: 'thread-1',
        title: useCasePayload.title,
        owner: ownerId,
      })
    );

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        owner: ownerId,
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
