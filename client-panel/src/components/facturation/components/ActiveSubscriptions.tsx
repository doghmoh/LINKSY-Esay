import React, { useEffect, useMemo, useState } from 'react';
import { Subscription } from '../types';
import { Settings, RefreshCw, ArrowLeft, Calendar, AlertTriangle, FileText, ShieldCheck, Clock, Search, X } from 'lucide-react';
import Modal from '../../ui/Modal';
import { useNotifications } from '../../../hooks/useNotifications';

interface ActiveSubscriptionsProps {
  subscriptions?: Subscription[];
}

const mockSubscriptions: Subscription[] = [
  // Active - freshly renewed
  {
    id: 'sub_SMS_001',
    service: 'SMS Pro',
    planName: 'Flex GO',
    status: 'active',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 355 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    quantity: 1,
  },
  // Active - mid term, multiple seats
  {
    id: 'sub_SMS_002',
    service: 'SMS Pro',
    planName: 'Flex Pro',
    status: 'active',
    startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    quantity: 3,
  },
  // Hosting - active, no auto-renew
  {
    id: 'sub_HOST_101',
    service: 'Hosting',
    planName: 'StartUp',
    status: 'active',
    startDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    quantity: 1,
  },
  // Hosting - pending renewal soon
  {
    id: 'sub_HOST_102',
    service: 'Hosting',
    planName: 'Optimum',
    status: 'pending_renewal',
    startDate: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    quantity: 1,
  },
  // SMS - very close to renewal
  {
    id: 'sub_SMS_003',
    service: 'SMS Pro',
    planName: 'Flex UP',
    status: 'pending_renewal',
    startDate: new Date(Date.now() - 345 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    quantity: 2,
  },
  // Expired - showcase edge case
  {
    id: 'sub_HOST_103',
    service: 'Hosting',
    planName: 'Eco plus',
    status: 'expired',
    startDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: false,
    quantity: 1,
  },
];

const statusStyles: Record<Subscription['status'], string> = {
  active: 'bg-green-100 text-green-700 ring-green-600/10',
  expired: 'bg-gray-100 text-gray-700 ring-gray-600/10',
  pending_renewal: 'bg-yellow-100 text-yellow-700 ring-yellow-600/10',
};

const ActiveSubscriptions: React.FC<ActiveSubscriptionsProps> = ({ subscriptions }) => {
  const AppleLoader: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#6b7280' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <style>{`@keyframes a{0%{opacity:1}100%{opacity:0}}`}</style>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="11" y="1" width="2" height="5" rx="1" fill={color} transform={`rotate(${i * 30} 12 12)`} style={{ opacity: 1, animation: 'a 1.2s linear infinite', animationDelay: `${i * -0.1}s` }} />
      ))}
    </svg>
  );
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'SMS Pro' | 'Hosting'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Subscription['status']>('all');
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addNotification } = useNotifications();
  const [invoiceCount, setInvoiceCount] = useState<number>(3);
  const [isLoadingMoreInvoices, setIsLoadingMoreInvoices] = useState<boolean>(false);

  const data = subscriptions && subscriptions.length > 0 ? subscriptions : mockSubscriptions;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    return data.filter((s) => {
      const matchesQuery =
        s.planName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        s.service.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesService = serviceFilter === 'all' ? true : s.service === serviceFilter;
      const matchesStatus = statusFilter === 'all' ? true : s.status === statusFilter;
      return matchesQuery && matchesService && matchesStatus;
    });
  }, [data, debouncedQuery, serviceFilter, statusFilter]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    // Outer container for padding and background
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Inner container for max-width and centering */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {selectedSub ? (
        <React.Fragment>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedSub(null)}
              className="flex items-center text-sm text-gray-600 hover:text-[#DC0032] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-[#DC0032]" />
              Retour à la liste
            </button>
            <h3 className="text-base font-semibold text-gray-800">Abonnement <span className="text-[#DC0032]">{selectedSub.planName}</span></h3>
            <div />
          </div>

          {/* Header status and chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              selectedSub.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' :
              selectedSub.status === 'pending_renewal' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
              'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
              {selectedSub.status === 'active' && 'Actif'}
              {selectedSub.status === 'pending_renewal' && 'À renouveler'}
              {selectedSub.status === 'expired' && 'Expiré'}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{selectedSub.service}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 break-all">{selectedSub.id}</span>
            {selectedSub.quantity > 1 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{selectedSub.quantity} licences</span>
            )}
          </div>

          

          {/* Alerts */}
          {selectedSub.status !== 'active' && (
            <div className={`mb-5 p-3 rounded border text-sm ${selectedSub.status === 'expired' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
              {selectedSub.status === 'expired' ? 'Cet abonnement est expiré. Renouvelez pour rétablir le service.' : 'Cet abonnement arrive à expiration. Pensez à le renouveler.'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key info column (ID removed here, moved to chips above) */}
            {(() => {
              const end = new Date(selectedSub.endDate).getTime();
              const now = Date.now();
              const daysRemaining = Math.max(Math.ceil((end - now) / (24 * 60 * 60 * 1000)), 0);
              const lastInvoice = `${selectedSub.id}-3`;
              return (
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded p-3">
                    <div className="text-gray-500 text-xs flex items-center mb-1"><Calendar className="w-3.5 h-3.5 mr-1" /> Renouvellement</div>
                    <div className="text-sm font-semibold text-gray-800">{formatDate(selectedSub.endDate)}</div>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <div className="text-gray-500 text-xs flex items-center mb-1"><Clock className="w-3.5 h-3.5 mr-1" /> Jours restants</div>
                    <div className={`text-sm font-semibold ${daysRemaining <= 15 ? 'text-red-600' : daysRemaining <= 45 ? 'text-yellow-700' : 'text-gray-800'}`}>{daysRemaining} jours</div>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <div className="text-gray-500 text-xs flex items-center mb-1"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Auto-renouv.</div>
                    <div className="text-sm font-semibold text-gray-800">{selectedSub.autoRenew ? 'Activé' : 'Désactivé'}</div>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <div className="text-gray-500 text-xs flex items-center mb-1"><FileText className="w-3.5 h-3.5 mr-1" /> Dernière facture</div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-800">#{lastInvoice}</div>
                      <button
                        onClick={() => addNotification('info', 'Facture', `Ouverture facture #${lastInvoice} (simulation).`, 2000)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                      >
                        Ouvrir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Right column: Period + Usage */}
          <div>
            {/* Période */}
            {(() => {
              const start = new Date(selectedSub.startDate).getTime();
              const end = new Date(selectedSub.endDate).getTime();
              const now = Date.now();
              const total = Math.max(end - start, 1);
              const elapsed = Math.min(Math.max(now - start, 0), total);
              const pct = Math.round((elapsed / total) * 100);
              const daysRemaining = Math.max(Math.ceil((end - now) / (24 * 60 * 60 * 1000)), 0);
              return (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Période</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Début: {formatDate(selectedSub.startDate)}</span>
                    <span>Fin: {formatDate(selectedSub.endDate)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded">
                    <div className={`h-2 rounded ${daysRemaining <= 15 ? 'bg-red-500' : daysRemaining <= 45 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-600 flex items-center justify-between">
                    <span>{daysRemaining} jours restants</span>
                    {daysRemaining <= 15 && (
                      <span className="text-red-600">Renouvelez avant {formatDate(selectedSub.endDate)}</span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Utilisation */}
            <div className="mt-0">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Utilisation</h4>
              {selectedSub.service === 'SMS Pro' ? (
                <div className="space-y-3">
                  {(() => {
                    const quota = selectedSub.planName.includes('Flex') ? 500 : 250;
                    const used = Math.min(Math.round(quota * 0.36 + (selectedSub.quantity - 1) * 50), quota);
                    const pct = Math.round((used / quota) * 100);
                    return (
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>SMS utilisés</span>
                          <span>{used} / {quota}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded">
                          <div className={`h-2 rounded ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-primary-red'}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="border border-gray-200 rounded p-3">
                    <div className="text-gray-500">CPU</div>
                    <div className="font-semibold text-gray-800">30% utilisé</div>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <div className="text-gray-500">Mémoire</div>
                    <div className="font-semibold text-gray-800">42% utilisé</div>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <div className="text-gray-500">Stockage</div>
                    <div className="font-semibold text-gray-800">18% utilisé</div>
                  </div>
                </div>
              )}
            </div>

          {/* Plan change (mock) */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Changer d’offre</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md flex-1"
              >
                <option value="">Sélectionner une offre…</option>
                {selectedSub.service === 'SMS Pro' ? (
                  <>
                    <option>Flex UP</option>
                    <option>Flex GO</option>
                    <option>Flex Pro</option>
                  </>
                ) : (
                  <>
                    <option>Eco plus</option>
                    <option>StartUp</option>
                    <option>Optimum</option>
                    <option>NoLimit</option>
                  </>
                )}
              </select>
              <button
                disabled={!selectedPlan || isProcessing}
                onClick={() => {
                  if (!selectedPlan) return;
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                  }, 800);
                }}
                className="px-4 py-2.5 text-sm bg-primary-red text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c40029]"
              >
                Appliquer le changement
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => addNotification('success', 'Renouvellement', 'Renouvellement simulé avec succès.', 3000)}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#DC0032] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#c40029] transition-colors"
              title="Renouveler"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Renouveler</span>
            </button>
            <button
              className={`w-full inline-flex items-center justify-center gap-1.5 border px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedSub.autoRenew ? 'border-green-300 text-green-700 hover:bg-green-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => {
                setSelectedSub({ ...selectedSub, autoRenew: !selectedSub.autoRenew });
                addNotification('info', 'Renouv. automatique', selectedSub.autoRenew ? 'Renouvellement automatique désactivé.' : 'Renouvellement automatique activé.', 2500);
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{selectedSub.autoRenew ? 'Auto-renouv. OFF' : 'Auto-renouv. ON'}</span>
            </button>
            <button
              onClick={() => addNotification('info', 'Factures', 'Ouverture des factures liées (simulation).', 2000)}
              className="w-full inline-flex items-center justify-center gap-1.5 border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              title="Factures"
            >
              <FileText className="w-4 h-4" />
              <span>Factures</span>
            </button>
            <div className="sm:col-span-3">
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Annuler l’abonnement
              </button>
            </div>
          </div>
          </div>
          </div>{/* end grid */}

          {/* Billing history (mock) full width */}
          <div className="mt-4 md:mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Historique de facturation</h4>
            <div className="border border-gray-200 rounded-md divide-y">
              {Array.from({ length: invoiceCount }).map((_, idx) => (
                <div key={idx} className="p-3 text-sm flex items-center justify-between">
                  <div className="text-gray-700">Facture #{selectedSub.id}-{idx + 1}</div>
                  <div className="text-gray-500">{formatDate(selectedSub.startDate)}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-center">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                onClick={() => {
                  setIsLoadingMoreInvoices(true);
                  setTimeout(() => {
                    setInvoiceCount((c) => c + 3);
                    setIsLoadingMoreInvoices(false);
                  }, 800);
                }}
                disabled={isLoadingMoreInvoices}
              >
                {isLoadingMoreInvoices && <AppleLoader />}
                <span>{isLoadingMoreInvoices ? 'Chargement…' : 'Charger plus'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cancel confirmation modal */}
        <Modal isOpen={showCancelConfirm} onClose={() => setShowCancelConfirm(false)} title="Confirmer l’annulation" size="md">
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <p>
                Êtes-vous sûr de vouloir annuler cet abonnement (<span className="font-medium">{selectedSub?.planName}</span>) ? L’accès au service pourra être interrompu.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    setShowCancelConfirm(false);
                  }, 800);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isProcessing}
              >
                Confirmer
              </button>
            </div>
          </div>
        </Modal>
        </React.Fragment>
      ) : (
        <>
          {/* Filters and Search Card */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher (offre, service, ID)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md"
                  aria-label="Rechercher des abonnements"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Status Filters */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                <span className="text-sm font-medium text-gray-500 mr-2 flex-shrink-0">Statut:</span>
                {(['all', 'active', 'pending_renewal', 'expired'] as const).map((status) => {
                  const isActive = statusFilter === status;
                  const getStatusInfo = (status: string) => {
                    switch (status) {
                      case 'active': return { text: 'Actif', color: 'bg-green-100 text-green-700', ring: 'ring-green-600/10' };
                      case 'pending_renewal': return { text: 'À renouveler', color: 'bg-yellow-100 text-yellow-700', ring: 'ring-yellow-600/10' };
                      case 'expired': return { text: 'Expiré', color: 'bg-gray-100 text-gray-700', ring: 'ring-gray-600/10' };
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
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Offre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Début</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fin</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Renouv. auto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70 transition-colors cursor-pointer" onClick={() => setSelectedSub(s)}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.service}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.planName}{s.quantity > 1 ? ` ×${s.quantity}` : ''}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(s.startDate)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(s.endDate)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.autoRenew ? 'Oui' : 'Non'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusStyles[s.status]}`}>
                        {s.status === 'active' && 'Actif'}
                        {s.status === 'pending_renewal' && 'À renouveler'}
                        {s.status === 'expired' && 'Expiré'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-1.5 rounded-md border border-transparent text-gray-600 hover:text-[#DC0032] hover:bg-gray-100"
                          onClick={() => setSelectedSub(s)}
                          title="Gérer"
                          aria-label={`Gérer abonnement ${s.id}`}
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        {s.status !== 'active' && (
                          <button
                            className="p-1.5 rounded-md border border-transparent text-gray-600 hover:text-[#DC0032] hover:bg-gray-100"
                            onClick={() => setSelectedSub(s)}
                            title="Renouveler"
                            aria-label={`Renouveler abonnement ${s.id}`}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500 text-sm">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 mx-auto text-gray-300 mb-3">
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="font-medium mb-1 text-gray-900">Aucun abonnement</p>
                        <p className="text-sm text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ActiveSubscriptions;


