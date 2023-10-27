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

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ProjectStatus.name)
    private projectStatusModel: Model<ProjectStatus>,
  ) {}

  async create(createProjectDto: CreateProjectDto, employee) {
    // Creating a Project Collection
    createProjectDto.employeeId = employee.employeeid;
    let project = await this.projectModel.create(createProjectDto);

    // Updating the Employee Collection
    const employeeUpdate = await this.employeeModel.findOneAndUpdate(
      { _id: employee.employeeid },
      { $push: { projects: project._id } },
      { new: true },
    );

    return project;
  }

  async findAll(employee) {
    let employeeId = employee.employeeid;
    return await this.projectStatusModel.find({ employeeId });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(projectId: string, updateProjectDto: UpdateProjectDto) {

    const projectUpdate = await this.projectStatusModel.findOneAndUpdate(
      { projectId: projectId },
      {
        description: updateProjectDto.description,
        status: updateProjectDto.status,
      },
      { new: true },
    );
    return projectUpdate
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  // Cron Implementing

  // Run Only once at 12 AM Everyday
  //@Cron('0 0 * * *')

  // run only at once 1t 19:01
  //@Cron('7 19 * * * ')
  async sendDatatoUpdateProject() {
      const projects = await this.projectModel.find({});
      
      // Create  a ref add ref 
      // give emeployee ref id for this
      for (const val of projects) {
        console.log(val);
        const updateProject = await this.projectStatusModel.create({val });
        // Process the updateProject or handle errors as needed
      }

    // Iterate through the projects and create ProjectStatus documents
    // const projectStatusDocuments = projects.map(project => {
    //   return new ProjectStatus({
    //     // name: project.name, 
    //     // projectId: project._id, 
    //   });
    // });
    

    // let updateProject = await this.projectStatusModel.create({
    //   name: createProjectDto.name,
    //   uniqueid: uniqueIdandDate, // for unique per day
    //   description: '',
    //   projectId: project._id,
    //   employeeId: employee.employeeid,
    // });
  }
    


  // Check and fetch Data for Multiple Users , pending updates
  //@Cron('* * 19 * * *') // Run Cron EveryDay at 7 pm
  async checkUpdateDaily() {
    let ProjectUpdateDetails = await this.projectStatusModel.find({
      status: 'undone',
    });
    console.log(ProjectUpdateDetails);
  }
}
