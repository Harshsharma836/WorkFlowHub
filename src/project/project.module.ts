import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from 'src/employee/schema/employee.schema';
import { Project, ProjectSchema } from './schema/project.schema';
import {
  ProjectStatus,
  ProjectStatusSchema,
} from './schema/ProjectStatus.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectStatus.name, schema: ProjectStatusSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, EmailService],
})
export class ProjectModule {}
