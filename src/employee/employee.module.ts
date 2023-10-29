import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schema/employee.schema';
import { OTP, OTPSchema } from './schema/otp.schema';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: OTP.name, schema: OTPSchema },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmailService],
})
export class EmployeeModule {}
