const request = require('supertest');
const app = require('../app');

describe('GET /private', () => {
  test('should return 401 without apikey', async () => {
    const response = await request(app).get('/private');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
    });
  });

  test('should return 200 with valid API key', async () => {
    const response = await request(app).get('/private').set('x-api-key', 'secret123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Access granted' });
  });
});
