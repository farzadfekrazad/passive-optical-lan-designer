import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// FIX: Changed AuthenticatedRequest to an interface that extends the Express Request type. This resolves errors where properties like 'headers', 'body', and 'params' were not found.
export interface AuthenticatedRequest extends Request {
    user?: User;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ messageKey: 'auth.error.unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as User;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ messageKey: 'auth.error.invalidToken' });
    }
};

export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ messageKey: 'auth.error.unauthorized' });
    }
    next();
};