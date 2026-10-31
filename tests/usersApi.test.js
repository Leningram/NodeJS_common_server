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
});
