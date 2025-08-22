// src/api/integration.ts
export async function fetchPosteSmartData() {
  // la Simulation d’un appel API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        partners: ["Banque A", "Banque B", "MobileMoney"],
        lastSync: "19/08/2025 - 12h45",
      });
    }, 1000);
  });
}
export async function fetchPosteSmartTransactions() {
  // la Simulation d’un appel API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, amount: 1200, date: "19/08/2025", status: "Succès" },
        { id: 2, amount: 800, date: "18/08/2025", status: "Échec" },
        { id: 3, amount: 1500, date: "17/08/2025", status: "Succès" },
      ]);
    }, 1000);
  });
}