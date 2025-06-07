import { Module } from "@medusajs/framework/utils"
import RoleModuleService from "./service"
export const BRAND_MODULE = "role"

export default Module(BRAND_MODULE, {
  service: RoleModuleService,
})

