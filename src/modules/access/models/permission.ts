// src/modules/permission/models/permission.ts
import { model } from "@medusajs/framework/utils"
import { Role } from "./role" 
import { RolePermission } from "./role_permission"
export const Permission = model.define("permission", {
  id: model.id().primaryKey(),
  path: model.text().unique(), 
//   role: model.belongsTo(() => Role, { mappedBy: "permission" }),
  permission: model.hasMany(() => RolePermission),
})