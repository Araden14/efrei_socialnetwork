import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Resolver, Mutation, Args, InputType, Field, ObjectType, Context, Query } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { User } from 'src/users/models/user.model';

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
    @Context() context: any,
  ): Promise<AuthPayload> {
    return this.authService.register(data, context.res);
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('data') data: LoginInput,
    @Context() context: any,
  ): Promise<AuthPayload | null> {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) return null;
    return this.authService.login(user, context.res);
  }

  @Query(() => User)
  async verifyToken(@Args('access_token') access_token: string): Promise<User> {
    const user = await this.authService.verifyToken(access_token);
    return user as User;
  }
}