import { Gender, UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
  @IsNotEmpty()
  @IsString()
  departmentId: string;
  @IsEnum(UserType)
  userType: UserType;
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
}