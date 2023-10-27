import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// export class LocalAuthGuardCompany extends AuthGuard('company') {
export class JwtAuthGuardCompany extends AuthGuard('companyjwt') {
  constructor() {
    super({
      property: 'company',
    });
  }
}

@Injectable()
export class JwtAuthGuardEmployee extends AuthGuard('employeejwt') {
  constructor() {
    super({
      property: 'employee',
    });
  }
}
