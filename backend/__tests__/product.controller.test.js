import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../src/config/db.js';

// Mock the middleware and service before importing the app
jest.unstable_mockModule('../src/middleware/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com' };
    next();
  },
}));

jest.unstable_mockModule('../src/services/product.service.js', () => ({
  default: {
    findAll: jest.fn(),
  },
}));

const { default: app } = await import('../src/app.js');
const { default: productService } = await import('../src/services/product.service.js');

afterAll(async () => {
  await db.end();
});

describe('GET /api/products', () => {
  it('should return a list of products from the service', async () => {
    const mockProducts = [{ id: '1', name: 'Test Product' }];
    productService.findAll.mockResolvedValue(mockProducts);

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockProducts);
    expect(productService.findAll).toHaveBeenCalledTimes(1);
  });
});