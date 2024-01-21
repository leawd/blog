import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';
import { Post } from 'src/posts/schemas/posts.schema';

@ApiTags('admin')
@Controller('admin')
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({
    summary:
      'Obtener listado de todos los usuarios. Solo los usuarios ADMIN pueden acceder. NOTA: A pedido de la documentación hace lo mismo que la ruta "/users"',
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete('/user/:id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Eliminar un usuario. Solo para usuarios ADMIN. NOTA: A pedido de la documentación hace lo mismo que la ruta delete de users', })
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }

}
