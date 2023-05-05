import { UserType } from "@prisma/client";
import { CurrentUserDto } from "src/users/dto/current-user.dto";

export class AuthUser {
  id!: string;
  name!: string;
  userType!: UserType;
  message?: string;
  token?: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  user?: CurrentUserDto
}