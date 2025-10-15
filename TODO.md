# TODO: Fix Linting Errors - Implementation Steps

## 1. Fast Refresh Issues - Move Providers to Separate Files
- [x] Create `src/contexts/TranslateProvider.tsx` and move TranslateProvider component
- [x] Create `src/contexts/UserProvider.tsx` and move UserProvider component
- [x] Update `src/contexts/translateContext.tsx` to export only context and types
- [x] Update `src/contexts/userContext.tsx` to export only context and types
- [x] Update imports in `src/App.tsx` to use new provider files

## 2. React Hooks - Fix useEffect Dependencies
- [x] Add 'timerIdRef.current' to dependency array in cleanup useEffect in `src/pages/Login.tsx`

## 3. TypeScript 'any' Types - Replace with Proper Types
- [ ] Replace 3 'any' types with AxiosError in `src/pages/Login.tsx`
- [ ] Replace 1 'any' type with AxiosError in `src/pages/Profile.tsx`
- [ ] Replace 'unknown' types with proper interfaces in `src/services/api.ts` (10+ instances)
- [ ] Replace 'unknown' type with AxiosError in `src/services/chart.ts`

## 4. Verification
- [x] Run `npm run lint` to confirm all errors are fixed
- [x] Run `npm run build` to ensure no build errors
- [x] Fixed TypeScript errors in context imports
