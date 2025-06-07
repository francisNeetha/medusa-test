import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {ACCESS_MODULE} from "../modules/access/index"


export default async function seedPermissionData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Seeding permission data...");

  try {
    
    // Resolve the permission module service
    const AccessModuleService = container.resolve(ACCESS_MODULE);

    // Define the permissions to seed
    const permissionsToSeed = [
      { path: "/products" },
      { path: "/orders" },
      { path: "/inventory" }
    ];

    // Check existing permissions to avoid duplicates
    const existingPermissions = await AccessModuleService.listPermissions();
    const existingPaths = existingPermissions.map(p => p.path);

    // Filter out permissions that already exist
    const newPermissions = permissionsToSeed.filter(
      permission => !existingPaths.includes(permission.path)
    );

    if (newPermissions.length === 0) {
      logger.info("All permissions already exist. Skipping seeding.");
      return;
    }

    // Create new permissions
    for (const permission of newPermissions) {
      try {
        const createdPermission = await AccessModuleService.createPermissions(permission);
        logger.info(`Created permission: ${createdPermission.path} (ID: ${createdPermission.id})`);
      } catch (error) {
        logger.error(`Failed to create permission ${permission.path}:`, error);
      }
    }

    logger.info(`Finished seeding permission data. Created ${newPermissions.length} new permissions.`);
    
  } catch (error) {
    logger.error("Error seeding permission data:", error);
    throw error;
  }
}