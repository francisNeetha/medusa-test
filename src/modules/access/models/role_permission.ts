// src/modules/role/models/role.ts
import { model } from "@medusajs/framework/utils"
import {Permission} from "./permission" // Import the Permission model to establish the relationship
import {Role} from "./role"
export const RolePermission = model.define("role_permission", {
  id: model.id().primaryKey(), 
  role: model.belongsTo(() => Role, { mappedBy: "role_permission" }),
  permission: model.belongsTo(() => Permission, { mappedBy: "role_permission" })
})


// role_id :model.has many () => role
// permissin_id: model.has many()=> per