const express = require('express');
const { getUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/usersController');
const users = require('../data/users');

const router = express.Router();

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:id', getUserById);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
