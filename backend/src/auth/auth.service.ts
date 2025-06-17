  import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException, Res } from '@nestjs/common';
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

  async register(createUserInput: CreateUserInput, res: any) {
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
      const token = await this.jwtService.signAsync(payload); 
      if (res){
      res.cookie('access_token', token, {
        httpOnly: true, 
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      }
      return { access_token: token };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Registration error');
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      // get user from database
      const user = await this.usersService.findById(decoded.sub);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
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

  async login(user: any, res: any) {
    if (!user || !user.email || !user.id)
      throw new BadRequestException('Invalid user data for login');
    try {
      const payload = { username: user.email, sub: user.id };
      const token = await this.jwtService.signAsync(payload);
      if (res) {
        res.cookie('access_token', token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
      }
      return { access_token: token };
    } catch {
      throw new InternalServerErrorException('Login error');
    }
  }
}