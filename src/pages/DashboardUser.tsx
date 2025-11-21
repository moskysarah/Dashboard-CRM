import WalletClient from "../components/cards/ClientWalletCard"
import TransactionTable from "../components/tables/TransactionTable"
import MessageList from "../components/MessageList"
import { useTransactions } from "../hooks/useTransactions"
// import { Phone, Store, Send, CreditCard, Smartphone } from "lucide-react"

const DashboardUser: React.FC = () => {
  const { data: transactions } = useTransactions()

  // Calcul de KPIs simples
  const totalTransactions = transactions?.length || 0
  const totalIn = transactions
    ? transactions.filter((t: any) => t.type === "IN").reduce((acc, t) => acc + t.amount, 0)
    : 0
  const totalOut = transactions
    ? transactions.filter((t: any) => t.type === "OUT").reduce((acc, t) => acc + t.amount, 0)
    : 0

  return (

      <div className="flex flex-col space-y-6 p-2 md:p-0">
         <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Dashboard Client</h2>
        {/* Wallet */}
        <div className="grid grid-cols-1 gap-6">
          <WalletClient/>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-gray-600 mb-2">Total Transactions</h3>
            <p className="text-2xl font-bold">{totalTransactions}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-gray-600 mb-2">Entrées</h3>
            <p className="text-2xl font-bold">{totalIn} FC</p>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl shadow">
            <h3 className="font-semibold text-gray-600 mb-2">Sorties</h3>
            <p className="text-2xl font-bold">{totalOut} FC</p>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-4">Mes Transactions</h2>
          <div className="overflow-x-auto">
            <TransactionTable />
          </div>
        </div>

        {/* Messages */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-4">Mes Messages</h2>
          <MessageList />
        </div>
      </div>

  )
}

export default DashboardUser
