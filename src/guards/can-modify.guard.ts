import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext, Param, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '../models/user-info.model';
import { PrismaService } from 'src/prisma/prisma.service';
import {UuidTool} from "uuid-tool";

@Injectable()
export class CanModifyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);

    //----> Public resources.
    if (isPublic) return true;

    //----> Get the authorization request object.
    const request = context.switchToHttp().getRequest();
    const { id } = request.params; //----> Get the library id request to modify.

    //----> Get the library request from database.
    const library = await this.prisma.library.findUnique({
      where: { id },
    });

    //----> Check for existence of library request.
    if (!library) {
      throw new NotFoundException('library request does not exist');
    }

    //----> get the user information
    const user = request.user as AuthUser;

    //----> Check for existence of user.
    if (!user) {
      throw new ForbiddenException('Invalid credentials.');
    }

    //----> Get the user id from user authorization payload.
    const userIdFromAuthPayload = user.id;

    //----> Get the user id from library request.
    const userIfFromLibraryRequest = library.userId;

    //----> Check for the equality of user id from library request and the one from auth payload.
    const isSameUser = UuidTool.compare(
      userIdFromAuthPayload,
      userIfFromLibraryRequest,
    );

    //----> Check if the user is an admin.
    //const isAdmin = user.userType === UserType.Admin;
    const isAdmin = user.isAdmin;

    //----> Only Admin or same user is allowed.
    const canModify = isAdmin || isSameUser;

    return canModify;
  }

}
