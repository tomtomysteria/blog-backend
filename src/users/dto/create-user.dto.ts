import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsIn,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string; // Date de naissance, facultative

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsIn(['blogger', 'admin', 'super-admin'])
  role: 'blogger' | 'admin' | 'super-admin';
}
