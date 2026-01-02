import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean {
    try {
      const client = context.switchToWs().getClient();

      const queryToken = client?.handshake?.query?.token as string | undefined;
      const authToken = client?.handshake?.auth?.token as string | undefined;
      const headerToken = client?.handshake?.headers?.authorization
        ? client.handshake.headers.authorization.replace('Bearer ', '')
        : undefined;

      const token = queryToken || authToken || headerToken;
      if (!token) throw new UnauthorizedException('Token missing');

      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET || 'supersecretkey',
        });
        (client as any).user = payload;
        return true;
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        }
        throw new UnauthorizedException('Invalid token');
      }
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
