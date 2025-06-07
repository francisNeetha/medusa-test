// src/modules/permission/models/permission.ts
import { model } from "@medusajs/framework/utils"

export const Permission = model.define("permission", {
  id: model.id().primaryKey(),
  path: model.text().unique(), // Ensure paths are unique
})