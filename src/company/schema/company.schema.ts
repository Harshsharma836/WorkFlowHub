import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { File } from 'src/file/Schema/file.schema';
import { SchemaTypes } from 'mongoose';
import { Employee } from 'src/employee/schema/employee.schema';

@Schema()
export class Company {
  @Prop()
  companyname: string;

  @Prop({ default: 0 })
  totalEmployees: number;

  @Prop()
  registryNo: number;

  @Prop()
  password: string;

  @Prop({ default: Date.now() })
  createdAt: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Employee' }] })
  employees: Employee[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
