import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Employee } from 'src/employee/schema/employee.schema';

enum StatusEnum {
    Complete = 'done',
    UnComplete = 'undone',
}

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Employee' })
  employeeId: Employee;

  @Prop({ required: true })
  description: string;

  @Prop({ default: StatusEnum.UnComplete, enum: StatusEnum })
  status: string;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
