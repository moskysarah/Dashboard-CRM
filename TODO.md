# TODO: Fix TypeScript Errors in redirectByRole.tsx

- [x] Update switch cases in `src/components/redirectByRole.tsx` to use lowercase strings matching `UserRole` type ('admin', 'superadmin', 'marchand', 'agent')
- [x] Map "Agent PMC" to 'agent' in the switch statement (removed "Agent PMC" as it's not in type)
- [x] Clean up improperly nested comments at the end of the file to fix syntax error
- [ ] Verify TypeScript compilation after changes
