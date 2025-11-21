import Layout from "../components/layout/Layout"
import ClientWalletCard from "../components/cards/ClientWalletCard"
import TransactionTable from "../components/tables/TransactionTable"

const WalletPage: React.FC = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientWalletCard />
      </div>
      <div className="mt-6">
        <TransactionTable />
      </div>
    </Layout>
  )
}

export default WalletPage
