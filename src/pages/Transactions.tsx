import React from "react";
import TransactionTable from "../components/tables/TransactionTable";

const Transactions: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h2>
      <TransactionTable />
    </div>
  );
};

export default Transactions;
