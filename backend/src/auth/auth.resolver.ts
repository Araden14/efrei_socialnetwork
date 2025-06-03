import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Resolver, Mutation, Args, InputType, Field, ObjectType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/create-user.input';

@InputType()
export class LoginInput {
  @Field()
  email: string;
  
  @Field()
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  access_token: string;
}

@Resolver()
@Injectable()
export class AuthResolver {
  constructor(
    private authService: AuthService,
  ) {}

  @Mutation(() => AuthPayload)
  async register(
    @Args('data') data: CreateUserInput,
  ): Promise<AuthPayload> {
    return this.authService.register(data);
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('data') data: LoginInput,
  ): Promise<AuthPayload | null> {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) return null;
    return this.authService.login(user);
  }
}