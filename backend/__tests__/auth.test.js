const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/auth.service');
const db = require('../src/config/db');

jest.mock('../src/services/auth.service');

afterAll(async () => {
  await db.end();
});

describe('POST /api/auth/signup', () => {
  it('should create a user successfully and return 201', async () => {
    // We tell our mock service what to return when the 'signup' function is called
    authService.signup.mockResolvedValue({ affectedRows: 1 });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        password: 'Password123!',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User created successfully!');
  });

  it('should return 409 if the email already exists', async () => {
    // We tell our mock service to simulate a duplicate email error
    authService.signup.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        email: 'jane.doe@example.com',
        password: 'Password123!',
      });
    
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toBe('Error: Email already exists.');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        // Missing email and password
      });

    expect(res.statusCode).toEqual(400);
  });
});

