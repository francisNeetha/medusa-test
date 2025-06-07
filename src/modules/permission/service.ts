import { MedusaService } from "@medusajs/framework/utils"
import { Permission } from "./models/permission"

class PermissionModuleService extends MedusaService({
  Permission,
  
}) {
}

export default PermissionModuleService

// src/modules/permission/service.ts
// import { MedusaService } from "@medusajs/framework/utils"
// import { Permission } from "./models/permission"

// class PermissionModuleService extends MedusaService({
//   Permission,
// }) {
  
//   async seedInitialPermissions() {
//     const permissions = [
//       { path: "/products" },
//       { path: "/orders" },
//       { path: "/inventory" }
//     ]

//     const createdPermissions: any[] = []

//     for (const permission of permissions) {
//       try {
//         // Check if permission already exists
//         const existing = await this.listPermissions({
//           path: permission.path
//         })
        
//         if (existing.length === 0) {
//           const created = await this.createPermissions(permission)
//           createdPermissions.push(created)
//         }
//       } catch (error) {
//         console.error(`Error creating permission ${permission.path}:`, error)
//       }
//     }

//     return createdPermissions
//   }

//   async findPermissionByPath(path: string) {
//     const permissions = await this.listPermissions({ path })
//     return permissions[0] || null
//   }

//   async createPermissionIfNotExists(path: string) {
//     const existing = await this.findPermissionByPath(path)
    
//     if (!existing) {
//       return await this.createPermissions({ path })
//     }
    
//     return existing
//   }
// }

// export default PermissionModuleService
