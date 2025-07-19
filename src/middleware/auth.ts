import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Bypass auth if NODE_ENV=test (for tests)
    if (process.env.NODE_ENV === 'test') {
      (req as any).user = { id: 'test-user-id' };
      return next();
    }

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};