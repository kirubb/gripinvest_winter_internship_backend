import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/db.js';

jest.mock('../src/middleware/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com' };
    next();
  },
}));

afterAll(async () => {
  await db.end();
});

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return a list of products for an authenticated user', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});