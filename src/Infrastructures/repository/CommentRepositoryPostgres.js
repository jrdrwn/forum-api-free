const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, thread, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, thread, content, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async existsComment(comment) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [comment],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('komentar tidak ada');
    }
  }

  async isOwner(comment, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [comment, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('anda tidak bisa menghapus komentar orang lain.');
    }
  }

  async deleteComment(comment) {
    const query = {
      text: 'UPDATE comments SET is_deleted=1 WHERE id = $1',
      values: [comment],
    };

    await this._pool.query(query);
  }

  async getCommentsThread(thread) {
    const query = {
      text: 'SELECT comments.id, comments.created_at as date, comments.content, comments.is_deleted, users.username FROM comments LEFT JOIN users ON users.id = comments.owner WHERE thread = $1 ORDER BY comments.created_at ASC',
      values: [thread],
    };

    const comments = await this._pool.query(query);

    return comments.rows.map((row) => {
      // eslint-disable-next-line no-unused-expressions, no-param-reassign
      row.is_deleted && (row.content = '**komentar telah dihapus**');
      return row;
    });
  }
}

module.exports = CommentRepositoryPostgres;
