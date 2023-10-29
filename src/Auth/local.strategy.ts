import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'company') {
  constructor(private authService: AuthService) {
    // Taking the input as companyemail because passport bydefault take it as username
    super({ usernameField: 'companyemail' });
  }

  async validate(companyemail: string, password: string): Promise<any> {
    if (companyemail === undefined || password === undefined) {
      return 'Enter all Details';
    }
    const company = await this.authService.validateCompany(
      companyemail,
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
    // For taking the input as email because passport by default take it as username
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
