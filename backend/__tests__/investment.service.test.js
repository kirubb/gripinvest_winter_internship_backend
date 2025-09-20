import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/db.js', () => ({
  default: {
    getConnection: jest.fn(),
    query: jest.fn(),
  },
}));

const { default: investmentService } = await import('../src/services/investment.service.js');
const { default: db } = await import('../src/config/db.js');

describe('Investment Service', () => {
  const mockConnection = {
    beginTransaction: jest.fn(),
    query: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(() => {
    db.getConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an investment and deduct from balance if user has sufficient funds', async () => {
      const mockUser = { id: 'user-1', balance: 50000 };
      const mockProduct = { id: 'prod-1', min_investment: 1000, max_investment: 20000, annual_yield: 10, tenure_months: 12 };
      
      mockConnection.query
        .mockResolvedValueOnce([ [mockUser] ])
        .mockResolvedValueOnce([ [mockProduct] ]);

      await investmentService.create('user-1', 'prod-1', 15000);
      
      expect(mockConnection.commit).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledWith('UPDATE users SET balance = ? WHERE id = ?', [35000, 'user-1']);
    });

    it('should throw an error if the user has insufficient balance', async () => {
      const mockUser = { id: 'user-1', balance: 10000 };
      mockConnection.query.mockResolvedValueOnce([ [mockUser] ]);

      await expect(investmentService.create('user-1', 'prod-1', 15000)).rejects.toThrow('Insufficient balance');
      expect(mockConnection.rollback).toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return a user\'s investments', async () => {
      const mockPortfolio = [{ id: 'inv-1' }];
      db.query.mockResolvedValue([ mockPortfolio ]);
      const result = await investmentService.findByUserId('user-1');
      expect(result).toEqual(mockPortfolio);
    });
  });

  describe('cancel', () => {
    it('should cancel an active investment and refund the user', async () => {
      const mockInvestment = { id: 'inv-1', status: 'active', amount: 5000 };
      mockConnection.query.mockResolvedValue([ [mockInvestment] ]);
      
      await investmentService.cancel('user-1', 'inv-1');
      
      expect(mockConnection.commit).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledWith('UPDATE investments SET status = ? WHERE id = ?', ['cancelled', 'inv-1']);
      expect(mockConnection.query).toHaveBeenCalledWith('UPDATE users SET balance = balance + ? WHERE id = ?', [5000, 'user-1']);
    });
  });
});