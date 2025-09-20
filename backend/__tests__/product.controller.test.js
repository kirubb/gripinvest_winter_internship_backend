import { jest } from '@jest/globals';
import request from 'supertest';
import db from '../src/config/db.js';

jest.unstable_mockModule('../src/middleware/auth.middleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'user-1' };
    next();
  },
}));

jest.unstable_mockModule('../src/services/product.service.js', () => ({
  default: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

const { default: app } = await import('../src/app.js');
const { default: productService } = await import('../src/services/product.service.js');

afterAll(async () => {
  await db.end();
});

describe('Product Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      productService.findAll.mockResolvedValue([{ name: 'Test Product' }]);
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body[0].name).toBe('Test Product');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
        productService.create.mockResolvedValue({ id: 'prod-2', name: 'New Product' });
        const res = await request(app).post('/api/products').send({ name: 'New Product' });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('New Product');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product if found', async () => {
        productService.findById.mockResolvedValue({ id: 'prod-1', name: 'Found Product' });
        const res = await request(app).get('/api/products/prod-1');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Found Product');
    });

    it('should return 404 if product not found', async () => {
        productService.findById.mockResolvedValue(null);
        const res = await request(app).get('/api/products/prod-x');
        expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
        productService.update.mockResolvedValue(1);
        const res = await request(app).put('/api/products/prod-1').send({ name: 'Updated' });
        expect(res.statusCode).toBe(200);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
        productService.remove.mockResolvedValue(1);
        const res = await request(app).delete('/api/products/prod-1');
        expect(res.statusCode).toBe(200);
    });
  });
});