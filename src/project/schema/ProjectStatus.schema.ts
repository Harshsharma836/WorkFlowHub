import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Employee } from 'src/employee/schema/employee.schema';
import { Project } from './project.schema';

enum StatusEnum {
  Done = 'done',
  Undone = 'undone',
}

@Schema()
export class ProjectStatus {

  @Prop()
  name: string;

  @Prop({ default: Date })
  date: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId: Project;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Employee' })
  employeeId: Employee;

  @Prop()
  description: string;

  @Prop({ default: StatusEnum.Undone, enum: StatusEnum })
  status: string;
}
export const ProjectStatusSchema = SchemaFactory.createForClass(ProjectStatus);
