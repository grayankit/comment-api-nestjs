import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization Header');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const session = await this.authService.getSessionFromToken(token);

    if (!session) {
      throw new UnauthorizedException('Inavalid or expired token');
    }
    request.user = { id: session.userId };
    return true;
  }
}
