import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}