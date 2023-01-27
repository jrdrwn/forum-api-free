const AddedThread = require('../AddedThread');

describe('a AddedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title',
      owner: 'user-1',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 1,
      title: 'title',
      owner: 'user-1',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'title',
      owner: 'user-1',
    };

    // Action
    const thread = new AddedThread(payload);
    // Assert
    expect(thread).toBeInstanceOf(AddedThread);
    expect(thread).toEqual(payload);
  });
});
