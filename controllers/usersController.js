const HttpError = require('../errors/HttpError');

function createUsersController(usersService) {
  async function getUsers(_req, res) {
    const users = await usersService.getAllUsers();
    res.json(users);
  }

  async function getUserById(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return next(new HttpError(400, 'Invalid user id'));
    }
    const user = await usersService.getUserById(id);
    if (!user) {
      return next(new HttpError(404, 'User not found!'));
    }
    res.json(user);
  }

  async function createUser(req, res, next) {
    const { name } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
      return next(new HttpError(400, 'Name is required'));
    }
    const user = await usersService.createUser(name);
    res.status(201).json(user);
  }

  async function updateUser(req, res, next) {
    const { name } = req.body;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return next(new HttpError(400, 'Invalid user id'));
    }
    if (typeof name !== 'string' || name.trim() === '') {
      return next(new HttpError(400, 'Name is required'));
    }
    const user = await usersService.updateUser(id, name);
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
  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
}

module.exports = createUsersController;
