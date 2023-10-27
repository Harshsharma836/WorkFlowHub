import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategyCompany extends PassportStrategy(
  Strategy,
  'companyjwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TOP',
    });
  }

  async validate(payload: any) {
    return { companyId: payload.companyid, companyName: payload.companyname };
  }
}

@Injectable()
export class JwtStrategyEmployee extends PassportStrategy(
  Strategy,
  'employeejwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TOP',
    });
  }

  async validate(payload: any) {
    console.log('//////////////');
    console.log(payload);
    if (!payload.employeeid || !payload.email) {
      throw new UnauthorizedException();
    }
    return { employeeid: payload.employeeid, email: payload.email };
  }
}
