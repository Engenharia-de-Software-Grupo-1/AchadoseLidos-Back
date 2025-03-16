import request from 'supertest';
import express from 'express';
import { ErrorMessages } from '@src/utils/ErrorMessages';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import { requireAuth } from '../authMiddleware';

jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/protected', requireAuth, (req: express.Request, res: express.Response) => {
  res.status(200).send('Success');
});

describe('requireAuth Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ErrorMessages.tokenNotProvided);
  });

  it('should return 500 if JWT_SECRET is not set', async () => {
    process.env.JWT_SECRET = '';
    const response = await request(app).get('/protected').set('Cookie', 'authToken=fakeToken');
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(ErrorMessages.serverError);
  });

  it('should return 401 if token is invalid', async () => {
    process.env.JWT_SECRET = 'secret';
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'));
    });

    const response = await request(app).get('/protected').set('Cookie', 'authToken=fakeToken');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ErrorMessages.invalidToken);
  });

  it('should call next if token is valid', async () => {
    process.env.JWT_SECRET = 'secret';
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, {});
    });

    const response = await request(app).get('/protected').set('Cookie', ['authToken=validToken']);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Success');
  });
});
