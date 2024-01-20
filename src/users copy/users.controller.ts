import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { SanitizedUser } from './interfaces/sanitizedUser';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto, description: 'Datos del usuario a crear' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({
    summary:
      'Obtener listado de todos los usuarios. Solo los usuarios ADMIN pueden acceder.',
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({
    summary:
      'Obtener listado de todos los usuarios. Solo los usuarios ADMIN pueden acceder. NOTA: A pedido de la documentación hace lo mismo que la ruta "/users"',
  })
  adminFindAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su identificador' })
  findOne(@Param('id') id: string): Promise<User> | null {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({
    summary:
      'Editar un usuario por su identificador. Solo para usuarios ADMIN o el propio usuario que edita sus datos',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<SanitizedUser> | null {
    const user = req.user;

    // Verificar si el usuario es un administrador o el creador del post
    const isAdmin = user.roles.includes('ADMIN');
    const isUser = id === user.id;

    if (!isAdmin && !isUser) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }

    const updated = await this.usersService.update(id, updateUserDto);
    console.log('updated >>>>>>>>>>>> ', updated);
    return updated;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Eliminar un usuario. Solo para usuarios ADMIN.' })
  remove(@Param('id') id: string): Promise<User> | null {
    return this.usersService.remove(id);
  }
  @Delete('admin/users/:id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({
    summary:
      'Eliminar un usuario. Solo para usuarios ADMIN. NOTA: A pedido de la documentación hace lo mismo que la ruta delete de users',
  })
  adminUserRemove(@Param('id') id: string): Promise<User> | null {
    return this.usersService.remove(id);
  }
}
