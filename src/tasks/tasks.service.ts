import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskFilterDTO } from './dto/filter-task.dto';
import { Task } from './dto/task.entity';
import { UpdateTaskDTO } from './dto/update-status.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks(taskFilterDTO: TaskFilterDTO): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    const { status, search } = taskFilterDTO;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        `LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)`,
        { search: `%${search}%` },
      );
    }

    const tasks = query.getMany();
    return tasks;
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
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

  // getFilterTask(taskFilterDTO: TaskFilterDTO) {
  //   const { search, status } = taskFilterDTO;
  //   let tasks = this.getAllTasks();
  //   if (status) tasks = this.tasks.filter((task) => task.status === status);
  //   if (search)
  //     tasks = this.tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search))
  //         return true;
  //       else return false;
  //     });
  //   return tasks;
  // }
}
