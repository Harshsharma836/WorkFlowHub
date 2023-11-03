import { Inject, Injectable } from '@nestjs/common';
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FcmNotificationService } from 'src/fcm-notification/fcm-notification.service';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ProjectStatus.name)
    private projectStatusModel: Model<ProjectStatus>,
    // for email service
    private readonly emailService: EmailService,
    // for notification
    private fcmNotificationService: FcmNotificationService,
    // for caching
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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

  async getProjectById(projectid) {
    const p = await this.projectModel.findById(projectid);
    return p;
  }

  async getProjects(employee, skip, limit) {
    const count = await this.projectModel
      .countDocuments({ employeeId: employee.employeeid })
      .exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const data = await this.projectModel.find().limit(limit).skip(skip).exec();
    return {
      data: data,
      page_total: page_total,
      status: 200,
    };
  }

  async findAll(employee) {
    const employeeId = employee.employeeid;
    return await this.projectStatusModel.find({ employeeId });
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
    return projectUpdate;
  }

  async remove(id: number) {
    const projectRemove = await this.projectModel.findOneAndDelete({ id });
    return `Project removed , Id is ${id}`;
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
    let map = new Map();
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

        // Employee hasn't provided an update for today, take action, send a notification and a mail.
        const subject = `Project Update Reminder ${projectStatus.name}`;
        const text = `Friendly Reminder: Project ${projectStatus.name} Update Due at 7 PM`;

        // This token is send by from the frontend , It is unique for very user.
        const token = ''; // It Comes from the FrontEnd.

        try {
          // It's for sending reminder mail to employees daily at 7pm.
          await this.emailService.sendEmail(employee.email, subject, text);

          // for sending notification to employees, require token from frontend.
          await this.fcmNotificationService.sendingNotificationOneUser(
            token,
            subject,
            text,
          );
        } catch (err) {
          // Log the error or handle it appropriately
          console.error(
            `Error sending email to ${employee.email}: ${err.message}`,
          );
        }
      }
    });

    // storing this in Redis Cache memory
    await Promise.all(emailPromises);
    return {
      status: 'success',
      message: 'Emails sent to employees with pending project statuses.',
    };
  }
  // testing redis db for cache
  async findProjectById() {}
}
