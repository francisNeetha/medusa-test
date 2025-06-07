import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { ACCESS_MODULE } from "../modules/access/index"; // Adjust path as needed

export default async function seedRolePermissionData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Seeding role permission data...");

  try {
    // Resolve the access module service
    const AccessModuleService = container.resolve(ACCESS_MODULE);

    // Define the role-permission mappings to seed
    // You can use either IDs directly or fetch by other criteria
    const rolePermissionMappings = [
      { 
        roleId: "01JX212NJAGZWC6M1J3TEHPNT0",       // Pharmacy Manager
        permissionId: "01JX217FER13JAVKWYS4CHPJ0H"  // products
      },
      { 
        roleId: "01JX212NJRNZZXMGVPV7QEHHXM", //Pharmacist
        permissionId: "01JX217FFN3CDBADFB2S8190KM"  //orders
      },
      // Add more mappings as needed
    ];

    
    // Check existing role permissions to avoid duplicates
    const existingRolePermissions = await AccessModuleService.listRolePermissions();
    const existingMappings = existingRolePermissions.map(rp => ({
      roleId: rp.role.id,
      permissionId: rp.permission.id
    }));

    // Method 1: Using direct ID mappings
    const newMappings = rolePermissionMappings.filter(mapping => 
      !existingMappings.some(existing => 
        existing.roleId === mapping.roleId && existing.permissionId === mapping.permissionId
      )
    );

    // Create new role-permission mappings using direct IDs
    for (const mapping of newMappings) {
      try {
        // Verify that the role and permission exist before creating the mapping
        const role = await AccessModuleService.retrieveRole(mapping.roleId);
        const permission = await AccessModuleService.retrievePermission(mapping.permissionId);

        if (!role) {
          logger.warn(`Role with ID ${mapping.roleId} not found. Skipping mapping.`);
          continue;
        }

        if (!permission) {
          logger.warn(`Permission with ID ${mapping.permissionId} not found. Skipping mapping.`);
          continue;
        }

        const createdRolePermission = await AccessModuleService.createRolePermissions({
          role: mapping.roleId,
          permission: mapping.permissionId
        });

        logger.info(`Created role-permission mapping: Role ${mapping.roleId} -> Permission ${mapping.permissionId} (ID: ${createdRolePermission.id})`);
      } catch (error) {
        logger.error(`Failed to create role-permission mapping for role ${mapping.roleId} and permission ${mapping.permissionId}:`, error);
      }
    }


    logger.info("Finished seeding role permission data.");
    
  } catch (error) {
    logger.error("Error seeding role permission data:", error);
    throw error;
  }
}

// Alternative function: Seed all permissions for specific roles
export async function seedAllPermissionsForRoles({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Seeding all permissions for specific roles...");

  try {
    const AccessModuleService = container.resolve(ACCESS_MODULE);

    // Get all roles and permissions
    const roles = await AccessModuleService.listRoles();
    const permissions = await AccessModuleService.listPermissions();

    // Define which roles should get which permissions
    const rolePermissionConfig = [
      {
        roleName: "admin",
        shouldHaveAllPermissions: true // Admin gets all permissions
      },
      {
        roleName: "manager",
        allowedPermissions: ["/products", "/orders"] // Manager gets specific permissions
      },
      {
        roleName: "user",
        allowedPermissions: ["/products"] // User gets limited permissions
      }
    ];

    for (const config of rolePermissionConfig) {
      const role = roles.find(r => r.name === config.roleName);
      if (!role) {
        logger.warn(`Role "${config.roleName}" not found. Skipping.`);
        continue;
      }

      // Explicitly type permissionsToAssign as the same type as elements in permissions
      let permissionsToAssign: typeof permissions = [];

      if (config.shouldHaveAllPermissions) {
        permissionsToAssign = permissions;
      } else if (config.allowedPermissions) {
        permissionsToAssign = permissions.filter(p => 
          config.allowedPermissions.includes(p.path)
        );
      }

      for (const permission of permissionsToAssign) {
        try {
          // Check if mapping already exists
          const existingMapping = await AccessModuleService.listRolePermissions({
            role: role.id,
            permission: permission.id
          });

          if (existingMapping.length > 0) {
            continue; // Skip if already exists
          }

          // Create the mapping
          await AccessModuleService.createRolePermissions({
            role: role.id,
            permission: permission.id
          });

          logger.info(`Assigned permission "${permission.path}" to role "${role.name}"`);
        } catch (error) {
          logger.error(`Failed to assign permission "${permission.path}" to role "${role.name}":`, error);
        }
      }
    }

    logger.info("Finished seeding all permissions for roles.");
    
  } catch (error) {
    logger.error("Error seeding all permissions for roles:", error);
    throw error;
  }
}