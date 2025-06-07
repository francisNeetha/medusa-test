import {
    defineMiddlewares,
    MedusaNextFunction,
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"

// Define user access rules - map user IDs to their permissions
const USER_ACCESS_RULES = {
    // You can map by user ID directly since we have that from auth_context
    "user_01JWFSMFM8FD3F720VC62BKS9T": {
        email: "usera@example.com", // For logging purposes
        allowedRoutes: [
            "/admin/products",
            "/admin/collections",
            "/admin/categories"
        ], // All product-related endpoints
        allowedMethods: ["GET"],
        cssClass: "user-usera" // CSS class to add to body
    },
    // Add more users by their ID
    "user_01JWFSN6PP7CNPA58SB6Z1SQ2X": {
        email: "userb@example.com",
        allowedRoutes: ["/admin/orders"], 
        allowedMethods: ["GET"],
        cssClass: "user-userb" // CSS class to add to body
    },
}

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/*",
            middlewares: [
                (
                    req: MedusaRequest,
                    res: MedusaResponse,
                    next: MedusaNextFunction
                ) => {
                    console.log("🔍 Checking access for:", req.originalUrl);
                    
                    // Allow certain endpoints without restriction (authentication, user info, etc.)
                    const allowedEndpoints = [
                        "/admin/users/me",
                        "/admin/auth",
                        "/admin/invites",
                        "/admin/uploads",
                        "/admin/store", // Store configuration
                        "/admin/regions", // Basic store data
                        "/admin/currencies", // Basic store data
                        "/admin/tax-rates", // Basic store data
                        "/admin/shipping-options", // Basic store data
                        "/admin/payment-providers", // Basic store data
                        "/admin/fulfillment-providers", // Basic store data
                    ];
                    
                    const requestPath = req.originalUrl.split('?')[0];
                    const isAllowedEndpoint = allowedEndpoints.some(endpoint => 
                        requestPath.startsWith(endpoint)
                    );
                    
                    if (isAllowedEndpoint) {
                        console.log("✅ Allowing unrestricted endpoint:", requestPath);
                        return next();
                    }
                    
                    // Get user ID from auth_context
                    const userId = (req as any).auth_context?.actor_id;
                    
                    if (!userId) {
                        console.log("❌ No user ID found in auth context");
                        return res.status(401).json({
                            error: "Authentication required",
                            message: "Please log in to access admin resources"
                        });
                    }
                    
                    console.log("👤 User ID:", userId);
                    
                    // Check if user has specific access restrictions
                    const userRules = USER_ACCESS_RULES[userId];
                    
                    // For HTML requests (admin panel pages), inject user CSS class
                    if (req.headers.accept?.includes('text/html') || req.originalUrl === '/admin' || req.originalUrl.startsWith('/admin/app')) {
                        if (userRules && userRules.cssClass) {
                            // Set custom headers that can be read by frontend JavaScript
                            res.setHeader('X-User-Class', userRules.cssClass);
                            res.setHeader('X-User-Email', userRules.email);
                            res.setHeader('X-User-ID', userId);
                            console.log(`🎨 Setting user CSS class: ${userRules.cssClass}`);
                        }
                    }
                    
                    if (!userRules) {
                        // User not in rules - allow full access (admin users)
                        console.log("✅ User not in access rules - allowing full admin access");
                        return next();
                    }
                    
                    console.log(`🔒 Checking restricted access for user: ${userRules.email}`);
                    console.log(`📍 Request: ${req.method} ${req.originalUrl}`);
                    console.log(`✅ Allowed routes:`, userRules.allowedRoutes);
                    console.log(`🔧 Allowed methods:`, userRules.allowedMethods);
                    
                    const requestMethod = req.method;
                    
                    // Check if the route is allowed
                    const isRouteAllowed = userRules.allowedRoutes.some(allowedRoute => 
                        requestPath.startsWith(allowedRoute)
                    );
                    
                    // Check if the method is allowed
                    const isMethodAllowed = userRules.allowedMethods.includes(requestMethod);
                    
                    if (!isRouteAllowed) {
                        console.log(`❌ Route access denied for ${userRules.email} to ${requestPath}`);
                        return res.status(403).json({
                            error: "Access Denied",
                            message: `You do not have access to this section. Contact your administrator for permission.`,
                            details: `Access denied to: ${requestPath}`
                        });
                    }
                    
                    if (!isMethodAllowed) {
                        console.log(`❌ Method access denied for ${userRules.email} to ${requestMethod} ${requestPath}`);
                        return res.status(403).json({
                            error: "Access Denied", 
                            message: `You do not have permission to perform this action. Contact your administrator.`,
                            details: `${requestMethod} method not allowed on ${requestPath}`
                        });
                    }
                    
                    console.log(`✅ Access granted for ${userRules.email} to ${requestMethod} ${requestPath}`);
                    next();
                },
            ],
        },
        // Add a specific route to serve user info for CSS class application
        {
            matcher: "/admin/user-info",
            middlewares: [
                (
                    req: MedusaRequest,
                    res: MedusaResponse,
                    next: MedusaNextFunction
                ) => {
                    const userId = (req as any).auth_context?.actor_id;
                    
                    if (!userId) {
                        return res.status(401).json({ error: "Not authenticated" });
                    }
                    
                    const userRules = USER_ACCESS_RULES[userId];
                    
                    if (userRules) {
                        return res.json({
                            cssClass: userRules.cssClass,
                            email: userRules.email,
                            userId: userId
                        });
                    } else {
                        return res.json({
                            cssClass: "user-admin",
                            email: "admin",
                            userId: userId
                        });
                    }
                },
            ],
        },
    ],
});



