const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

jest.mock('../src/middleware/auth.middleware', () => ({
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