import {
  BadRequestException,
  Body,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, MongooseError, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { EmailValidationService } from 'src/helper.service';
import { SanitizedUser } from './interfaces/sanitizedUser';
import { MongoError, ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) public userModel: Model<User>,
    private readonly emailValidationService: EmailValidationService,
  ) {}

  /**
   * Guarda registro de usuario en base de datos
   *
   * @param createUserDto
   * @returns Promise<User>
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // INI VALIDACIONES -----
    // username -----
    if (
      !createUserDto.username ||
      createUserDto.username.length < 5 ||
      createUserDto.username.length > 10
    ) {
      throw new HttpException(
        'El nombre de usuario es obligatorio y debe tener entre 5 y 10 caracteres',
        HttpStatus.BAD_REQUEST,
      );
    }

    // email -----
    if (
      !createUserDto.email ||
      !this.emailValidationService.validateEmail(createUserDto.email)
    ) {
      throw new HttpException(
        'El formato del correo electrónico no es válido',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'Ya existe un usuario con este correo electrónico',
        HttpStatus.CONFLICT,
      );
    }

    // contraseña -----
    if (createUserDto.password.length < 8 || createUserDto.password.length > 20)
      throw new HttpException(
        'La contraseña debe tener entre 8 y 20 caracteres',
        HttpStatus.BAD_REQUEST,
      );
    // FIN VALIDACIONES -----

    // GUARDAR CONTRASEÑA CON HASH -----
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const newUser = new this.userModel(createdUser);
    try {
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error al guardar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @returns
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findOne(id: string): Promise<User> | null {
    try {
      const objectId = new ObjectId(id);
      return await this.userModel.findOne({ _id: objectId }).lean();
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      return null;
    }
  }

  findByEmail(email: string): Promise<User> | null {
    return this.userModel.findOne({ email: email });
  }

  private isValidRoles(roles: string[]): boolean {
    const allowedRoles = ['USER', 'ADMIN'];
    return roles.every((role) => allowedRoles.includes(role));
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SanitizedUser> | null {
    try {
      let user = await this.findOne(id);
      
      if (!user ) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // contraseña -----
      if (updateUserDto.password) {
        if (
          updateUserDto.password.length < 8 ||
          updateUserDto.password.length > 20
        ) {
          throw new HttpException(
            'La contraseña debe tener entre 8 y 20 caracteres',
            HttpStatus.BAD_REQUEST,
          );
        }

        // GUARDAR CONTRASEÑA CON HASH -----
        const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
        user.password = hashedPassword;
      }

      // roles -----
      if (updateUserDto.roles) {
        if (!this.isValidRoles(updateUserDto.roles)) {
          throw new BadRequestException('Roles no válidos');
        }
        user.roles = updateUserDto.roles;
      }

      // username -----
      if (updateUserDto.username) {
        user.username = updateUserDto.username;
      }

      // email -----
      if (updateUserDto.email) {
        user.email = updateUserDto.email;
      }

      // Actualizar el usuario usando updateOne -----
      const objectId = new ObjectId(id);
      let updatedUser = await this.userModel.findOneAndUpdate(
        { _id: objectId },
        { $set: updateUserDto },
        { new: true, lean: true },
      );

      if (updatedUser) {
        const { password, ...sanitizedUser } = updatedUser;
        return sanitizedUser;
      } else {
        throw new HttpException(
          'Error al actualizar el usuario: el documento no se actualizó',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw new HttpException(
        'Error al actualizar el usuario: consulte los registros para obtener más información',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<User> | null {
    return this.userModel.deleteOne({ _id: id }).lean();
  }
}
