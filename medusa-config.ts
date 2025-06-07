import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
   
    // {
    //   resolve: "./src/modules/user",
    // },
  //   {
  //     resolve: "./src/modules/role",
  //     key: "role",

  //   },
  // {
  //   // Use the PERMISSION_MODULE_ID
  //   resolve: "./src/modules/permission",
  //    key: "permission",
  // },
  { 
    resolve: "./src/modules/access" },
 
  
  ],
  admin: {
    disable:false,
  },
})
