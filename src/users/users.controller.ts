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
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User>|null {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard, AdminAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req
  ): Promise<SanitizedUser>|null {
    // controlo que sea ADMIN o el usuario del perfil que se esté tratando de actualizar -----
    const user = await this.usersService.findOne(id);

    if (!user.roles.includes('ADMIN')) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User>|null {
    return this.usersService.remove(id);
  }
}
