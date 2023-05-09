import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {AuthUser} from 'src/models/user-info.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,      
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: AuthUser) {
    return { 
        id: payload.id, 
        name: payload.name,
        userType: payload.userType,
     };
  }
}