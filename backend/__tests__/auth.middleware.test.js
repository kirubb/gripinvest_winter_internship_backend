import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../src/middleware/auth.middleware.js';

process.env.JWT_SECRET = 'E7E8973EFC5B2DFFCB9D5D88A9382';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', () => {
    authenticateToken(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it('should return 403 if token is invalid', () => {
    req.headers['authorization'] = 'Bearer invalidtoken';
    authenticateToken(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should call next if token is valid', () => {
    const user = { id: '1', email: 'test@example.com' };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    req.headers['authorization'] = `Bearer ${token}`;
    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject(user);
  });
});
