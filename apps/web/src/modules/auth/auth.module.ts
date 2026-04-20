import { Controller, Get, Post, Body, Res, Req, Query, Render, Module } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiService } from '../../common/api.service';

@Controller('auth')
export class AuthController {
  constructor(private apiService: ApiService) {}

  @Get('login')
  @Render('auth/login')
  loginPage(@Query('redirect') redirect?: string, @Query('error') error?: string) {
    return { title: 'Login — RSE', redirect, error, page: 'login' };
  }

  @Post('login')
  async loginAction(
    @Body() body: { email: string; password: string; redirect?: string },
    @Res() res: Response,
  ) {
    try {
      const result = await this.apiService.login({ email: body.email, password: body.password });
      res.cookie('rse_token', result.accessToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });
      return res.redirect(body.redirect || '/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid credentials';
      return res.redirect(`/auth/login?error=${encodeURIComponent(message)}`);
    }
  }

  @Get('register')
  @Render('auth/register')
  registerPage(@Query('error') error?: string) {
    return { title: 'Create Account — RSE', error, page: 'register' };
  }

  @Post('register')
  async registerAction(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.apiService.register(body);
      res.cookie('rse_token', result.accessToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });
      return res.redirect('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed';
      return res.redirect(`/auth/register?error=${encodeURIComponent(message)}`);
    }
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('rse_token');
    return res.redirect('/');
  }
}

@Module({ controllers: [AuthController] })
export class AuthModule {}
