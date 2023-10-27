import { Controller, UseGuards, Request, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LocalAuthGuardCompany,
  LocalAuthGuardEmployee,
} from './local.auth.guard';
import { JwtAuthGuardCompany, JwtAuthGuardEmployee } from './jwt.auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // For Company :

  @UseGuards(LocalAuthGuardCompany)
  @Post('loginCom')
  async loginCompany(@Request() req) {
    console.log(req.company);
    return this.authService.loginCompany(req.company);
  }

  @UseGuards(JwtAuthGuardCompany)
  @Post('specialCompany')
  async specialCompany(@Req() req) {
    return 'Hold';
  }

  // For Employee

  @UseGuards(LocalAuthGuardEmployee)
  @Post('loginEmp')
  async loginEmployee(@Request() req) {
    console.log(req.employee);
    return this.authService.loginEmployee(req.employee);
  }

  @UseGuards(JwtAuthGuardEmployee)
  @Post('specialEmployee')
  async specialEmployee(@Req() req) {
    return 'Hold';
  }
}
