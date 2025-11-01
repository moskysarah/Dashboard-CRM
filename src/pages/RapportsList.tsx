import React, { useState, useEffect, useRef } from 'react';
import { getAnalyticsTimeseries } from '../services/api';

interface Report {
  id: string;
  title: string;
  type: 'financial' | 'sales' | 'user' | 'transaction';
  createdAt: string;
  status: 'generated' | 'processing' | 'failed';
  downloadUrl?: string;
}

const RapportsList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  const hasFetched = useRef(false);
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchReports = async () => {
      try {
        if (abortController.current) {
          abortController.current.abort();
        }

        abortController.current = new AbortController();
        setLoading(true);
        setError(null);

        const response = await getAnalyticsTimeseries();

        // Transform the timeseries data into reports format
        const transformedReports: Report[] = response.data.series?.map((item: any, index: number) => ({
          id: `report-${index}`,
          title: `Rapport ${item.date || item.timestamp?.split('T')[0] || 'N/A'}`,
          type: 'financial',
          createdAt: item.date || item.timestamp || new Date().toISOString(),
          status: 'generated',
          downloadUrl: undefined
        })) || [];

        setReports(transformedReports);
        hasFetched.current = true;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Erreur lors du chargement des rapports');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const generateReport = async (type: Report['type']) => {
    try {
      setGenerating(type);
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add a new report
      const newReport: Report = {
        id: `report-${Date.now()}`,
        title: `Rapport ${type} - ${new Date().toLocaleDateString()}`,
        type,
        createdAt: new Date().toISOString(),
        status: 'generated'
      };

      setReports(prev => [newReport, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération du rapport');
    } finally {
      setGenerating(null);
    }
  };

  const downloadReport = async (report: Report) => {
    if (!report.downloadUrl) return;

    try {
      const response = await fetch(report.downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setError('Erreur lors du téléchargement du rapport');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rapports</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Générer un nouveau rapport</h2>
        <div className="flex gap-4">
          {(['financial', 'sales', 'user', 'transaction'] as const).map((type) => (
            <button
              key={type}
              onClick={() => generateReport(type)}
              disabled={generating === type}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              {generating === type ? 'Génération...' : `Générer ${type}`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    report.status === 'generated' ? 'bg-green-100 text-green-800' :
                    report.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.downloadUrl && (
                    <button
                      onClick={() => downloadReport(report)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Télécharger
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun rapport disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default RapportsList;
