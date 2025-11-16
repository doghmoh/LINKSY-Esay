import React, { useEffect, useMemo, useState } from 'react';
import { PaymentReport } from '../types';
import Modal from '../../ui/Modal';
import { Eye, Download, Search, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface PaymentReportsProps {
  reports?: PaymentReport[];
}

const mockReports: PaymentReport[] = [
  {
    id: '1',
    orderNumber: 'PAY123456',
    amount: 2500,
    currency: 'DZD',
    paymentMethod: 'CIB',
    status: 'accepted',
    transactionDate: new Date().toISOString(),
    customer: 'Client A',
    invoiceUrl: '#',
  },
  {
    id: '2',
    orderNumber: 'PAY654321',
    amount: 4500,
    currency: 'DZD',
    paymentMethod: 'Dahabia',
    status: 'rejected',
    transactionDate: new Date(Date.now() - 86400000).toISOString(),
    customer: 'Client B',
  },
  {
    id: '3',
    orderNumber: 'PAY777888',
    amount: 12000,
    currency: 'DZD',
    paymentMethod: 'Cash',
    status: 'pending_cash',
    transactionDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    customer: 'Client C',
    invoiceUrl: '#',
  },
];

const statusColor: Record<PaymentReport['status'], string> = {
  accepted: 'bg-green-100 text-green-700 ring-green-600/10',
  rejected: 'bg-red-100 text-red-700 ring-red-600/10',
  pending_cash: 'bg-yellow-100 text-yellow-700 ring-yellow-600/10',
};

const PaymentReports: React.FC<PaymentReportsProps> = ({ reports }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentReport['status']>('all');
  const [methodFilter] = useState<'all' | 'Cash' | 'CIB' | 'Dahabia'>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showDateFilter, setShowDateFilter] = useState<boolean>(false);
  const [previewReport, setPreviewReport] = useState<PaymentReport | null>(null);

  const data = reports && reports.length > 0 ? reports : mockReports;

  // simplified UI: no counts/chips

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const matchesQuery =
        r.orderNumber.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (r.customer || '').toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      const matchesMethod = methodFilter === 'all' ? true : r.paymentMethod === methodFilter;
      const txTime = new Date(r.transactionDate).getTime();
      const fromOk = dateFrom ? txTime >= new Date(dateFrom).getTime() : true;
      const toOk = dateTo ? txTime <= new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1 : true; // include entire end day
      return matchesQuery && matchesStatus && matchesMethod && fromOk && toOk;
    });
  }, [data, debouncedQuery, statusFilter, methodFilter, dateFrom, dateTo]);

  const formatCurrency = (amount: number, currency: string) => `${amount.toLocaleString('fr-DZ')} ${currency}`;
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleExportCsv = () => {
    const header = ['orderNumber', 'customer', 'amount', 'currency', 'paymentMethod', 'status', 'transactionDate'];
    const rows = filtered.map((r) => [r.orderNumber, r.customer || '', String(r.amount), r.currency, r.paymentMethod, r.status, r.transactionDate]);
    const csv = [header.join(','), ...rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rapports_paiement.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    // Outer container for padding and background
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Inner container for max-width and centering */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Filters and Search Card */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Rechercher (N° commande, client)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md"
                aria-label="Rechercher des rapports"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <span className="text-sm font-medium text-gray-500 mr-2 flex-shrink-0">Statut:</span>
              {(['all', 'accepted', 'rejected', 'pending_cash'] as const).map((status) => {
                const isActive = statusFilter === status;
                const getStatusInfo = (status: string) => {
                  switch (status) {
                    case 'accepted': return { text: 'Accepté', color: 'bg-green-100 text-green-700', ring: 'ring-green-600/10' };
                    case 'rejected': return { text: 'Refusé', color: 'bg-red-100 text-red-700', ring: 'ring-red-600/10' };
                    case 'pending_cash': return { text: 'En attente', color: 'bg-yellow-100 text-yellow-700', ring: 'ring-yellow-600/10' };
                    default: return { text: 'Tous', color: '', ring: '' };
                  }
                };
                const statusInfo = status !== 'all' ? getStatusInfo(status) : { text: 'Tous', color: '', ring: '' };

                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? status === 'all'
                          ? 'bg-[#DC0032] text-white'
                          : `${statusInfo.color} ring-1 ${statusInfo.ring}`
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                    aria-pressed={isActive}
                  >
                    {statusInfo.text}
                  </button>
                );
              })}
            </div>

            {/* Date Filter Toggle */}
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#DC0032] hover:bg-gray-50 rounded-md transition-colors flex-shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Filtre par date</span>
              <span className="sm:hidden">Date</span>
              {showDateFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {/* Export Button */}
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 flex-shrink-0"
            >
              Export CSV
            </button>
          </div>
          
          {/* Date Filter (Hidden/Shown) */}
          {showDateFilter && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 flex-shrink-0">Période:</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md w-full sm:w-auto"
                      placeholder="Date de début"
                    />
                    <span className="text-xs text-gray-500 self-center hidden sm:inline">→</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md w-full sm:w-auto"
                      placeholder="Date de fin"
                    />
                  </div>
                </div>
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => {
                      setDateFrom('');
                      setDateTo('');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    title="Effacer les dates"
                  >
                    Effacer les dates
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">N° Commande</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Méthode</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.customer || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(r.amount, r.currency)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.paymentMethod}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusColor[r.status]}`}>
                      {r.status === 'accepted' && 'Accepté'}
                      {r.status === 'rejected' && 'Refusé'}
                      {r.status === 'pending_cash' && 'En attente (Espèces)'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(r.transactionDate)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 rounded-md border border-transparent text-gray-600 hover:text-[#DC0032] hover:bg-gray-100"
                        onClick={() => setPreviewReport(r)}
                        title="Voir facture"
                        aria-label={`Voir facture ${r.orderNumber}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        className="p-1.5 rounded-md border border-transparent text-gray-600 hover:text-[#DC0032] hover:bg-gray-100"
                        href={r.invoiceUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        title="Télécharger"
                        aria-label={`Télécharger facture ${r.orderNumber}`}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mx-auto text-gray-300 mb-3">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="font-medium mb-1 text-gray-900">Aucun résultat</p>
                      <p className="text-sm text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <Modal isOpen={!!previewReport} onClose={() => setPreviewReport(null)} title={`Facture ${previewReport?.orderNumber}`} size="xl">
        <div className="h-[70vh]">
          {previewReport?.invoiceUrl ? (
            <iframe title="Invoice Preview" src={previewReport.invoiceUrl} className="w-full h-full border rounded" />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">Aperçu indisponible</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PaymentReports;


