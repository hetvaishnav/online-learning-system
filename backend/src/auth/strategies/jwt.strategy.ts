import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // ...
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'), // Add this line
      ]),
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
    });
    // ...

  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email, role: payload.role }; // ✅ Attach user data to request
  }
}
