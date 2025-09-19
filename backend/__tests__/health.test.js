import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/db.js';// <-- 1. Import the database pool

// This hook runs once after all tests in this file are done
afterAll(async () => {
  await db.end(); // <-- 2. Close the database connection pool
});

describe('Health Check API', () => {
  it('should return 200 OK and database connected status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBe('connected');
  });
});