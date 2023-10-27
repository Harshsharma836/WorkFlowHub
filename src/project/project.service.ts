import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from 'src/employee/schema/employee.schema';
import { Model } from 'mongoose';
import { Project } from './schema/project.schema';
import { ProjectUpdate } from './schema/projectUpdate.schema';
import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ProjectUpdate.name)
    private projectUpdateModel: Model<ProjectUpdate>,
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

    // Creating a Project Update Collection by default
    const dateNumber = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let uniqueIdandDate = project._id.toString().slice(0, 20) + dateNumber;

    let updateProject = await this.projectUpdateModel.create({
      name: createProjectDto.name,
      uniqueid: uniqueIdandDate, // for unique per day
      description: '',
      projectId: project._id,
      employeeId: employee.employeeid,
    });

    return project;
  }

  async findAll(employee) {
    return await this.employeeModel.find({});
    return `This action returns all project`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  // Cron Implementing 
  // Check and fetch Data for Multiple Users , pending updates

  //@Cron('* * 19 * * *') // Run Cron EveryDay at 7 pm
  @Cron('* * * * * *')  // Testing 
  async checkUpdateDaily() {
    let ProjectUpdateDetails = await this.projectUpdateModel.find({
        description : "",
        status : "undone"
    })

    console.log(ProjectUpdateDetails);
  }

  /*
    // Cron Job
  // Cron Run Every Second , 300000 : 5 minutes , 1000 : 1sec

  @Cron('45 * * * * *')
  async getPosts() {
    const date_obj = Date.now();
    const Postsdata = await this.postModel.findOne({
      scheduleDateAndTime: { $gt: date_obj - 300000, $lt: date_obj + 300000 },
      isActive: true,
    });
    if (Postsdata != null) {
      const result = await this.postModel.findOneAndUpdate(
        { email: Postsdata.email },
        { isActive: false },
        { new: true },
      );
      console.log('updated');
    }
  }
  */
}
