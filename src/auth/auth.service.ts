// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/interfaces/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      // Elimina la contraseña antes de devolver el usuario -----
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    return this.usersService.findOne(userId);
  }

  async generateJwtToken(userEmail: string): Promise<string | null> {
    const user = await this.usersService.findByEmail(userEmail);

    if (!user) {
      return null;
    }

    const payload = { sub: user.id, username: user.username }; // Puedes personalizar el contenido del token según tus necesidades
    return this.jwtService.sign(payload);
  }
}
