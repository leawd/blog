import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';

@UseGuards(JwtAuthGuard, AdminAuthGuard)
@ApiTags('admin')
@Controller('admin')
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  private isAdmin(req) {
    const user = req.user;

    // Verificar si el usuario es un administrador o el creador del post
    const isAdmin = user.roles.includes('ADMIN');

    if (!isAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }
    return true;
  }

  @Get('/users')
  @ApiOperation({
    summary:
      'Obtener listado de todos los usuarios. Solo los usuarios ADMIN pueden acceder. NOTA: A pedido de la documentación hace lo mismo que la ruta "/users"',
  })
  findAll(@Req() req): Promise<User[]> {
    this.isAdmin(req);
    return this.usersService.findAll();
  }

  @Delete('/user/:id')
  @ApiOperation({
    summary:
      'Eliminar un usuario. Solo para usuarios ADMIN. NOTA: A pedido de la documentación hace lo mismo que la ruta delete de users',
  })
  remove(@Param('id') id: string, @Req() req): Promise<User> {
    this.isAdmin(req);
    return this.usersService.remove(id);
  }
}
