import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Employee } from 'src/employee/schema/employee.schema';

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Employee' })
  employeeId: Employee;

  @Prop({ required: true })
  description: string;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
