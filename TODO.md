# TODO: Corriger les erreurs dans Login.tsx

- [x] Ajouter le formulaire pour le mode "register" avec champs nom, prénom, phone/email, mot de passe, rôle
- [x] Ajouter le formulaire pour le mode "otp" avec champ pour saisir l'OTP
- [x] Ajouter des boutons de navigation entre modes (login <-> register, retour dans otp, etc.)
- [x] Corriger le bouton "Mot de passe oublié ?" pour basculer en mode sans envoi immédiat
- [x] Aligner les options du select de rôle avec les types ("Admin", "Marchand", "Distributeur")
- [x] Inclure le rôle dans les payloads API si nécessaire
- [x] Ajouter validations supplémentaires (mot de passe, OTP)
- [ ] Tester les flux après modifications

## TODO: Fix TypeScript errors for Render deployment

- [x] Remove unused React import in App.tsx
- [x] Remove unused UserProvider import in App.tsx
- [x] Remove unused api import in useMessages.ts
- [x] Remove unused PaginatedMessages interface in useMessages.ts
- [x] Fix sendMessage object to use 'user' instead of 'sender' in useMessages.ts
- [x] Remove unused setPageSize in useUsers.ts
- [x] Remove unused useContext import in Profile.tsx
- [x] Add userId argument to getProfile call in Profile.tsx
- [x] Remove unused Transaction import in TransactionsList.tsx
- [x] Remove unused 'get' in auth.ts
