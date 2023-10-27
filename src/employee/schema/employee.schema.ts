import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Company } from 'src/company/schema/company.schema';
import { Project } from 'src/project/schema/project.schema';

@Schema()
export class Employee {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 0 })
  designation: string;

  @Prop()
  companyName: string;

  @Prop({ default: Date })
  createdAt: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Company' })
  companyId: Company;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Project' }] })
  projects: Project;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
