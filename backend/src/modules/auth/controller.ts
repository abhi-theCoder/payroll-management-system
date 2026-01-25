import { Request, Response } from 'express';
import authService from './service';
import { validateData } from '@shared/utils/validators';
import { RegisterRequestSchema, LoginRequestSchema, RefreshTokenRequestSchema } from './dto';

/**
 * Auth Controller - Handles HTTP requests
 */
export class AuthController {
  /**
   * Register endpoint
   */
  async register(req: Request, res: Response): Promise<void> {
    const data: any = validateData(RegisterRequestSchema, req.body);
    const result = await authService.register(data);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  }

  /**
   * Login endpoint
   */
  async login(req: Request, res: Response): Promise<void> {
    const data: any = validateData(LoginRequestSchema, req.body);
    const result = await authService.login(data.email, data.password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  }

  /**
   * Refresh token endpoint
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    const data: any = validateData(RefreshTokenRequestSchema, req.body);
    const result = await authService.refreshToken(data.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  }

  /**
   * Logout endpoint
   */
  async logout(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = req.user?.id;

    if (token && userId) {
      await authService.logout(token, userId);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }

  /**
   * Change password endpoint
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: 'Old password and new password are required',
      });
      return;
    }

    await authService.changePassword(req.user!.id, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  }

  /**
   * Get current user
   */
  async getMe(req: Request, res: Response): Promise<void> {
    const result = await authService.getCurrentUser(req.user!.id);
    res.status(200).json(result);
  }
}

export default new AuthController();
