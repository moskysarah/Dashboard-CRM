import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Search, Filter, X } from 'lucide-react';
import type { TransactionFilters } from '../hooks/useTransactions';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onClearFilters: () => void;
}

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtres des Transactions</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="text-sm"
            >
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm"
          >
            {isExpanded ? 'Réduire' : 'Étendre'}
          </Button>
        </div>
      </div>

      {/* Recherche rapide */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Rechercher par ID, référence..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Filtres étendus */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={filters.status || ''}
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

          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <Input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
            />
          </div>

          {/* Date de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <Input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
            />
          </div>

          {/* Montant minimum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant min
            </label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minAmount || ''}
              onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Montant maximum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant max
            </label>
            <Input
              type="number"
              placeholder="∞"
              value={filters.maxAmount || ''}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      )}

      {/* Indicateur de filtres actifs */}
      {hasActiveFilters && (
        <div className="mt-4 text-sm text-blue-600">
          Filtres actifs appliqués
        </div>
      )}
    </div>
  );
};

export default TransactionFiltersComponent;
