const request = require('supertest');
const createApp = require('../app');
const connectDB = require('../database/database');

let db, app;

beforeAll(async () => {
  db = await connectDB(':memory:');
  app = createApp(db);
});

afterAll(async () => {
  await db.close();
});

let alexID, johnID;

beforeEach(async () => {
  await db.run('DELETE FROM users');
  const alex = await db.run('INSERT INTO users (name) VALUES(?)', ['Alex']);
  const john = await db.run('INSERT INTO users (name) VALUES(?)', ['John']);
  alexID = alex.lastID;
  johnID = john.lastID;
});

describe('GET /users', () => {
  test('should return all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: alexID, name: 'Alex' },
      { id: johnID, name: 'John' },
    ]);
  });

  test('should create new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Mike',
    });

    const usersResponse = await request(app).get('/users');
    const mike = usersResponse.body.find((item) => item.name === 'Mike');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: mike?.id, name: 'Mike' });
    expect(usersResponse.body).toHaveLength(3);
    expect(mike).toEqual({
      id: mike?.id,
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
    const testName = 'Mikey';
    const usersBeforePatch = await request(app).get('/users');
    const mike = usersBeforePatch.body.find((item) => item.name === 'John');

    const response = await request(app).patch(`/users/${mike.id}`).send({
      name: testName,
    });
    const usersResponse = await request(app).get('/users');
    const users = usersResponse.body;
    const mikey = users.find((user) => user.name === testName);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: mikey.id, name: testName });
    expect(users.find((item) => item.id === mikey.id)).toEqual({
      id: mike.id,
      name: testName,
    });
  });

  test('should return 404 if user does not exist', async () => {
    const response = await request(app).patch('/users/9999').send({ name: 'John' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found!' });
  });

  test('should return 400 if name is incorrect', async () => {
    const usersResponse = await request(app).get('/users');
    const alex = usersResponse.body.find((item) => item.name === 'Alex');
    const response = await request(app).patch(`/users/${alex.id}`).send({ name: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Name is required' });
  });
});

describe('DELETE /users/:id', () => {
  test('should delete user', async () => {
    const usersResponse = await request(app).get('/users');
    const alex = usersResponse.body.find((item) => item.name === 'Alex');
    alexID = alex.id;
    const response = await request(app).delete(`/users/${alexID}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  test('should not return deleted user', async () => {
    await request(app).delete(`/users/${alexID}`);

    const response = await request(app).get(`/users/${alexID}`);

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
