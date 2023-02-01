class GetComments {
  constructor(payload) {
    this._verifyPayload(payload);
    this.comments = this._remappingPayload(payload);
  }

  _verifyPayload({ comments }) {
    if (!comments) {
      throw new Error('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!Array.isArray(comments)) {
      throw new Error('GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _remappingPayload({ comments }) {
    return comments.map((row) => {
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      row.is_deleted && (row.content = '**komentar telah dihapus**');
      return row;
    });
  }
}

module.exports = GetComments;
