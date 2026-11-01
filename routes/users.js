const express = require('express');
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByIdAsync,
} = require('../controllers/usersController');

const router = express.Router();

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:id', getUserById);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

router.get('/async/:id', getUserByIdAsync);

module.exports = router;
