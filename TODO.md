# TODO: Améliorer la responsivité du Dashboard Admin

## Information Gathered
- Le DashboardAdmin.tsx utilise Tailwind CSS avec des classes responsives, mais les tableaux larges causent des débordements horizontaux sur petits écrans malgré `overflow-x-auto`.
- Sections principales : Gestion Utilisateurs, Agents, Statistiques, Commissions, Transactions, Portefeuilles, Rapports.
- Grilles déjà responsives (grid-cols-1 lg:grid-cols-2 xl:grid-cols-3).
- Padding principal : p-2 md:p-0, à ajuster pour mieux gérer l'espace sur mobile.

## Plan
- [x] Modifier le conteneur principal : changer padding à p-4 md:p-6 lg:p-8, ajouter min-w-0 pour éviter débordements.
- [x] Ajouter min-w-0 et overflow-hidden aux sections de tableaux pour contenir le contenu.
- [ ] Ajuster les tableaux : rendre certaines colonnes cachées sur mobile (hidden md:table-cell) dans les composants de tableaux.
- [ ] Tester sur différents breakpoints.

## Dependent Files
- src/pages/DashboardAdmin.tsx
- src/components/UserTable.tsx
- src/components/AgentTable.tsx
- src/components/CommissionTable.tsx
- src/components/tables/AgentTransactionsTable.tsx
- src/components/AdminWalletTable.tsx

## Followup Steps
- Lancer `npm run dev` et tester en redimensionnant la fenêtre.
- Si débordements persistent, ajuster les composants de tableaux pour masquer colonnes non-essentielles sur mobile.
