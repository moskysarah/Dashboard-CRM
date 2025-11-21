import { useTransactions, type TransactionFilters } from "../../hooks/useTransactions";
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock, Calendar, Building } from "lucide-react";
import { useState } from "react";
import TransactionFiltersComponent from "../TransactionFilters";

interface TransactionTableProps {
  userRole?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ userRole }) => {
  const [filters, setFilters] = useState<TransactionFilters>({ userRole });
  const { data: transactions, loading } = useTransactions(filters);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const handleClearFilters = () => {
    setFilters({ userRole });
  };

  return (
    <div className="space-y-6">
      <TransactionFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 md:p-6 w-full">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
          Transactions
        </h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Chargement des transactions...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="p-2 md:p-4 font-semibold text-gray-700 rounded-tl-lg text-sm md:text-base">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        ID
                      </div>
                    </th>
                    <th className="p-2 md:p-4 font-semibold text-gray-700 text-sm md:text-base">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date
                      </div>
                    </th>
                    <th className="p-2 md:p-4 font-semibold text-gray-700 text-sm md:text-base">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Sous-magasin
                      </div>
                    </th>
                    <th className="p-2 md:p-4 font-semibold text-gray-700 text-sm md:text-base">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Montant
                      </div>
                    </th>
                    <th className="p-2 md:p-4 font-semibold text-gray-700 rounded-tr-lg text-sm md:text-base">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((transaction: any, index: number) => (
                    <tr
                      key={transaction.id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-2 md:p-4 font-medium text-gray-900 text-sm md:text-base">#{transaction.id}</td>
                      <td className="p-2 md:p-4 text-gray-600 text-xs md:text-sm">
                        {formatDate(transaction.created_at || transaction.date)}
                      </td>
                      <td className="p-2 md:p-4 text-gray-600 text-sm md:text-base">
                        {transaction.sub_store || transaction.merchant_name || 'N/A'}
                      </td>
                      <td className="p-2 md:p-4 text-gray-600 font-semibold text-sm md:text-base">
                        ${transaction.Montant?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 md:p-4">
                        <span className={getStatusBadge(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize text-xs md:text-sm">{transaction.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {transactions?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                {Object.keys(filters).length > 0 ? 'Aucune transaction ne correspond aux filtres' : 'pas de transactions trouvées'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
