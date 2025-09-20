import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../src/config/db.js';

jest.unstable_mockModule('../src/middleware/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'user-1' };
    next();
  },
}));

jest.unstable_mockModule('../src/services/user.service.js', () => ({
  default: {
    findById: jest.fn(),
    updateProfile: jest.fn(),
  },
}));

const { default: app } = await import('../src/app.js');
const { default: userService } = await import('../src/services/user.service.js');

afterAll(async () => {
  await db.end();
});

describe('User Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/user/profile', () => {
    it('should return 500 if the service throws an error', async () => {
      userService.findById.mockRejectedValue(new Error('Database error'));
      const res = await request(app).get('/api/user/profile');
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toBe('Error fetching profile');
    });
  });

});