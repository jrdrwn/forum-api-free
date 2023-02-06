exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: false,
    },
    updated_at: {
      type: 'TEXT',
      notNull: false,
    },
    is_deleted: {
      type: 'INTEGER',
      default: 0,
    },
  });

  pgm.addConstraint(
    'comments',
    'fk_comments.thread_threads.id',
    'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'comments',
    'fk_comments.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
