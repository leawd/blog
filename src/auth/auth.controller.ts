// auth.controller.ts
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    const { user } = req;
    const token = this.authService.generateJwtToken(user.email);
    return !token
      ? { message: 'Error al generar el token' }
      : { user, access_token: token };
  }
}
