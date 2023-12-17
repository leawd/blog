import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
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
      console.error('Usuario no encontrado');
      return null;
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    if (!token) {
      console.error('Error al generar el token');
      return null;
    }

    return token;
  }

  // OCULTA PASSWORD DE LOS DATOS DEL USER A DEVOLVER -----
  sanitizeUser(user: any): any {
    if (user instanceof this.usersService.userModel) {
      // Si es un documento Mongoose, conviértelo a un objeto simple
      user = user.toObject();
    }
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
