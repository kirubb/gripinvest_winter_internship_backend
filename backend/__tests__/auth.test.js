import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/db.js';

afterAll(async () => {
  await db.end();
});

beforeEach(async () => {
  await db.query("DELETE FROM users WHERE email = 'jane.doe@example.com'");
  await db.query("DELETE FROM users WHERE email = 'test.login@example.com'");
});

describe('Authentication API', () => {
  const signupUser = {
    first_name: 'Jane',
    email: 'jane.doe@example.com',
    password: 'AStrongPassword123!',
  };
  
  const loginUser = {
    first_name: 'Test',
    email: 'test.login@example.com',
    password: 'AStrongPassword123!',
  };

  it('should create a user successfully and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(signupUser);
    expect(res.statusCode).toEqual(201);
  });

  it('should return 409 if the email already exists', async () => {
    await request(app).post('/api/auth/signup').send(signupUser);
    const res = await request(app).post('/api/auth/signup').send(signupUser);
    expect(res.statusCode).toEqual(409);
  });

  it('should log in a user successfully and return a token', async () => {
    await request(app).post('/api/auth/signup').send(loginUser);
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: loginUser.email,
        password: loginUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 401 for invalid credentials', async () => {
    await request(app).post('/api/auth/signup').send(loginUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: loginUser.email,
        password: 'wrongpassword',
      });
    
    expect(res.statusCode).toEqual(401);
  });
});