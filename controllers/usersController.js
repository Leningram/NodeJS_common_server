const HttpError = require('../errors/HttpError');
const usersService = require('../services/usersService');

function getUsers(_req, res) {
  const users = usersService.getAllUsers();
  res.json(users);
}

function getUserById(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new HttpError(400, 'Invalid user id'));
  }
  const user = usersService.getUserById(id);
  if (!user) {
    return next(new HttpError(404, 'User not found!'));
  }
  res.json(user);
}

function createUser(req, res, next) {
  const { name } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return next(new HttpError(400, 'Name is required'));
  }
  const user = usersService.createUser(name);
  res.status(201).json(user);
}

function updateUser(req, res, next) {
  const { name } = req.body;
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new HttpError(400, 'Invalid user id'));
  }
  if (typeof name !== 'string' || name.trim() === '') {
    return next(new HttpError(400, 'Name is required'));
  }
  const user = usersService.updateUser(id, name);
  if (!user) {
    return next(new HttpError(404, 'User not found!'));
  }
  res.json(user);
}

function deleteUser(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return next(new HttpError(400, 'Invalid user id'));
  }

  const status = usersService.deleteUser(id);

  if (!status) {
    return next(new HttpError(404, 'User not found!'));
  }
  res.status(204).end();
}

async function getUserByIdAsync(req, res) {
  const id = Number(req.params.id);

  const user = await usersService.getUserByIdAsync(id);

  if (!user) {
    throw new HttpError(404, 'User not found!');
  }

  res.json(user);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByIdAsync,
};
