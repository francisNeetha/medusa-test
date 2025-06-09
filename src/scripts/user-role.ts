       // Pharmacist role ID
    
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { ACCESS_MODULE } from "../modules/access/index"; // Adjust path as needed

export default async function seedUserRoleData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Seeding user role data...");

  try {
    // Resolve the access module service
    const AccessModuleService = container.resolve(ACCESS_MODULE);

    // Define the user-role mappings to seed
    // Make sure these user IDs actually exist in your user table
    const userRoleMappings = [
     {
        userId: "user_01JWFSMFM8FD3F720VC62BKS9T",     // Replace with actual user ID
        roleId: "01JX212NJAGZWC6M1J3TEHPNT0"          // Pharmacy Manager role ID
      },
      { 
        userId: "user_01JWFSN6PP7CNPA58SB6Z1SQ2X",     // Replace with actual user ID
        roleId: "01JX212NJRNZZXMGVPV7QEHHXM"   
      // Add more mappings as needed
      }
    ];

    // Check existing user roles to avoid duplicates
    try {
      const existingUserRoles = await AccessModuleService.listUserRoles();
      const existingMappings = existingUserRoles.map(ur => ({
        userId: ur.user_id,
        roleId: ur.role_id
      }));

      // Filter out existing mappings
      const newMappings = userRoleMappings.filter(mapping => 
        !existingMappings.some(existing => 
          existing.userId === mapping.userId && existing.roleId === mapping.roleId
        )
      );

      logger.info(`Found ${newMappings.length} new user-role mappings to create`);

      // Create new user-role mappings
      for (const mapping of newMappings) {
        try {
          // Verify that the role exists
          const role = await AccessModuleService.retrieveRole(mapping.roleId);

          if (!role) {
            logger.warn(`Role with ID ${mapping.roleId} not found. Skipping mapping.`);
            continue;
          }

          // Create user-role mapping
          // The database foreign key constraint will validate if user exists
          const createdUserRole = await AccessModuleService.createUserRoles({
            user_id: mapping.userId,
            role_id: mapping.roleId
          });

          logger.info(`Created user-role mapping: User ${mapping.userId} -> Role ${role.name} (${mapping.roleId})`);
        } catch (error) {
          logger.error(`Failed to create user-role mapping for user ${mapping.userId} and role ${mapping.roleId}:`, error.message);
        }
      }
    } catch (error) {
      logger.error(`Error processing user-role mappings:`, error.message);
      
      // If listUserRoles fails, try to create mappings directly
      logger.info("Attempting to create mappings without duplicate check...");
      
      for (const mapping of userRoleMappings) {
        try {
          const createdUserRole = await AccessModuleService.createUserRoles({
            user_id: mapping.userId,
            role_id: mapping.roleId
          });
          logger.info(`Created user-role mapping: User ${mapping.userId} -> Role ${mapping.roleId}`);
        } catch (createError) {
          logger.error(`Failed to create user-role mapping for user ${mapping.userId} and role ${mapping.roleId}:`, createError.message);
        }
      }
    }

    logger.info("Finished seeding user role data.");
    
  } catch (error) {
    logger.error("Error seeding user role data:", error);
    throw error;
  }
}

// Helper function to get actual user IDs from your database
export async function listAvailableUsers({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  try {
    // Try to get users through remote query
    const query = container.resolve("query");
    
    const users = await query.graph({
      entity: "user",
      fields: ["id", "email", "first_name", "last_name"],
    });

    logger.info("Available users:");
    users.data.forEach(user => {
      logger.info(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.first_name} ${user.last_name}`);
    });

    return users.data;
  } catch (error) {
    logger.error("Could not retrieve users:", error.message);
    logger.info("You may need to manually check your user table to get correct user IDs");
    return [];
  }
}