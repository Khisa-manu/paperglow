import jwt from 'jsonwebtoken';
import { config } from '../config/index';

export interface TokenPayload {
  userId: number;
  email: string;
  organizationId: number;
  roleName: string;
  [key: string]: any;
}

export function signToken(payload: TokenPayload, expiresIn: string = config.jwtExpiresIn): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn } as any);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}
