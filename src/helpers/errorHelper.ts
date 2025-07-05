import { Response } from 'express';

export const handleError = (res: Response, status: number, message: string, error: any) => {
  res.status(status).json({ message, error });
};
