# TODO: Fix TypeScript Errors in Dashboard-CRM

## Pending Tasks

- [ ] Fix src/services/setting/index.ts to export from userSettings.ts instead of non-existent api.ts
- [ ] Add missing exports to src/services/partners/index.ts for functions in superAdmin/partner.ts (createPartner, getPartnerPerformance, getPartnerAgents)
- [ ] Fix import in src/components/settings/userSettingForm.tsx to correct path (../services/setting)
- [ ] Fix type issue in src/pages/DashboardPartner.tsx for transaction.amount (string | number to number)
- [ ] Ensure getUserTransactions is properly exported from api.ts or adjust imports
- [ ] Test that all imports resolve correctly after changes
