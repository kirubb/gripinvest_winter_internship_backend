import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/db.js', () => ({
  default: {
    query: jest.fn(),
  },
}));

const { default: logService } = await import('../src/services/log.service.js');
const { default: db } = await import('../src/config/db.js');

describe('Log Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('summarizeLogsByUserId', () => {
    it('should correctly summarize logs', async () => {
      const mockLogs = [{ status_code: 200 }, { status_code: 201 }, { status_code: 404 }];
      db.query.mockResolvedValue([mockLogs]);

      const result = await logService.summarizeLogsByUserId('user-1');

      expect(result.totalRequests).toBe(3);
      expect(result.successfulRequests).toBe(2);
      expect(result.failedRequests).toBe(1);
    });
  });

  describe('summarizeErrorsByUserId', () => {
    it('should return a positive summary if no errors are found', async () => {
        db.query.mockResolvedValue([ [] ]); // No error rows
        const result = await logService.summarizeErrorsByUserId('user-1');
        expect(result.summary).toContain('no error patterns');
    });

    it('should identify the most common error endpoint', async () => {
        const mockErrorLogs = [
            { endpoint: '/api/auth/login', error_count: 3 },
            { endpoint: '/api/investments', error_count: 1 },
        ];
        db.query.mockResolvedValue([ mockErrorLogs ]);
        const result = await logService.summarizeErrorsByUserId('user-1');
        expect(result.summary).toContain('/api/auth/login');
        expect(result.summary).toContain('3 times');
    });
  });
});