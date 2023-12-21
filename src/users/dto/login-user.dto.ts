import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({description: "Email de usuario"})
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: "Contraseña de usuario"})
  readonly password: string;
}
