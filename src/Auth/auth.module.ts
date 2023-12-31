import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { CompanyService } from 'src/company/company.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/company/schema/company.schema';
import { LocalStrategy, LocalStrategyEmployee } from './local.strategy';
import { JwtStrategyCompany, JwtStrategyEmployee } from './jwt.strategy';
import { Employee, EmployeeSchema } from 'src/employee/schema/employee.schema';
import { EmployeeService } from 'src/employee/employee.service';
import { JwtAuthGuardCompany, JwtAuthGuardEmployee } from './jwt.auth.guard';
import { OTP, OTPSchema } from 'src/employee/schema/otp.schema';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    CompanyModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.COMPANY_SECRET_KEY, // Default key for company tokens
      signOptions: { expiresIn: '12h' },
    }),
    JwtModule.register({
      secret: process.env.EMPLOYEE_SECRET_KEY, // Default key for employee tokens
      signOptions: { expiresIn: '12h' },
    }),
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: OTP.name, schema: OTPSchema },
    ]),
  ],

  providers: [
    AuthService,
    LocalStrategyEmployee,
    JwtAuthGuardCompany,
    JwtAuthGuardEmployee,
    LocalStrategy,
    CompanyService,
    EmployeeService,
    JwtStrategyCompany,
    JwtStrategyEmployee,
    EmailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
