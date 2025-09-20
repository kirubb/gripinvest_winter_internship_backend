import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../src/config/db.js';

jest.unstable_mockModule('../src/middleware/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'user-1' };
    next();
  },
}));

jest.unstable_mockModule('../src/services/log.service.js', () => ({
  default: {
    findByUserId: jest.fn(),
    summarizeLogsByUserId: jest.fn(),
    summarizeErrorsByUserId: jest.fn(),
  },
}));

const { default: app } = await import('../src/app.js');
const { default: logService } = await import('../src/services/log.service.js');

afterAll(async () => {
  await db.end();
});

describe('Log Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/logs', () => {
    it('should fetch logs successfully', async () => {
      logService.findByUserId.mockResolvedValue([]);
      const res = await request(app).get('/api/logs');
      expect(res.statusCode).toBe(200);
    });

    it('should return 500 if the service fails', async () => {
      logService.findByUserId.mockRejectedValue(new Error());
      const res = await request(app).get('/api/logs');
      expect(res.statusCode).toBe(500);
    });
  });

  describe('GET /api/logs/summary', () => {
    it('should fetch the activity summary successfully', async () => {
      logService.summarizeLogsByUserId.mockResolvedValue({ summary: 'Test' });
      const res = await request(app).get('/api/logs/summary');
      expect(res.statusCode).toBe(200);
    });

    it('should return 500 if the service fails', async () => {
      logService.summarizeLogsByUserId.mockRejectedValue(new Error());
      const res = await request(app).get('/api/logs/summary');
      expect(res.statusCode).toBe(500);
    });
  });

  describe('GET /api/logs/error-summary', () => {
    it('should fetch the error summary successfully', async () => {
        logService.summarizeErrorsByUserId.mockResolvedValue({ summary: 'Test' });
        const res = await request(app).get('/api/logs/error-summary');
        expect(res.statusCode).toBe(200);
    });

    it('should return 500 if the service fails', async () => {
        logService.summarizeErrorsByUserId.mockRejectedValue(new Error());
        const res = await request(app).get('/api/logs/error-summary');
        expect(res.statusCode).toBe(500);
    });
  });
});