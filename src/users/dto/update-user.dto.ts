import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateUserDto{
    @IsNotEmpty()
    @IsString()
    @Length(5, 10)
    @ApiProperty({ description: 'Nombre de usuario (entre 5 y 10 caracteres)' })
    username?: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: 'Correo electrónico del usuario' })
    email?: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    @ApiProperty({ description: 'Contraseña del usuario (entre 8 y 20 caracteres)' })
    password?: string;
}
