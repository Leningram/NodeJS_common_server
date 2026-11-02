const express = require('express');
const createUsersService = require('../services/usersService');
const createUsersController = require('../controllers/usersController');


function createUserRouter(db) {
  const router = express.Router();
  const usersService = createUsersService(db);
  const usersController = createUsersController(usersService);

  router.get('/', usersController.getUsers);

  router.post('/', usersController.createUser);

  router.get('/:id', usersController.getUserById);

  router.patch('/:id', usersController.updateUser);

  router.delete('/:id', usersController.deleteUser);

  return router;
}

module.exports = createUserRouter;
