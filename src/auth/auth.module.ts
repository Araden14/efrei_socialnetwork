// auth.module.ts
import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthResolver } from "./auth.resolver";


@Module({
    imports: [UsersModule, PassportModule, JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    })],
    providers: [AuthService, JwtStrategy, AuthResolver],
    exports: [AuthService],
  })
  export class AuthModule {}