const GetComments = require('../GetComments');

describe('a GetComments entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new GetComments(payload)).toThrowError('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      comments: {},
    };

    expect(() => new GetComments(payload)).toThrowError(
      'GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should remap comments data correctly', () => {
    const date = new Date().toISOString();
    const payload = {
      comments: [
        {
          id: 'comment-1',
          username: 'wan',
          date,
          content: 'content',
          is_deleted: 0,
        },
        {
          id: 'comment-2',
          username: 'wann',
          date,
          content: 'deleted content',
          is_deleted: 1,
        },
      ],
    };

    const { comments } = new GetComments(payload);

    const expectedComment = [
      {
        id: 'comment-1',
        username: 'wan',
        date,
        content: 'content',
        is_deleted: 0,
      },
      {
        id: 'comment-2',
        username: 'wann',
        date,
        content: '**komentar telah dihapus**',
        is_deleted: 1,
      },
    ];

    expect(comments).toEqual(expectedComment);
  });

  it('should create GetComments object correctly', () => {
    const date = new Date().toISOString();
    const payload = {
      comments: [
        {
          id: 'comment-1',
          username: 'wan',
          date,
          content: 'content',
        },
        {
          id: 'comment-2',
          username: 'wann',
          date,
          content: '**komentar telah dihapus**',
        },
      ],
    };

    const { comments } = new GetComments(payload);

    expect(comments).toEqual(payload.comments);
  });
});
