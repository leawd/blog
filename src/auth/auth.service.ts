import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SanitizedUser } from 'src/users/interfaces/sanitizedUser';
import { User } from 'src/users/interfaces/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      console.log(user);
      if (user && bcrypt.compareSync(password, user.password)) {
        // Elimina la contraseña antes de devolver el usuario -----
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    return this.usersService.findOne(userId);
  }

  async generateJwtToken(userEmail: string): Promise<string> {
    try {
      const user = await this.usersService.findByEmail(userEmail);

      if (!user) throw new Error('Usuario no encontrado');

      const payload = { sub: user._id, username: user.username };
      const token = this.jwtService.sign(payload);

      if (!token) throw new Error('Error al generar el token');

      return token;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // OCULTA PASSWORD DE LOS DATOS DEL USER A DEVOLVER -----
  sanitizeUser(user): SanitizedUser {
    if (user instanceof this.usersService.userModel) {
      // Si es un documento Mongoose, conviértelo a un objeto simple
      user = user.toObject();
    }
    const { password, ...sanitizedUser } = user._doc;
    return sanitizedUser;
  }
}
