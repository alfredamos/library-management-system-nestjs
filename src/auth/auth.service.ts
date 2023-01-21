import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import {PrismaService} from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import {UserInfo} from 'src/models/user-info.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
    ){}

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<UserInfo> {
    const {email, oldPassword, newPassword, confirmPassword} = changePasswordDto;

    //----> Check the equality of newPassword and confirmPassword.
    const isEqual = newPassword.normalize() === confirmPassword.normalize();
    if(!isEqual){
      throw new BadRequestException("New password must be the same with confirm password");
    }

    //----> Check for the existence of email.
    const user = await this.prisma.user.findUnique({
      where: {email},
    });

    //----> Check for the existence of user.
    if(!user){
      throw new ForbiddenException("Invalid credentials");
    }

    //----> Check the validity of the password.
    const hashedPasswordInDataBase = user.password;
    const isValid = await bcrypt.compare(oldPassword, hashedPasswordInDataBase);
    if(!isValid){
      throw new ForbiddenException("Invalid credentials");
    }

    //----> Hash the new password;
    const hashPassword = await bcrypt.hash(newPassword, 12);

    //----> Store the new password in the database.
    const updatedUserCredentials = await this.prisma.user.update({
      where: {email},
      data: {...user, password: hashPassword}
    });

    //----> User information to be sent to client.
    const userInfo: UserInfo = {
      id: updatedUserCredentials.id,
      name: updatedUserCredentials.name,
      userType: updatedUserCredentials.userType,
      message: 'Password is changed successfully',

    }

    //----> Send the user info to client.
    return userInfo;
  }

  async editProfile(editProfileDto: EditProfileDto): Promise<UserInfo> {
    const { email, password } = editProfileDto;

    //----> Check the existence of email.
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    //----> Check the existence of user.
    if (!user) {
      throw new ForbiddenException('Invalid credentials.');
    }

    //----> Check the validity of password.
    const hashedPasswordInDatabase = user.password;
    const isValid = await bcrypt.compare(password, hashedPasswordInDatabase);
    if (!isValid) {
      throw new ForbiddenException('Invalid credentials.');
    }

    //----> Hash password.
    editProfileDto.password = hashedPasswordInDatabase;

    //----> Check the department foreign key.
    const departmentId = editProfileDto.departmentId;
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new BadRequestException(
        `Department with id = ${departmentId}, please provide the correct department`,
      );
    }

    //----> Store the updated profile in database.
    const updatedUserProfile = await this.prisma.user.update({
      where: { email },
      data: { ...editProfileDto, id: user.id },
    });

    //----> Make user information object to be sent to client.
    const userInfo: UserInfo = {
      id: updatedUserProfile.id,
      name: updatedUserProfile.name,
      userType: updatedUserProfile.userType,
      message: 'User profile updated successfully',
    };

    //----> Send the user information to client.
    return userInfo;
  }

  async login(loginDto: LoginDto): Promise<UserInfo> {
    const { email, password } = loginDto;

    //----> Check the existence of email.
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    //----> Check the existence of user.
    if (!user) {
      throw new ForbiddenException('Invalid credentials.');
    }

    //----> Check the validity of password.
    const hashedPasswordInDatabase = user.password;
    const isValid = await bcrypt.compare(password, hashedPasswordInDatabase);
    if (!isValid) {
      throw new ForbiddenException('Invalid credentials.');
    }

    //----> Make user information payload for Jwt..
    const userPayload: UserInfo = {
      id: user.id,
      name: user.name,
      userType: user.userType,      
    };

    //----> Get JWT token from JWT Service Provider.
    const token = await this.jwt.sign(userPayload);

    //----> Send the user information to client.
    return {
      ...userPayload,
      message: 'Login is successfully',
      token,
    };
  }

  async signup(signupDto: SignupDto): Promise<UserInfo> {
    const { email, password } = signupDto;

    //----> Check the existence of email.
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    //----> Check the existence of user.
    if (user) {
      throw new ForbiddenException('Email already in use');
    }

    //----> Hash the password.
    const hashPassword = await bcrypt.hash(password, 12);

    delete signupDto.confirmPassword; //----> Delete the temporary property not declare in prisma model.

    //----> Check the department foreign key.
    const departmentId = signupDto.departmentId;
    const department = await this.prisma.department.findUnique({
      where: {id: departmentId},
    })

    if(!department){
      throw new BadRequestException(`Department with id = ${departmentId}, please provide the correct department`);
    }

    //----> Store the new user in database.
    const newUser = await this.prisma.user.create({
      data: { ...signupDto, password: hashPassword },
    });

    //----> Make user information object to be sent to client.
    const userInfo: UserInfo = {
      id: newUser.id,
      name: newUser.name,
      userType: newUser.userType,
      message: 'Signup is successfully',
    };

    //----> Send the user information to client.
    return userInfo;
  }
}
