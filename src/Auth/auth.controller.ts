import {
  Controller,
  UseGuards,
  Request,
  Post,
  Req,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LocalAuthGuardCompany,
  LocalAuthGuardEmployee,
} from './local.auth.guard';
import { JwtAuthGuardCompany, JwtAuthGuardEmployee } from './jwt.auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  // For Company :

  @UseGuards(LocalAuthGuardCompany)
  @Post('loginCom')
  async loginCompany(@Request() req) {
    return this.authService.loginCompany(req.company, 'company'); // giving the role
  }

  @UseGuards(JwtAuthGuardCompany)
  @Post('specialCompany')
  async specialCompany(@Req() req) {
    console.log(req.company);
    return 'Hold';
  }

  // For Employee

  @UseGuards(LocalAuthGuardEmployee)
  @Post('loginEmp')
  async loginEmployee(@Request() req) {
    await this.cacheService.set('employee', req.employee); // 3 params key ,val,ttl
    return this.authService.loginEmployee(req.employee, 'employee'); // giving the role
  }

  @UseGuards(JwtAuthGuardEmployee)
  @Post('specialEmployee')
  async specialEmployee(@Req() req) {
    console.log(req.employee);
    return 'Hold';
  }
}
