// src/modules/access/service.ts

import { MedusaService } from "@medusajs/framework/utils"
import {Role} from "./models/role"
import {Permission} from "./models/permission"
import {RolePermission} from "./models/role_permission"
import {UserRole} from "./models/user_role"
import {User} from "./models/user"
export default class AccessModuleService extends MedusaService({
  Role,
  Permission,
  RolePermission,
  UserRole,
   //User
}) {}