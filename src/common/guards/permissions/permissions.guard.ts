import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionsEnum } from "src/common/enums";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean  {

        const requiredPermissions = this.reflector.getAllAndOverride<PermissionsEnum[]>('permissions', [
            context.getHandler(),
            context.getClass(),
        ]);
        
        if (!requiredPermissions) return true;

        const { user } = context.switchToHttp().getRequest();
        console.log(user)
        return requiredPermissions.some(permission => user.info.permissions?.includes(permission));
    }
}