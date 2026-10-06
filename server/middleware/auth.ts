import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/response';
import { dbService } from '../services/dbService';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload & {
    name?: string;
    status?: string;
  };
  organizationId?: number;
  orgRole?: string;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && (req.cookies.token || req.cookies.paperglow_token)) {
      token = req.cookies.token || req.cookies.paperglow_token;
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    const payload = verifyToken(token);
    
    // Verify user exists and is active
    const user = await dbService.findById('users', payload.userId);
    if (!user || user.status === 'suspended') {
      return sendError(res, 'User account is inactive or no longer exists.', 401);
    }

    req.user = {
      ...payload,
      name: user.name,
      status: user.status,
    };

    next();
  } catch (err: any) {
    return sendError(res, 'Invalid or expired session. Please log in again.', 401);
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && (req.cookies.token || req.cookies.paperglow_token)) {
      token = req.cookies.token || req.cookies.paperglow_token;
    }

    if (token) {
      const payload = verifyToken(token);
      req.user = payload;
    }
  } catch (e) {
    // Ignore invalid optional tokens
  }
  next();
}
