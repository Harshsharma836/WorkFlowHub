import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuardEmployee } from 'src/Auth/jwt.auth.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Create Employee
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }

  // otp

  @UseGuards(JwtAuthGuardEmployee)
  @Post('generate-otp')
  async generateOtpAndSendEmail(@Req() req): Promise<{ message: string }> {
    const email = req.employee.email;
    if (!email) {
      return { message: 'Please provide email' };
    }
    await this.employeeService.generateOtpAndSendEmail(email);
    return { message: 'OTP sent successfully. Check your email.' };
  }

  @UseGuards(JwtAuthGuardEmployee)
  @Post('reset-password')
  async resetPassword(
    @Body('otp') otp: string,
    @Body('newPassword') newPassword: string,
    @Req() req,
  ) {
    const email = req.employee.email;
    const a = await this.employeeService.resetPassword(email, otp, newPassword);
    return a;
    //return { message: 'Password reset successfully.' };
  }
}
