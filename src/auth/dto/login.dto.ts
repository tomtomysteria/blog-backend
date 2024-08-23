import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // Peut être soit le username, soit l'email

  @IsString()
  @IsNotEmpty()
  password: string;
}
