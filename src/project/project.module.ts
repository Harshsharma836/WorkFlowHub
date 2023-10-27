import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from 'src/employee/schema/employee.schema';
import { Project, ProjectSchema } from './schema/project.schema';
import {
  ProjectUpdate,
  ProjectUpdateSchema,
} from './schema/projectUpdate.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectUpdate.name, schema: ProjectUpdateSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
