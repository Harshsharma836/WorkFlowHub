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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Project' })
  projectId: Project;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Employee' })
  employeeId: Employee;

  @Prop()
  update: string;

  @Prop({ default: StatusEnum.Undone, enum: StatusEnum })
  status: string;

  @Prop({ default: new Date().toISOString().split('T')[0] }) // Default to the current date in "YYYY-MM-DD" format
  timestamp: string;
}
export const ProjectStatusSchema = SchemaFactory.createForClass(ProjectStatus);
