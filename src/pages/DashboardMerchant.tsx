import React from "react"
import MerchantTable from "../components/tables/MerchantTable"
import TransactionTable from "../components/tables/TransactionTable"
import MerchantWalletCard from "../components/cards/MerchantWalletCard"
import PerformanceChart from "../components/PerformanceChart"
import ReportGenerator from "../components/ReportGenerator"

const DashboardMerchant: React.FC = () => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Marchand</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MerchantWalletCard />
        <MerchantTable />
      </div>

      <TransactionTable />

      <PerformanceChart />

      <ReportGenerator />
    </div>
  )
}

export default DashboardMerchant
