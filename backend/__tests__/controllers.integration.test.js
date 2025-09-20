import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../src/config/db.js';

jest.unstable_mockModule('../src/middleware/logger.middleware.js', () => ({
  loggerMiddleware: (req, res, next) => next(),
}));

jest.unstable_mockModule('../src/middleware/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'user-1', email: 'test@example.com', risk_appetite: 'high' };
    next();
  },
}));

jest.unstable_mockModule('../src/services/user.service.js', () => ({
  default: { findById: jest.fn(), updateProfile: jest.fn() },
}));

jest.unstable_mockModule('../src/services/log.service.js', () => ({
  default: { findByUserId: jest.fn(), summarizeLogsByUserId: jest.fn(), summarizeErrorsByUserId: jest.fn() },
}));

jest.unstable_mockModule('../src/services/product.service.js', () => ({
    default: {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getRecommendations: jest.fn(),
    },
}));

const { default: app } = await import('../src/app.js');
const { default: userService } = await import('../src/services/user.service.js');
const { default: logService } = await import('../src/services/log.service.js');
const { default: productService } = await import('../src/services/product.service.js');


afterAll(async () => {
  await db.end();
});

describe('Additional Controller Tests', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/user/profile', () => {
    it('should fetch the user profile successfully', async () => {
      userService.findById.mockResolvedValue({ id: 'user-1' });
      const res = await request(app).get('/api/user/profile');
      expect(res.statusCode).toBe(200);
      expect(userService.findById).toHaveBeenCalledWith('user-1');
    });
  });

  describe('GET /api/logs', () => {
    it('should fetch user logs successfully', async () => {
      logService.findByUserId.mockResolvedValue([{ endpoint: '/api/test' }]);
      const res = await request(app).get('/api/logs');
      expect(res.statusCode).toBe(200);
      expect(logService.findByUserId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product successfully', async () => {
        productService.update.mockResolvedValue(1);
        const res = await request(app).put('/api/products/prod-1').send({ name: 'Updated Product' });
        expect(res.statusCode).toBe(200);
        expect(productService.update).toHaveBeenCalledWith('prod-1', { name: 'Updated Product' });
    });
  });
});