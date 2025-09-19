import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/db.js', () => ({
  default: {
    getConnection: jest.fn(),
  },
}));

const { default: investmentService } = await import('../src/services/investment.service.js');
const { default: db } = await import('../src/config/db.js');

describe('Investment Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an investment and deduct from balance if user has sufficient funds', async () => {
      const mockUser = { id: 'user-1', balance: 50000 };
      const mockProduct = { id: 'prod-1', min_investment: 1000, max_investment: 20000 };
      
      const mockQuery = jest.fn()
        .mockResolvedValueOnce([ [mockUser] ])
        .mockResolvedValueOnce([ [mockProduct] ])
        .mockResolvedValue([ {} ]);

      db.getConnection.mockResolvedValue({
        beginTransaction: jest.fn(),
        query: mockQuery,
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
      });

      await investmentService.create('user-1', 'prod-1', 15000);
      expect(mockQuery).toHaveBeenCalledWith('UPDATE users SET balance = ? WHERE id = ?', [35000, 'user-1']);
    });

    it('should throw an error if the user has insufficient balance', async () => {
      const mockUser = { id: 'user-1', balance: 10000 };
      
      db.getConnection.mockResolvedValue({
        beginTransaction: jest.fn(),
        query: jest.fn().mockResolvedValue([ [mockUser] ]),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
      });

      await expect(investmentService.create('user-1', 'prod-1', 15000))
        .rejects
        .toThrow('Insufficient balance to make this investment.');
    });
  });
});