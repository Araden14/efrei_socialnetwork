import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserInput: CreateUserInput) {
    try {
      const existingUser = await this.usersService.findByEmailWithPassword(createUserInput.email);
      if (existingUser) throw new BadRequestException('Email already in use');

      const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
      const user = await this.usersService.createUser({
        ...createUserInput,
        password: hashedPassword,
      });

      if (!user) throw new InternalServerErrorException('User registration failed');

      const payload = { username: user.email, sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Registration error');
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmailWithPassword(email);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Validation error');
    }
  }

  async login(user: any) {
    if (!user || !user.email || !user.id) {
      throw new BadRequestException('Invalid user data for login');
    }
    try {
      const payload = { username: user.email, sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch {
      throw new InternalServerErrorException('Login error');
    }
  }
}