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
import { EmailService } from 'src/email/email.service';
import { FcmNotificationService } from 'src/fcm-notification/fcm-notification.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectStatus.name, schema: ProjectStatusSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, EmailService, FcmNotificationService],
})
export class ProjectModule {}
