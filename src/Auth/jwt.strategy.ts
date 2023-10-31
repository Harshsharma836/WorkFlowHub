import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategyCompany extends PassportStrategy(
  Strategy,
  'companyjwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.COMPANY_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return { companyId: payload.companyid, companyEmail: payload.companyemail };
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
      secretOrKey: process.env.EMPLOYEE_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return { employeeid: payload.employeeid, email: payload.email };
  }
}
