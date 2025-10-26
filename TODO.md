# TODO: Fix TypeScript Errors

## Errors to Fix:
1. Type 'string | undefined' is not assignable to type 'string' - in AvatarRole component props
2. Type 'UserRole | undefined' is not assignable to type 'UserRole' - in AvatarRole component role prop
3. 'React' is declared but its value is never read - in avatarRole.tsx
4. 'T' is declared but its value is never read - in translatespace.tsx

## Plan:
- Update AvatarRole component to handle optional firstName, lastName, and role props
- Remove unused React import from avatarRole.tsx
- Check and fix any unused 'T' in translatespace.tsx
- Ensure Header.tsx passes safe values to Avatar component

## Files to Edit:
- src/components/avatarRole.tsx
- src/components/Header.tsx (if needed)
- src/components/translatespace.tsx (if needed)
