import React from "react"
// import AgentTable from "../components/tables/AgentTable"
import AgentWalletCard from "../components/cards/AgentWalletCard"
import AgentStatsCard from "../components/cards/AgentStatsCard"
import AgentProfileCard from "../components/cards/AgentProfileCard"
 import TransactionTable from "../components/tables/TransactionTable"
//  import AgentPerformanceChart from "../components/AgentPerformanceChart"
//  import ReportGenerator from "../components/ReportGenerator"
import RechargeForm from "../components/RechargeForm"
import PayoutForm from "../components/PayoutForm"
import TransferForm from "../components/TransferForm"

const DashboardAgent: React.FC = () => {
  return (
    <div className="space-y-6 p-2 md:p-0">
       <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Dashboard Agent</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgentWalletCard />
        <AgentProfileCard />
        <AgentStatsCard />
      </div>

      <div className="overflow-x-auto">
        <TransactionTable userRole="agent" />
      </div>

      {/* <AgentPerformanceChart /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RechargeForm />
        <PayoutForm />
        <TransferForm />
      </div>

       {/* <ReportGenerator /> */}
    </div>
  )
}

export default DashboardAgent
