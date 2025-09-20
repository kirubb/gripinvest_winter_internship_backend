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
  default: { create: jest.fn(), findByUserId: jest.fn(), cancel: jest.fn() },
}));

const { default: app } = await import('../src/app.js');
const { default: investmentService } = await import('../src/services/investment.service.js');

afterAll(async () => await db.end());

describe('Investment Controller', () => {
  afterEach(() => jest.clearAllMocks());

  it('POST /investments - should create an investment', async () => {
    investmentService.create.mockResolvedValue({ message: 'Success' });
    const res = await request(app).post('/api/investments').send({ productId: 'p1', amount: 100 });
    expect(res.statusCode).toBe(201);
  });
  
  it('POST /investments - should return 500 on service error', async () => {
    investmentService.create.mockRejectedValue(new Error('DB error'));
    const res = await request(app).post('/api/investments').send({ productId: 'p1', amount: 100 });
    expect(res.statusCode).toBe(500);
  });

  it('GET /investments - should get portfolio', async () => {
    investmentService.findByUserId.mockResolvedValue([]);
    const res = await request(app).get('/api/investments');
    expect(res.statusCode).toBe(200);
  });

  it('PUT /investments/:id/cancel - should cancel investment', async () => {
    investmentService.cancel.mockResolvedValue({ message: 'Cancelled' });
    const res = await request(app).put('/api/investments/inv-1/cancel');
    expect(res.statusCode).toBe(200);
  });
});