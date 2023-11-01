import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schema/employee.schema';
import { OTP, OTPSchema } from './schema/otp.schema';
import { EmailService } from 'src/email/email.service';
import { CompanyService } from 'src/company/company.service';
import { Company, CompanySchema } from 'src/company/schema/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: OTP.name, schema: OTPSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmailService],
})
export class EmployeeModule {}
