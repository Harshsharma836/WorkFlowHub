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
  ParseIntPipe,
  Sse,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuardEmployee } from 'src/Auth/jwt.auth.guard';
import { Observable, fromEvent, interval, map } from 'rxjs';
import { Interval } from '@nestjs/schedule';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService,
  private readonly eventEmitter: EventEmitter2
    ) {}

  // Add Projects
  @UseGuards(JwtAuthGuardEmployee)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.create(createProjectDto, req.employee);
  }

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



// @OnEvent('rem')
// handleOrderCreatedEvent(data) {
//   console.log(data)
//   // handle and process "OrderCreatedEvent" event
// }

  // Send Server-send events
  @Sse()
  sseOrders() {
    console.log("callled")
    return fromEvent(this.eventEmitter, 'rem').pipe(
        map((employee) => {
          console.log("called")
            return {data : employee} as MessageEvent
        })
    )
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
