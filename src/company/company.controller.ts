import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';

import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuardCompany } from 'src/Auth/jwt.auth.guard';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // @UseGuards(JwtAuthGuardCompany)
  @Post('/signup')
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const { companyname, registryNo, password } = createCompanyDto;
    if (
      companyname === undefined ||
      registryNo === undefined ||
      password === undefined
    ) {
      return 'Please Enter Companyname and Password';
    }
    const salt = 10;
    const company = await this.companyService.getCompany({ companyname });
    if (company) return 'Company Already Exists';
    const hashedPassword = await bcrypt.hash(password, salt);
    createCompanyDto.password = hashedPassword;
    const result = await this.companyService.createCompany(createCompanyDto);
    return result;
  }

  @UseGuards(JwtAuthGuardCompany)
  @Post('/employee')
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Req() req,
  ) {
    const salt = 5;
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, salt);
    createEmployeeDto.password = hashedPassword;
    return await this.companyService.createEmployee(
      createEmployeeDto,
      req.company,
    );
  }

  @UseGuards(JwtAuthGuardCompany)
  @Get('/employees')
  getEmployee(@Req() req) {
    return this.companyService.getEmployee(req.company.companyId);
  }
}
