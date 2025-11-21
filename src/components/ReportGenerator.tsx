import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Filter } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useTransactions, type TransactionFilters } from '../hooks/useTransactions';
import * as XLSX from 'xlsx';

const ReportGenerator: React.FC = () => {
  const [reportFilters, setReportFilters] = useState<TransactionFilters>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: transactions } = useTransactions(reportFilters);

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setReportFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const exportToCSV = () => {
    if (!transactions || transactions.length === 0) return;

    setIsGenerating(true);

    try {
      const csvData = transactions.map(transaction => ({
        'ID': transaction.id,
        'Date': new Date(transaction.created_at || transaction.date).toLocaleDateString('fr-FR'),
        'Sous-magasin': transaction.sub_store || transaction.merchant_name || 'N/A',
        'Montant': transaction.Montant,
        'Statut': transaction.status,
        'Référence': transaction.reference || 'N/A',
        'Description': transaction.description || 'N/A'
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value =>
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToExcel = () => {
    if (!transactions || transactions.length === 0) return;

    setIsGenerating(true);

    try {
      const excelData = transactions.map(transaction => ({
        'ID': transaction.id,
        'Date': new Date(transaction.created_at || transaction.date).toLocaleDateString('fr-FR'),
        'Sous-magasin': transaction.sub_store || transaction.merchant_name || 'N/A',
        'Montant': transaction.Montant,
        'Statut': transaction.status,
        'Référence': transaction.reference || 'N/A',
        'Description': transaction.description || 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

      // Ajouter une feuille de résumé
      const summaryData = [
        { 'Métrique': 'Nombre total de transactions', 'Valeur': transactions.length },
        { 'Métrique': 'Montant total', 'Valeur': transactions.reduce((sum, t) => sum + (t.Montant || 0), 0) },
        { 'Métrique': 'Transactions réussies', 'Valeur': transactions.filter(t => ['completed', 'success'].includes(t.status?.toLowerCase())).length },
        { 'Métrique': 'Taux de réussite', 'Valeur': `${((transactions.filter(t => ['completed', 'success'].includes(t.status?.toLowerCase())).length / transactions.length) * 100).toFixed(2)}%` }
      ];
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');

      XLSX.writeFile(workbook, `rapport_transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearFilters = () => {
    setReportFilters({});
  };

  const hasActiveFilters = Object.values(reportFilters).some(value =>
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        <FileText className="w-6 h-6 mr-2 text-blue-600" />
        Rapport de transactions
      </h3>

      {/* Filtres pour le rapport */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtres du Rapport
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <Input
              type="date"
              value={reportFilters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <Input
              type="date"
              value={reportFilters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={reportFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Réussi</option>
              <option value="success">Réussi</option>
              <option value="failed">Échoué</option>
              <option value="error">Erreur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <Input
              type="text"
              placeholder="ID, référence..."
              value={reportFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Effacer les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Résumé des données */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-semibold mb-3 text-gray-700">Aperçu des Données</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{transactions?.length || 0}</p>
            <p className="text-sm text-gray-600">Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              ${transactions?.reduce((sum, t) => sum + (t.Montant || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
            <p className="text-sm text-gray-600">Montant Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {transactions ? Math.round((transactions.filter(t => ['completed', 'success'].includes(t.status?.toLowerCase())).length / transactions.length) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Taux de Réussite</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {new Set(transactions?.map(t => t.sub_store || t.merchant_name).filter(Boolean)).size || 0}
            </p>
            <p className="text-sm text-gray-600">Sous-magasins</p>
          </div>
        </div>
      </div>

      {/* Boutons d'export */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={exportToCSV}
          disabled={isGenerating || !transactions || transactions.length === 0}
          className="flex items-center justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? 'Génération...' : 'Exporter en CSV'}
        </Button>

        <Button
          variant="outline"
          onClick={exportToExcel}
          disabled={isGenerating || !transactions || transactions.length === 0}
          className="flex items-center justify-center"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          {isGenerating ? 'Génération...' : 'Exporter en Excel'}
        </Button>
      </div>

      {(!transactions || transactions.length === 0) && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Aucune donnée disponible pour générer un rapport. Veuillez ajuster vos filtres ou vérifier que des transactions existent.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
