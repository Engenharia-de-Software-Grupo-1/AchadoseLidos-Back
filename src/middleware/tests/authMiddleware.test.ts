import request from 'supertest';
import express, { ErrorRequestHandler } from 'express';
import { ErrorMessages } from '@src/errors/ErrorMessages';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { TipoConta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';
import { InvalidTokenError } from '@src/errors/InvalidTokenError';

import { ensureIsSebo, ensureIsUsuario, requireAuth } from '../authMiddleware';

jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/protected', requireAuth, (req: express.Request, res: express.Response) => {
  res.status(200).send('Success');
});

app.get('/sebo', ensureIsSebo, (req: express.Request, res: express.Response) => {
  res.status(200).send('Sebo Access Granted');
});

app.get('/usuario', ensureIsUsuario, (req: express.Request, res: express.Response) => {
  res.status(200).send('Usuario Access Granted');
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: ErrorMessages.serverError });
};

app.use(errorHandler);

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
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new InvalidTokenError();
    });

    const response = await request(app).get('/protected').set('Cookie', 'authToken=fakeToken');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ErrorMessages.invalidToken);
  });

  it('should call next if token is valid', async () => {
    process.env.JWT_SECRET = 'secret';
    (jwt.verify as jest.Mock).mockReturnValue({});

    const response = await request(app).get('/protected').set('Cookie', ['authToken=validToken']);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Success');
  });

  describe('ensureRole Middleware', () => {
    it('should return 401 if no token is provided for ensureIsSebo', async () => {
      const response = await request(app).get('/sebo');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(ErrorMessages.tokenNotProvided);
    });

    it('should return 401 if no token is provided for ensureIsUsuario', async () => {
      const response = await request(app).get('/usuario');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(ErrorMessages.tokenNotProvided);
    });

    it('should return 403 if token role is not SEBO for ensureIsSebo', async () => {
      process.env.JWT_SECRET = 'secret';
      (jwt.verify as jest.Mock).mockReturnValue({ role: TipoConta.USUARIO });

      const response = await request(app).get('/sebo').set('Cookie', ['authToken=validToken']);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(ErrorMessages.noPermissionForAction);
    });

    it('should return 403 if token role is not USUARIO for ensureIsUsuario', async () => {
      process.env.JWT_SECRET = 'secret';
      (jwt.verify as jest.Mock).mockReturnValue({ role: TipoConta.SEBO });

      const response = await request(app).get('/usuario').set('Cookie', ['authToken=validToken']);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe(ErrorMessages.noPermissionForAction);
    });

    it('should return 500 if JWT_SECRET is not set for ensureIsSebo', async () => {
      process.env.JWT_SECRET = '';
      const response = await request(app).get('/sebo').set('Cookie', ['authToken=validToken']);
      expect(response.status).toBe(500);
      expect(response.body.message).toBe(ErrorMessages.serverError);
    });

    it('should return 500 if JWT_SECRET is not set for ensureIsUsuario', async () => {
      process.env.JWT_SECRET = '';
      const response = await request(app).get('/usuario').set('Cookie', ['authToken=validToken']);
      expect(response.status).toBe(500);
      expect(response.body.message).toBe(ErrorMessages.serverError);
    });

    it('should return 401 if token is invalid for ensureIsSebo', async () => {
      process.env.JWT_SECRET = 'secret';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new InvalidTokenError();
      });

      const response = await request(app).get('/sebo').set('Cookie', ['authToken=invalidToken']);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(ErrorMessages.invalidToken);
    });

    it('should return 401 if token is invalid for ensureIsUsuario', async () => {
      process.env.JWT_SECRET = 'secret';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new InvalidTokenError();
      });

      const response = await request(app).get('/usuario').set('Cookie', ['authToken=invalidToken']);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(ErrorMessages.invalidToken);
    });

    it('should call next if token role is SEBO for ensureIsSebo', async () => {
      process.env.JWT_SECRET = 'secret';
      (jwt.verify as jest.Mock).mockReturnValue({ role: TipoConta.SEBO });

      const response = await request(app).get('/sebo').set('Cookie', ['authToken=validToken']);
      expect(response.status).toBe(200);
      expect(response.text).toBe('Sebo Access Granted');
    });

    it('should call next if token role is USUARIO for ensureIsUsuario', async () => {
      process.env.JWT_SECRET = 'secret';
      (jwt.verify as jest.Mock).mockReturnValue({ role: TipoConta.USUARIO });

      const response = await request(app).get('/usuario').set('Cookie', ['authToken=validToken']);
      expect(response.status).toBe(200);
      expect(response.text).toBe('Usuario Access Granted');
    });
  });
});
