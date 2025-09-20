import { jest } from '@jest/globals';
import crypto from 'crypto';

jest.unstable_mockModule('../src/config/db.js', () => ({ default: { query: jest.fn() } }));
jest.unstable_mockModule('bcryptjs', () => ({ default: { compare: jest.fn(), hash: jest.fn(), genSalt: jest.fn() } }));
jest.unstable_mockModule('jsonwebtoken', () => ({ default: { sign: jest.fn() } }));

const { default: authService } = await import('../src/services/auth.service.js');
const { default: db } = await import('../src/config/db.js');
const { default: bcrypt } = await import('bcryptjs');

describe('Auth Service', () => {
  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('should return null if user is not found', async () => {
      db.query.mockResolvedValue([ [] ]);
      const result = await authService.login({ email: 'no@no.com', password: 'pw' });
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const mockUser = { password_hash: 'hashed_pw' };
      db.query.mockResolvedValue([ [mockUser] ]);
      bcrypt.compare.mockResolvedValue(false);
      const result = await authService.login({ email: 'user@test.com', password: 'wrong_pw' });
      expect(result).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('should generate and save a reset token', async () => {
      db.query.mockResolvedValue([ [{ id: 'user-1' }] ]);
      const token = await authService.forgotPassword('test@example.com');
      expect(token).toBeDefined();
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users SET reset_token_hash'), expect.any(Array));
    });
  });
  
  describe('resetPassword', () => {
      it('should throw an error for an invalid token', async () => {
        db.query.mockResolvedValue([ [] ]);
        await expect(authService.resetPassword({ token: 'bad', password: 'new' })).rejects.toThrow('Token is invalid or has expired.');
      });
  });
});