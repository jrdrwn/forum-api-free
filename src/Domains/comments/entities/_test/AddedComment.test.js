const AddedComment = require('../AddedComment');

describe('a AddedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'content',
      owner: 'user-123',
    };

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'content',
      owner: true,
    };

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create new added comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-1',
      content: 'content',
      owner: 'user-123',
    };

    const comments = new AddedComment(payload);
    expect(comments).toBeInstanceOf(AddedComment);
    expect(comments).toEqual(payload);
  });
});
