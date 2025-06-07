import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {ACCESS_MODULE} from "../modules/access/index"

export default async function seedRoleData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Seeding Roles data...");

  try {
    
    // Resolve the permission module service
    const AccessModuleService = container.resolve(ACCESS_MODULE);

    // Define the permissions to seed
    const rolesToSeed = [
      { name: "Admin" },
      { name: "Pharmacy Manager" },
      { name: "Pharmacist" }
    ];

    // Check existing permissions to avoid duplicates
    const existingRoles = await AccessModuleService.listRoles();
    const existingNames = existingRoles.map(p => p.name);

    // Filter out permissions that already exist
    const newRoles = rolesToSeed.filter(
      roles => !existingNames.includes(roles.name)
    );

    if (newRoles.length === 0) {
      logger.info("All Roles already exist. Skipping seeding.");
      return;
    }

    // Create new permissions
    for (const role of newRoles) {
      try {
        const createdRole = await AccessModuleService.createRoles(role);
        logger.info(`Created Roles: ${createdRole.name} (ID: ${createdRole.id})`);
      } catch (error) {
        logger.error(`Failed to create Roles ${role.name}:`, error);
      }
    }

    logger.info(`Finished seeding Roles data. Created ${newRoles.length} new permissions.`);
    
  } catch (error) {
    logger.error("Error seeding Roles data:", error);
    throw error;
  }
}

