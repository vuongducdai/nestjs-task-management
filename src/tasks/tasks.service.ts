import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskFilterDTO } from './dto/filter-task.dto';
import { UpdateTaskDTO } from './dto/update-status.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  async getTasks(taskFilterDTO: TaskFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(taskFilterDTO, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ user, id: id });

    if (!found) throw new NotFoundException();
    else return found;
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const { affected } = await this.taskRepository.delete({ id, user });
    if (!affected) throw new NotFoundException(`Task ${id} not found`);
  }

  async updateStatus(
    id: string,
    updateTaskDTO: UpdateTaskDTO,
    user: User,
  ): Promise<Task> {
    const { status } = updateTaskDTO;
    const targetTask = await this.getTaskById(id, user);
    targetTask.status = status;
    await this.taskRepository.save(targetTask);
    return targetTask;
  }
}
