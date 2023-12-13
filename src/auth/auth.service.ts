// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      // Elimina la contraseña antes de devolver el usuario
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    return this.usersService.findOne(userId);
  }
}
