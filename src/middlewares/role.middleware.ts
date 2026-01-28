import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
  next();
};

export const vendedorOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'VENDEDOR') {
    return res.status(403).json({ error: 'Acceso denegado. Solo vendedores.' });
  }
  next();
};
