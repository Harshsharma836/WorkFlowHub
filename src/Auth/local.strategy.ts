import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'company') {
  constructor(private authService: AuthService) {
    // // for taking the input as companyname because passport bydefault take it as username
    super({ usernameField: 'companyname' });
  }

  async validate(companyname: string, password: string): Promise<any> {
    if (companyname === undefined || password === undefined) {
      return 'Enter all Details';
    }
    const company = await this.authService.validateCompany(
      companyname,
      password,
    );
    if (!company) {
      throw new UnauthorizedException();
    }
    return company;
  }
}

@Injectable()
export class LocalStrategyEmployee extends PassportStrategy(
  Strategy,
  'employee',
) {
  constructor(private authService: AuthService) {
    // // for taking the input as companyname because passport bydefault take it as username
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    if (email === undefined || password === undefined) {
      return 'Enter all Details';
    }
    const employee = await this.authService.validateEmployee(email, password);
    console.log(employee);
    if (!employee) {
      throw new UnauthorizedException();
    }
    return employee;
  }
}
