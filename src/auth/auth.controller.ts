import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
  Req,
} from '@nestjs/common';
import { AuthService, AniListUser, AnilistTokenResponse } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('login')
  @Redirect(
    'https://anilist.co/api/v2/oauth/authorize?client_id=24415&response_type=code',
    302,
  )
  login() { }

  @Get('callback')
  async callback(
    @Query('code') code: string,
  ): Promise<{ accessToken: string; user: AniListUser }> {
    if (!code) {
      throw new BadRequestException('Authorization code is missing');
    }
    const tokenData: AnilistTokenResponse =
      await this.authService.getAccessToken(code);
    const userProfile: AniListUser = await this.authService.getUserProfile(
      tokenData.access_token,
    );

    await this.authService.storeSession(userProfile.id, tokenData.access_token);

    return {
      accessToken: tokenData.access_token,
      user: userProfile,
    };
  }
  @Get('session')
  async getSession(@Req() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const session = await this.authService.getSession(userId);
    if (!session) throw new BadRequestException('No Session found');

    return session;
  }
}
