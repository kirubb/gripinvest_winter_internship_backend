import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/db.js';

describe('Authentication API Flow', () => {
  const testUser = {
    first_name: 'Integration',
    email: 'integration.test@example.com',
    password: 'AStrongPassword123!',
  };

  // Clean up before and after all tests in this file
  beforeAll(async () => {
    await db.query("DELETE FROM users WHERE email = ?", [testUser.email]);
  });

  afterAll(async () => {
    await db.query("DELETE FROM users WHERE email = ?", [testUser.email]);
    await db.end();
  });

  it('should handle the full user authentication lifecycle', async () => {
    // 1. Test successful signup
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    expect(signupRes.statusCode).toEqual(201);

    // 2. Test duplicate signup failure
    const duplicateRes = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    expect(duplicateRes.statusCode).toEqual(409);

    // 3. Test login with wrong password
    const wrongPassRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrong-password' });
    expect(wrongPassRes.statusCode).toEqual(401);

    // 4. Test successful login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});