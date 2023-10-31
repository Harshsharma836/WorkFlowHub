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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuardEmployee } from 'src/Auth/jwt.auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Add Projects
  @UseGuards(JwtAuthGuardEmployee)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.create(createProjectDto, req.employee);
  }

  // Implementing Pagination.
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
}
