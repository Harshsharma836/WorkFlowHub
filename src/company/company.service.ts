import { Injectable } from '@nestjs/common';
import { Company } from './schema/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from 'src/employee/schema/employee.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}
  async createCompany(createCompanyDto) {
    const company = await this.companyModel.create(createCompanyDto);
    return company;
  }

  async getCompany(query: object): Promise<Company> {
    return await this.companyModel.findOne(query);
  }

  // Creating Employee

  async createEmployee(createEmployeeDto, companyInfo) {
    const { companyName, companyId } = companyInfo;
    const Alreadyemployee = await this.employeeModel.find({
      email: createEmployeeDto.email,
    });
    if (Alreadyemployee.length > 0) return `Employee Mail Already Exist`;
    const employee = await this.employeeModel.create({
      ...createEmployeeDto,
      companyName,
      companyId,
    });

    // Update Company Collections
    const companyUpdate = await this.companyModel.findOneAndUpdate(
      { _id: companyId },
      { $push: { employees: employee._id } },
      { new: true },
    );
    return employee;
  }

  async getEmployee(companyId) {
    let data = await this.companyModel
      .findById(companyId)
      .populate('employees')
      .exec();
    return data;
  }
}
