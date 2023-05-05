import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../models/user-info.model';
import { UserType } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean{
        const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
            context.getClass(),
            context.getHandler(),
        ]);

        //----> Public resources.
        if (isPublic) return true;

        //----> Get the role of the user.
        const roles = this.reflector.get<string[]>("roles", context.getHandler());

        //----> Check for the existence of role.
        if(!roles) return false;

        //----> Get the request object.
        const request = context.switchToHttp().getRequest();
        
        //----> Get the user from the request object.
        const user = request.user as AuthUser;

        //----> Check if the roles matches those who are permitted to view or use the available resources.
        return this.matchRoles(roles, user?.userType);
    }

    matchRoles(roles: string[], userType: UserType): boolean{
        return roles.includes(userType);
    }
}