// src/modules/role/models/role.ts
import { model } from "@medusajs/framework/utils"
import { User } from "./user" // Import the User model to establish the relationship
import {Permission} from "./permission" // Import the Permission model to establish the relationship
import {RolePermission}  from "./role_permission" // Import the role_permission model to establish the relationshippo
export const Role = model.define("role", {
  id: model.id().primaryKey(), 
  name: model.text(), 
//   permission: model.hasMany(() => Permission),
role: model.hasMany(() => RolePermission),
})


// role_id :model.has many () => role
// permissin_id: model.has many()=> per