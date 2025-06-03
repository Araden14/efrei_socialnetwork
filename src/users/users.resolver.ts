// src/users/users.resolver.ts

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput) {
    return this.usersService.createUser(data);
  }
}
