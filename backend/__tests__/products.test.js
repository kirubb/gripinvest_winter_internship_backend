import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../src/config/db.js';

// 1. Define the mock for the middleware first.
jest.unstable_mockModule('../src/middleware/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com' };
    next();
  },
}));

// 2. NOW, dynamically import the app. It will be built using the mock above.
const { default: app } = await import('../src/app.js');

afterAll(async () => {
  await db.end();
});

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return a list of products for an authenticated user', async () => {
      const res = await request(app).get('/api/products');
      // The test should now pass because the middleware is correctly mocked.
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});