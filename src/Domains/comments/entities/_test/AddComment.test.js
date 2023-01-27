const AddComment = require('../AddComment');

describe('a AddComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread: 'thread-123',
      owner: 'user-123',
    };

    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread: 1,
      owner: 2,
      content: 3,
    };

    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
  it('should throw error when content contains more than 255 character', () => {
    // Arrange
    const payload = {
      content: 'c'.repeat(256),
      owner: 'user-123',
      thread: 'thread-123',
    };
    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.CONTENT_LIMIT_CHAR');
  });
  it('should create new comment object correctly', () => {
    const payload = {
      thread: 'thread-123',
      owner: 'user-123',
      content: 'content',
    };

    const comments = new AddComment(payload);

    expect(comments).toBeInstanceOf(AddComment);
    expect(comments).toEqual(payload);
  });
});
