import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
export interface AnilistTokenResponse {
  access_token: string;
  token_type: string;
  expiers_in: number;
}
export interface AniListUser {
  id: number;
  name: string;
  avatar: {
    large: string;
  };
}

@Injectable()
export class AuthService {
  private clientId = '24415';
  private clientSecret = '6auII3tVsrSvYgtlOhPSc9wUGmvmwVgWO1jnu0qY';
  private redirectUri = 'http://localhost:3000/auth/callback';

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) { }

  async getAccessToken(code: string): Promise<AnilistTokenResponse> {
    const response = await axios.post<AnilistTokenResponse>(
      'https://anilist.co/api/v2/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code,
      },
    );

    return response.data;
  }

  async getUserProfile(accessToken: string): Promise<AniListUser> {
    const response = await axios.post<{ data: { Viewer: AniListUser } }>(
      'https://graphql.anilist.co',
      {
        query: `
          query {
            Viewer {
              id
              name
              avatar {
                large
              }
            }
          }
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data.Viewer;
  }

  async storeSession(userId: number, accessToken: string) {
    let session = await this.sessionRepository.findOne({ where: { userId } });

    if (session) {
      session.accessToken = accessToken;
    } else {
      session = this.sessionRepository.create({ userId, accessToken });
    }

    await this.sessionRepository.save(session);
  }

  async getSession(userId: number): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { userId } });
  }

  async getSessionFromToken(accessToken: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { accessToken } });
  }
}
