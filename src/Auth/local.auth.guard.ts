import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuardCompany extends AuthGuard('company') {
  constructor() {
    super({
      property: 'company',
    });
  }
}

@Injectable()
export class LocalAuthGuardEmployee extends AuthGuard('employee') {
  constructor() {
    super({
      property: 'employee',
    });
  }
}
