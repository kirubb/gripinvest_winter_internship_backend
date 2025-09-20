import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/db.js', () => ({
  default: {
    query: jest.fn(),
  },
}));

const { default: productService } = await import('../src/services/product.service.js');
const { default: db } = await import('../src/config/db.js');

describe('Product Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product and return it', async () => {
      db.query.mockResolvedValue([{ insertId: 'new-prod-id' }]);
      const productData = { name: 'New Fund', risk_level: 'high', annual_yield: 15, tenure_months: 60, investment_type: 'mf' };
      const result = await productService.create(productData);
      expect(result).toHaveProperty('id', 'new-prod-id');
    });

    it('should auto-generate a description if one is not provided', async () => {
        db.query.mockResolvedValue([{ insertId: 'new-prod-id' }]);
        const productData = { name: 'Another Fund', risk_level: 'low', annual_yield: 5, tenure_months: 12, investment_type: 'bond' };
        const result = await productService.create(productData);
        expect(result.description).toContain('A low-risk bond');
    });
  });

  describe('findById', () => {
    it('should return a product if found', async () => {
      const mockProduct = { id: 'prod-1', name: 'Test Product' };
      db.query.mockResolvedValue([ [mockProduct] ]);
      const result = await productService.findById('prod-1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [{ id: '1' }, { id: '2' }];
      db.query.mockResolvedValue([ mockProducts ]);
      const result = await productService.findAll();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('update', () => {
    it('should return 1 on successful update', async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await productService.update('prod-1', { name: 'Updated' });
      expect(result).toBe(1);
    });
  });

  describe('remove', () => {
    it('should return 1 if a row is deleted', async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await productService.remove('prod-1');
      expect(result).toBe(1);
    });
  });

  describe('getRecommendations', () => {
    it('should return recommended products', async () => {
      const mockProducts = [{ id: 'prod-rec', name: 'Recommended Product' }];
      db.query.mockResolvedValue([ mockProducts ]);
      const user = { risk_appetite: 'low', balance: 50000 };
      const result = await productService.getRecommendations(user);
      expect(result).toEqual(mockProducts);
    });
  });
});