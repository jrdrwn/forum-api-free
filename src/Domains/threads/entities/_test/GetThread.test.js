const GetThread = require('../GetThread');

describe('a GetThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 1,
    };

    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create GetThread object correctly', () => {
    const payload = {
      threadId: 'thread-1',
    };

    const thread = new GetThread(payload);
    expect(thread).toBeInstanceOf(GetThread);
    expect(thread).toEqual(payload);
  });
});
