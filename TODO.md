# TODO: Secure Routes Based on User Roles

## Steps to Complete
- [x] Add necessary imports to src/router/index.tsx (Navigate, useAuth, RoleProtectedRoute)
- [x] Define RequireAuth component in src/router/index.tsx
- [x] Wrap the Layout component with RequireAuth
- [x] Wrap dashboard route with RoleProtectedRoute (allowedRoles: ["superadmin", "admin"])
- [x] Wrap analytics route with RoleProtectedRoute (allowedRoles: ["superadmin", "admin", "user"])
- [x] Wrap agent route with RoleProtectedRoute (allowedRoles: ["superadmin", "admin", "agent"])
- [x] Wrap users route with RoleProtectedRoute (allowedRoles: ["superadmin", "admin"])
- [x] Wrap merchants route with RoleProtectedRoute (allowedRoles: ["superadmin", "admin", "user"])
- [x] Wrap transactions route with RoleProtectedRoute (allowedRoles: ["superadmin", "admin", "user", "agent"])
- [x] Wrap it route with RoleProtectedRoute (allowedRoles: ["superadmin"])
- [x] Wrap distributor route with RoleProtectedRoute (allowedRoles: ["partner"])
- [ ] Test the implementation by running the app and checking access with different roles
