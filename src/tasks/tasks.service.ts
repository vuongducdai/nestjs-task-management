import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskFilterDTO } from './dto/filter-task.dto';
import { UpdateTaskDTO } from './dto/update-status.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: TasksRepository,
  ) {}

  async getTasks(taskFilterDTO: TaskFilterDTO): Promise<Task[]> {
    return this.taskRepository.getTasks(taskFilterDTO);
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id: id });

    if (!found) throw new NotFoundException();
    else return found;
  }

  async deleteTask(id: string): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);
    if (!affected) throw new NotFoundException(`Task ${id} not found`);
  }

  async updateStatus(id: string, updateTaskDTO: UpdateTaskDTO): Promise<Task> {
    const { status } = updateTaskDTO;
    const targetTask = await this.getTaskById(id);
    targetTask.status = status;
    await this.taskRepository.save(targetTask);
    return targetTask;
  }
}
