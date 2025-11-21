# Fix TypeScript Errors

## Files to Edit
- [ ] src/components/AgentTable.tsx: Change import AgentForm to "./AgentForm.tsx"
- [ ] src/components/PayoutForm.tsx: Remove unused 'response' variable
- [ ] src/components/RechargeForm.tsx: Remove unused 'response' variable
- [ ] src/components/TransferForm.tsx: Remove unused 'response' variable
- [ ] src/components/cards/AgentTransferCard.tsx: Remove unused 'resetForm' function
- [ ] src/hooks/usePartner.ts: Convert id to string in removePartner
- [ ] src/pages/DashboardAdmin.tsx: Remove unused import AgentStatsCard
- [ ] src/hooks/useUserSettings.ts: Modify hook to accept userId param, change settings to object, add canViewOthers
- [ ] src/pages/DashboardSettings.tsx: Fix hook call and destructuring

## Followup Steps
- [ ] Run build to verify errors are fixed
- [ ] Test the application
