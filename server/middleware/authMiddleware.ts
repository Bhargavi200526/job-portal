import jwt from 'jsonwebtoken';
import Company from '../models/Company';
import { Request, Response, NextFunction } from 'express';

export const protectCompany = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    
    try {
      token = req.headers.authorization.split(' ')[1];
      const cln = token.replace(/^'|'$/g, '')
      const decoded = jwt.verify(cln, process.env.JWT_SECRET!) as { id: string };
      // const decoded = jwt.verify(token, process.env.JWT_SECRET) as unknown as { id: string };

      

      const company = await Company.findById(decoded.id).select('-password');

      if (!company) {
        res.status(401).json({ message: 'Company not found' });
        return; 
      }

      (req as any).company = company;
      next();
      return;
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  res.status(401).json({ message: 'Not authorized, no token' });
  return;
};
