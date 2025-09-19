import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/db.js', () => ({
  default: {
    query: jest.fn(),
  },
}));

const { default: userService } = await import('../src/services/user.service.js');
const { default: db } = await import('../src/config/db.js');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should retrieve a user by their ID', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' };
      db.query.mockResolvedValue([ [mockUser] ]);

      const user = await userService.findById('user-1');
      
      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['user-1']);
      expect(user).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update a user\'s risk appetite and balance', async () => {
      const mockUser = { id: 'user-1', risk_appetite: 'moderate', balance: '10000.00' };
      
      db.query
        .mockResolvedValueOnce([ [mockUser] ]) // For the initial findById call
        .mockResolvedValueOnce([ {} ])          // For the UPDATE query
        .mockResolvedValueOnce([ [{...mockUser, risk_appetite: 'high', balance: 15000.00}] ]); // For the final findById call

      await userService.updateProfile('user-1', {
        risk_appetite: 'high',
        addBalance: '5000',
      });

      expect(db.query).toHaveBeenCalledWith(
        'UPDATE users SET risk_appetite = ?, balance = ? WHERE id = ?',
        ['high', 15000, 'user-1']
      );
    });
  });
});