import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../src/config/db.js';

jest.unstable_mockModule('../src/middleware/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'user-1' };
    next();
  },
}));

jest.unstable_mockModule('../src/services/investment.service.js', () => ({
  default: {
    create: jest.fn(),
    getPortfolio: jest.fn(),
    cancel: jest.fn(),
  },
}));

const { default: app } = await import('../src/app.js');
const { default: investmentService } = await import('../src/services/investment.service.js');

afterAll(async () => {
  await db.end();
});

describe('Investment Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('POST /api/investments', () => {
    it('should create an investment', async () => {
      investmentService.create.mockResolvedValue({ message: 'Success' });
      const res = await request(app).post('/api/investments').send({ productId: 'p1', amount: 100 });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Success');
    });
  });
  
  // Add more tests for getPortfolio and cancel...
});