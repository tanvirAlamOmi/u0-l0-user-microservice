import { SetMetadata } from "@nestjs/common";
import { PermissionsEnum } from "src/common/enums";

export const Permissions = (...permissions: PermissionsEnum[]) => SetMetadata('permissions', permissions);