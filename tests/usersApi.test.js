const request = require('supertest');
const app = require('../app');
const users = require('../data/users');

describe('GET /users', () => {
  beforeEach(() => {
    users.splice(0, users.length, { id: 1, name: 'Alex' }, { id: 2, name: 'John' });
  });

  test('should return all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Alex' },
      { id: 2, name: 'John' },
    ]);
  });

  test('should create new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Mike',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 3, name: 'Mike' });
    expect(users).toHaveLength(3);
    expect(users[2]).toEqual({
      id: 3,
      name: 'Mike',
    });
  });

  test('should return 400 if name is missing', async () => {
    const response = await request(app).post('/users').send({});

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: 'Name is required',
    });
  });
});

describe('PATCH /users/:id', () => {
  test('should update user name', async () => {
    const response = await request(app).patch('/users/1').send({
      name: 'Mikey',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'Mikey' });
    expect(users.find((item) => item.id === 1)).toEqual({
      id: 1,
      name: 'Mikey',
    });
  });

  test('should return 404 if user does not exist', async () => {
    const response = await request(app).patch('/users/4').send({ name: 'John' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found!' });
  });

  test('should return 400 if name is incorrect', async () => {
    const response = await request(app).patch('/users/1').send({ name: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Name is required' });
  });
});

describe('DELETE /users/:id', () => {
  test('should delete user', async () => {
    const response = await request(app).delete('/users/1');

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  test('should not return deleted user', async () => {
    await request(app).delete('/users/1');

    const response = await request(app).get('/users/1');

    expect(response.status).toBe(404);
  });

  test('should return 404 if user does not exist', async () => {
    const response = await request(app).delete('/users/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'User not found!',
    });
  });
});
