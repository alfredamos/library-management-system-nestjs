import { UserType, Department } from '@prisma/client';

export class CurrentUserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  department?: Department;
  departmentId?: string;
  userType?: UserType;
}
