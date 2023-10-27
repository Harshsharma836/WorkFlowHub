import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Employee } from 'src/employee/schema/employee.schema';
import { Project } from './project.schema';

@Schema()
export class ProjectUpdate {
  @Prop({ required: true, unique: true })
  uniqueid: string;

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

  @Prop({ default: 'undone' })
  status: string;
}
export const ProjectUpdateSchema = SchemaFactory.createForClass(ProjectUpdate);
