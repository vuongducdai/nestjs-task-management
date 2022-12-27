import { Query, Resolver } from '@nestjs/graphql';
import { Task } from './task.entity';

@Resolver()
export class TasksResolver {
  @Query(() => [Task], { name: 'task' })
  async tasks() {
    return [];
  }
}
