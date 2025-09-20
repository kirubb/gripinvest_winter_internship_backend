import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../src/config/db.js';

jest.unstable_mockModule('../src/services/auth.service.js', () => ({
  default: {
    signup: jest.fn(),
    login: jest.fn(),
  },
}));

const { default: app } = await import('../src/app.js');
const { default: authService } = await import('../src/services/auth.service.js');

afterAll(async () => {
  await db.end();
});

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signupController', () => {
    const userData = { first_name: 'Test', email: 'test@example.com', password: 'password' };

    it('should return 201 on successful signup', async () => {
      authService.signup.mockResolvedValue({ affectedRows: 1 });
      const res = await request(app).post('/api/auth/signup').send(userData);
      expect(res.statusCode).toBe(201);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/signup').send({ email: 'test@test.com' });
      expect(res.statusCode).toBe(400);
    });
    
    it('should return 400 for a weak password', async () => {
      authService.signup.mockRejectedValue({ statusCode: 400, message: 'Weak password' });
      const res = await request(app).post('/api/auth/signup').send(userData);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Weak password');
    });

    it('should return 409 for a duplicate email', async () => {
      authService.signup.mockRejectedValue({ code: 'ER_DUP_ENTRY' });
      const res = await request(app).post('/api/auth/signup').send(userData);
      expect(res.statusCode).toBe(409);
    });

    it('should return 500 for a generic server error', async () => {
      authService.signup.mockRejectedValue(new Error('Generic error'));
      const res = await request(app).post('/api/auth/signup').send(userData);
      expect(res.statusCode).toBe(500);
    });
  });

  describe('loginController', () => {
    const loginData = { email: 'test@example.com', password: 'password' };

    it('should return 200 and a token on successful login', async () => {
      authService.login.mockResolvedValue('fake-token');
      const res = await request(app).post('/api/auth/login').send(loginData);
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe('fake-token');
    });

    it('should return 401 for invalid credentials', async () => {
      authService.login.mockResolvedValue(null);
      const res = await request(app).post('/api/auth/login').send(loginData);
      expect(res.statusCode).toBe(401);
    });

    it('should return 500 for a generic server error', async () => {
      authService.login.mockRejectedValue(new Error('Generic error'));
      const res = await request(app).post('/api/auth/login').send(loginData);
      expect(res.statusCode).toBe(500);
    });
  });
});