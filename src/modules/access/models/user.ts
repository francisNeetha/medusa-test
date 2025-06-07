import { model } from "@medusajs/framework/utils"
import { Role } from "../../role/models/role" // Import the Role model
import user from "@medusajs/medusa/commands/user"
import { UserRole } from "./user_role"

export const User = model.define("user", {
  id: model.id().primaryKey(),
  email: model.text(),
  first_name: model.text().nullable(),
  last_name: model.text().nullable(), 
  avatar_url: model.text().nullable(),
  metadata: model.json().nullable(),
  role: model.hasMany(() => UserRole),
  
})