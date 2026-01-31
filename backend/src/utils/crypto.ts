import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from '../types';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export async function generateToken(payload: JWTPayload, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    return new SignJWT({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Token expires in 7 days
        .sign(secretKey);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
    try {
        const encoder = new TextEncoder();
        const secretKey = encoder.encode(secret);

        const { payload } = await jwtVerify(token, secretKey);

        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as string,
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

/**
 * Generate a unique ID (simple UUID v4 implementation)
 */
export function generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
