const AddThread = require('../AddThread');

describe('a AddThread entitas', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 1,
      body: 2,
      owner: 3,
    };
    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when title contains more than 79 character', () => {
    // Arrange
    const payload = {
      title: 't'.repeat(80),
      body: 'body',
      owner: 'user-123',
    };
    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should throw error when body contains more than 512 character', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'b'.repeat(513),
      owner: 'user-123',
    };
    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.BODY_LIMIT_CHAR');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body',
      owner: 'user-123',
    };
    // Action
    const thread = new AddThread(payload);
    // Assert
    expect(thread).toBeInstanceOf(AddThread);
    expect(thread).toEqual(payload);
  });
});
