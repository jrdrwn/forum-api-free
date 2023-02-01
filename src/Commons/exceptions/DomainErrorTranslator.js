const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'harus mengirimkan token refresh'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token harus string'
  ),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'harus mengirimkan token refresh'
  ),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token harus string'
  ),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
  ),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai'
  ),
  'ADD_THREAD.TITLE_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat thread karena karakter title melebihi batas limit harus dibawah 80 karakter'
  ),
  'ADD_THREAD.BODY_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat thread karena karakter body melebihi batas limit harus dibawah 512 karakter'
  ),
  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
  ),
  'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai'
  ),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
  ),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
  ),
  'ADD_COMMENT.CONTENT_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat komentar karena karakternya melebihi batas limit harus dibawah 256 karakter'
  ),
  'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'
  ),
  'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
  ),
  'GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat mengambil thread karena properti yang dibutuhkan tidak ada'
  ),
  'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat mengambil thread  karena tipe data tidak sesuai'
  ),
  'GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat mengambil komentar karena properti yang dibutuhkan tidak ada'
  ),
  'GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat mengambil komentar  karena tipe data tidak sesuai'
  ),
};

module.exports = DomainErrorTranslator;
