import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesEnum } from "src/common/enums";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean  {

        const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>('role', [
            context.getHandler(),
            context.getClass(),
        ]);
        
        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();
        
        return requiredRoles.some(role => user.info.role?.includes(role));
    }
}