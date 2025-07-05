import { Request, Response, NextFunction } from 'express';

export const validateFields = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
        res.status(400).json({
            message: 'Request body is missing',
      });
      return;
    }

    const missing = requiredFields.filter(field => !req.body[field]);
    if (missing.length > 0) {
        res.status(400).json({
        message: `Missing required field(s): ${missing.join(', ')}`,
      });
        return;
    }
    next();
  };
};