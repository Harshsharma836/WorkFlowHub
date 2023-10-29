// email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Replace 'your-email@gmail.com' and 'your-email-password' with your email credentials
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });
  }

  async sendOTPEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: process.env.user,
      to,
      subject,
      text,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendReminder(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: process.env.user,
      to,
      subject,
      text,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
