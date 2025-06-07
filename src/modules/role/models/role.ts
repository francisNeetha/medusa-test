// src/modules/role/models/role.ts
import { model } from "@medusajs/framework/utils"
import { User } from "../../access/models/user" // Import the User model to establish the relationship

export const Role = model.define("role", {
  id: model.id().primaryKey(), 
  name: model.text(), 
})