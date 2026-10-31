const express = require('express');
const { getUsers, createUser } = require('../controllers/usersController');
const users = require('../data/users');

const router = express.Router();

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Invalid user id',
    });
  }
  const user = users.find((item) => item.id === id);
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    });
  }
  res.json(user);
});

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Invalid id',
    });
  }

  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    });
  }
  const { name } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Invalid name',
    });
  }

  user.name = name.trim();
  res.json(user);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Invalid id',
    });
  }

  const userIndex = users.findIndex((item) => item.id === id);

  if (userIndex < 0) {
    return res.status(404).json({
      error: 'User not found',
    });
  }

  users.splice(userIndex, 1);
  return res.status(204).end();
});

module.exports = router;
