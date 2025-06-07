// src/modules/permission/index.ts
import { Module } from "@medusajs/framework/utils"
import PermissionModuleService from "./service" // You'll create this service next
import { Permission } from "./models/permission" // Import the Permission model

export const PERMISSION_MODULE_ID = "permission" // Unique ID for your Permission module

export default Module(PERMISSION_MODULE_ID, {
  service: PermissionModuleService,
})