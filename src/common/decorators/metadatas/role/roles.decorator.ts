import { SetMetadata } from "@nestjs/common";
import { RolesEnum } from "src/common/enums";

export const Roles = (...roles: RolesEnum[]) => SetMetadata('role', roles);