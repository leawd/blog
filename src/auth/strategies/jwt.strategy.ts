// jwt.strategy.ts
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log('ggggggggggg');
  }

  async validate(payload: any) {
    
    console.log('llllllllllllll');
    const user = await this.authService.validateUserById(payload.sub);
    console.log('xxxxxxxxxxxxxx');
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
