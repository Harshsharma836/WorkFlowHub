import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class AuthService {
  constructor(
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
  ) {}

  // For Company

  async validateCompany(companyname: string, password: string) {
    if (companyname === undefined || password === undefined) {
      return 'Enter all Details';
    }
    const company = await this.companyService.getCompany({ companyname });
    if (!company) return null;
    const passwordValid = await bcrypt.compare(password, company.password);
    if (passwordValid === false) return null;
    if (!company) {
      throw new UnauthorizedException('Could not find company');
    }
    if (company && password) {
      return company;
    }
    return null;
  }

  async loginCompany(company) {
    const payload = {
      companyname: company.companyname,
      companyid: company._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // For Employee

  async validateEmployee(email: string, password: string) {
    if (email === undefined || password === undefined) {
      return 'Enter all Details';
    }
    console.log(email);
    console.log(password);
    const employee = await this.employeeService.getEmployee({ email });
    if (!employee) return null;
    console.log('Password ' + employee.password);
    const passwordValid = await bcrypt.compare(password, employee.password);
    if (passwordValid === false) {
      console.log('Invalid Passowrd');
      return null;
    }
    if (!employee) {
      throw new UnauthorizedException('Could not find employee');
    }
    if (employee && password) {
      return employee;
    }
    return null;
  }

  async loginEmployee(employee) {
    const payload = {
      email: employee.email,
      employeeid: employee._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
