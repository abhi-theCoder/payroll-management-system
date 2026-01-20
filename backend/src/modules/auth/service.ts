import prisma from '@config/database';
import { UnauthorizedException, DuplicateException } from '@shared/exceptions';
import { RegisterRequest, TokenPayload } from './dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@config/env';

/**
 * Auth Service - Handles authentication logic
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<{ id: string; email: string; role: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new DuplicateException('User', 'email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, config.BCRYPT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        active: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: any; token: string; refreshToken: string }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.active) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment login attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: { increment: 1 },
          ...(user.loginAttempts >= 4 && {
            lockedUntil: new Date(Date.now() + 30 * 60 * 1000), // Lock for 30 minutes
          }),
        },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    // Generate tokens
    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = this.generateRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(token: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newToken = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = this.generateRefreshToken({
        id: user.id,
      });

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user (blacklist token)
   */
  async logout(token: string, userId: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as any;
      const expiresAt = new Date((decoded.exp || 0) * 1000);

      await prisma.tokenBlacklist.create({
        data: {
          token,
          userId,
          expiresAt,
        },
      });
    } catch (error) {
      // Continue even if blacklisting fails
    }
  }

  /**
   * Verify token is not blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await prisma.tokenBlacklist.findUnique({
      where: { token },
    });

    return !!blacklistedToken;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, config.BCRYPT_ROUNDS);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  /**
   * Generate JWT token
   */
  private generateToken(payload: TokenPayload): string {
    // @ts-ignore - JWT library types are overly strict with SignOptions
    return jwt.sign(payload as any, config.JWT_SECRET as any, {
      expiresIn: config.JWT_EXPIRES_IN,
    } as any);
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(payload: Pick<TokenPayload, 'id'>): string {
    // @ts-ignore - JWT library types are overly strict with SignOptions
    return jwt.sign(payload as any, config.JWT_REFRESH_SECRET as any, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    } as any);
  }
}

export default new AuthService();
