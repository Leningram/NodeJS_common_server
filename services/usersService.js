const users = require('../data/users');

function getAllUsers() {
  return users;
}

function createUser(name) {
  const id = users.reduce((acc, user) => Math.max(user.id, acc), 0) + 1;
  const user = { name: name.trim(), id };
  users.push(user);
  return user;
}

function getUserById(id) {
  const user = users.find((item) => item.id === id);
  return user;
}

function updateUser(id, name) {
  const userToUpdate = users.find((item) => item.id === id);
  if (userToUpdate) {
    userToUpdate.name = name.trim();
  }
  return userToUpdate;
}

function deleteUser(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return false;
  }
  users.splice(index, 1);
  return true;
}

async function getUserByIdAsync(id) {
  const user = users.find((item) => item.id === id);
  return user;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByIdAsync,
};
