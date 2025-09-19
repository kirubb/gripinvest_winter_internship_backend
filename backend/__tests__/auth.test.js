import request from 'supertest'
import app from '../src/app.js'
import authService from '../src/services/auth.service.js'
import db from '../src/config/db.js'

jest.mock('../src/services/auth.service.js')

afterAll(async () => {
  await db.end()
})

describe('POST /api/auth/signup', () => {
  it('should create a user successfully and return 201', async () => {
    authService.signup.mockResolvedValue({ affectedRows: 1 })

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        password: 'Password123!',
      })

    expect(res.statusCode).toEqual(201)
    expect(res.body.message).toBe('User created successfully!')
  })

  it('should return 409 if the email already exists', async () => {
    authService.signup.mockRejectedValue({ code: 'ER_DUP_ENTRY' })

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        email: 'jane.doe@example.com',
        password: 'Password123!',
      })

    expect(res.statusCode).toEqual(409)
    expect(res.body.message).toBe('Error: Email already exists.')
  })

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      first_name: 'Jane',
    })

    expect(res.statusCode).toEqual(400)
  })
})