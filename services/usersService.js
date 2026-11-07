function createUsersService(db) {
  async function getAllUsers() {
    return db.all('SELECT * FROM users');
  }

  async function getUserById(id) {
    return db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  async function createUser(name) {
    const result = await db.run('INSERT INTO users (name) VALUES (?)', [name.trim()]);
    return { id: result.lastID, name: name.trim() };
  }

  async function updateUser(id, name) {
    const result = await db.run('UPDATE users SET name = ? WHERE id = (?)', [name.trim(), id]);
    if (result.changes === 0) {
      return null;
    }

    return getUserById(id);
  }

  async function deleteUser(id) {
    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
  }

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
}

module.exports = createUsersService;
