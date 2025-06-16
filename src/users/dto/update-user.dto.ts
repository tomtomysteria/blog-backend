import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional() // Spécifiquement pour rendre le mot de passe optionnel lors de la mise à jour
  @IsString()
  password?: string;
}
