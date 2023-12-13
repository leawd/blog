import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Length} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(5, 10)
    @ApiProperty({ description: 'Nombre de usuario (entre 5 y 10 caracteres)' })
    readonly username: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: 'Correo electrónico del usuario' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    @ApiProperty({ description: 'Contraseña del usuario (entre 8 y 20 caracteres)' })
    readonly password: string;
}
