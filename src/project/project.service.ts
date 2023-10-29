import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from 'src/employee/schema/employee.schema';
import { Model } from 'mongoose';
import { Project } from './schema/project.schema';
import { ProjectStatus } from './schema/ProjectStatus.schema';
import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ProjectStatus.name)
    private projectStatusModel: Model<ProjectStatus>,
    private readonly emailService: EmailService,
  ) {}

  async create(createProjectDto: CreateProjectDto, employee) {
    // Creating a Project Collection
    createProjectDto.employeeId = employee.employeeid;
    const project = await this.projectModel.create(createProjectDto);

    // Updating the Employee Collection
    const employeeUpdate = await this.employeeModel.findOneAndUpdate(
      { _id: employee.employeeid },
      { $push: { projects: project._id } },
      { new: true },
    );

    return project;
  }

  async findAll(employee) {
    const employeeId = employee.employeeid;
    return await this.projectStatusModel.find({ employeeId });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  // When an employee gives an update on a project (today-date) by default status goes to done.
  async updateProjectStatus(projectId: string, update: UpdateProjectDto) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const projectUpdate = await this.projectStatusModel.findOneAndUpdate(
      { projectId: projectId, timestamp: formattedDate },
      {
        update: update.update,
        status: 'done',
      },
      { new: true },
    );
    if (projectUpdate == null)
      return `No Project Avilable by this ID ${projectId}`;
    console.log(projectUpdate);
    return projectUpdate;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  // Cron Implementing

  // Run Only once at 12 AM Everyday
  @Cron('0 0 * * *')
  async createProjectStatus() {
    const projects = await this.projectModel.find({});
    for (const project of projects) {
      const { name, employeeId, _id: projectId } = project;
      const update = '';
      // Only Add Project on Project Status when its undone .
      if (project.status == 'undone')
        await this.projectStatusModel.create({
          name,
          projectId,
          employeeId,
          update,
        });
    }
    return `Projects status Created`;
  }

  // We check at 7 p.m. that the employee has given an update on the project by checking the (status), using projectId on project status collection.
  @Cron('0 19 * * *')
  async checkProjectStatusUpdates() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Fetching the Project which are not updated till 7 pm
    const projectStatuses = await this.projectStatusModel.find({
      timestamp: formattedDate,
      status: 'undone',
    });

    const emailPromises = projectStatuses.map(async (projectStatus) => {
      // Check if the timestamp is today
      if (projectStatus.timestamp === formattedDate) {
        const { employeeId } = projectStatus;
        const employee = await this.employeeModel.findOne(employeeId);
        console.log('called');
        // Employee hasn't provided an update for today, take action, send a notification and a mail.
        const subject = `Project Update Reminder ${projectStatus.name}`;
        const text = `Friendly Reminder: Project ${projectStatus.name} Update Due at 7 PM`;

        try {
          await this.emailService.sendReminder(employee.email, subject, text);
        } catch (err) {
          // Log the error or handle it appropriately
          console.error(
            `Error sending email to ${employee.email}: ${err.message}`,
          );
        }
      }
    });

    await Promise.all(emailPromises);

    return {
      status: 'success',
      message: 'Emails sent to employees with pending project statuses.',
    };
  }
}
