import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskFilterDTO } from './dto/filter-task.dto';
import { Task } from './task.entity';
import { UpdateTaskDTO } from './dto/update-status.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get()
  getTasks(@Query() taskFilterDTO: TaskFilterDTO): Promise<Task[]> {
    return this.tasksService.getTasks(taskFilterDTO);
  }

  @Post('create')
  create(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, updateTaskDTO);
  }
}
