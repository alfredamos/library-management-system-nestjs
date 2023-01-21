import { UserType } from "@prisma/client";

export class User{
    name: string;
    email: string;
    phone: string;
    userType: UserType;
}