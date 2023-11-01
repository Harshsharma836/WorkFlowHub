import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Inject,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuardEmployee } from 'src/Auth/jwt.auth.guard';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('project')
export class ProjectController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly projectService: ProjectService,
  ) {}

  // Add Projects
  @UseGuards(JwtAuthGuardEmployee)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.create(createProjectDto, req.employee);
  }

  // Get All Project based on employee login , also it has Pagination.
  @UseGuards(JwtAuthGuardEmployee)
  @Get('getprojects')
  getProject(@Query() { limit, skip }, @Req() req) {
    return this.projectService.getProjects(req.employee, skip, limit); //
  }

  // Updating the project (status)
  @UseGuards(JwtAuthGuardEmployee)
  @Get('updates')
  findAll(@Req() req) {
    return this.projectService.findAll(req.employee);
  }

  // Update By Project Id
  @Patch(':id')
  updateProjectStatus(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProjectStatus(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

  // Testing

  @Post('cron')
  check() {
    return this.projectService.createProjectStatus();
  }

  @Post('croncheck')
  checks() {
    return this.projectService.checkProjectStatusUpdates();
  }

  // Storing Data and Getting Cache Data from Redis Db.
  @Get('/:projectId')
  async getContact(@Res() res, @Param('projectId') projectId) {
    const cachedData = await this.cacheService.get(projectId.toString());
    if (cachedData) {
      console.log('Getting data from cache');
      return res.status(HttpStatus.OK).json(cachedData);
    }
    const project = await this.projectService.getProjectById(projectId);
    if (!project) throw new NotFoundException('Project does not exist');

    // await this.cacheService.set(projectId.toString(), project );
    await this.cacheService.set(projectId.toString(), project, 10000); // 3 params key ,val,ttl
    const newCachedData = await this.cacheService.get(projectId.toString());
    console.log('data set to cache', newCachedData);
    return res.status(HttpStatus.OK).json(project);
  }
}
