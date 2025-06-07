// src/modules/role/models/role.ts
import { model } from "@medusajs/framework/utils"
import {Role} from "./role"
import {User} from "./user"
export const UserRole = model.define("user_role", {
  id: model.id().primaryKey(), 
  role: model.belongsTo(() => Role, { mappedBy: "user_role" }),
  user: model.belongsTo(() => User, { mappedBy: "user_role" })
})



