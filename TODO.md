# TODO: Import API Service into MerchantDashboard

## Steps to Complete
- [ ] Edit src/pages/MerchantDashboard.tsx to import api from "../services/api"
- [ ] Remove import of useMerchantPerformance hook
- [ ] Add useState for performanceData, loading, error
- [ ] Add useEffect to fetch data using api.getMerchantPerformance()
- [ ] Handle loading, error, and data states similarly to the hook
- [ ] Test the component to ensure data loads correctly

## Notes
- This replaces the hook with direct API calls for fetching merchant performance data.
- Ensure the component behaves the same as before.
