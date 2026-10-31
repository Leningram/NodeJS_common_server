const usersService = require('../services/usersService');

function getUsers(_req, res) {
  const users = usersService.getAllUsers();
  res.json(users);
}

function getUserById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  const user = usersService.getUserById(id);
  if (!user) {
    return res.status(404).json({
      error: 'User not found!',
    });
  }
  res.json(user);
}

function createUser(req, res) {
  const { name } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Name is required',
    });
  }
  const user = usersService.createUser(name);
  res.status(201).json(user);
}

function updateUser(req, res) {
  const { name } = req.body;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Name is required',
    });
  }
  const user = usersService.updateUser(id, name);
  if (!user) {
    return res.status(404).json({ error: 'User not found!' });
  }
  res.json(user);
}

function deleteUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }
  const status = usersService.deleteUser(id);
  if (status) {
    res.status(204).end();
  } else {
    res.status(404).json({
      error: 'User not found!',
    });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
