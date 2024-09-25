import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../user.entity';

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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must include uppercase, lowercase, number, and special character',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
