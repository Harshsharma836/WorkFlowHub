import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './schema/employee.schema';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { OTP } from './schema/otp.schema';
import * as bcrypt from 'bcrypt';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/company/schema/company.schema';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly emailService: EmailService,
  ) {}

  async getEmployee(query: object): Promise<Employee> {
    return await this.employeeModel.findOne(query);
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  // send leave mail to company
  async sendLeaveMail(employee , subject , text){
    let employeeData = await this.employeeModel.findById(employee.employeeid);
    let comapnyDetails = await this.companyModel.findById(employeeData.companyId)
    let comanyEmail =  comapnyDetails.companyemail;
    let ans = await this.emailService.sendEmail( comanyEmail , subject, text);
    return {
      res : ans
    }
  }

  // For OTP :
  // 1. First, send the otp
  // 2. Second, send new password with otp that recieve on mail
  async generateOtpAndSendEmail(email: string) {
    const employee = await this.employeeModel.findOne({ email });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Generate OTP and save it in the OTP collection
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date(Date.now() + 600000); // Set expiration time to 10 minutes from now

    await this.otpModel.create({
      employeeId: employee._id,
      otp,
      expirationTime,
    });

    // Send OTP to the employee's email using the EmailService
    const subject = 'OTP for Password Reset';
    const text = `OTP for Password reset is ${otp} , valid for 10 minutes`;
    try {
      await this.emailService.sendEmail(employee.email, subject, text);
      return `OTP send successfully`;
    } catch (err) {
      return err;
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    if (!email || !otp || !newPassword) {
      return `Please Provide the email,otp and password`;
    }
    const employee = await this.employeeModel.findOne({ email });

    if (!employee) {
      throw new Error('Invalid email');
    }

    // Check if the provided OTP is valid
    const existingOTP = await this.otpModel.findOne({
      employeeId: employee._id,
      otp,
      expirationTime: { $gte: new Date() }, // expirationTime field is greater than or equal to the current date and time. This ensures that the OTP has not expired.
    });

    if (!existingOTP) {
      return `Invalid or expired OTP`;
    }

    // Update the password and clear the OTP
    const salt = 5;
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    employee.password = hashedPassword;
    await employee.save();
    // Remove the used OTP
    await existingOTP.deleteOne();
    return `Passpord Updated successfully`;
  }
  //
}
