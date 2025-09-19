import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/db.js';

jest.unstable_mockModule('../src/services/auth.service.js', () => ({
  default: {
    signup: jest.fn(),
    login: jest.fn(),
  },
}));

const { default: authService } = await import('../src/services/auth.service.js');

afterAll(async () => {
  await db.end();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/signup', () => {
  // ... your existing signup tests are here ...
});

describe('POST /api/auth/login', () => {
  it('should return a token for a successful login', async () => {
    authService.login.mockResolvedValue('fake_jwt_token');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBe('fake_jwt_token');
  });

  it('should return 401 for invalid credentials', async () => {
    authService.login.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toEqual(401);
  });
});