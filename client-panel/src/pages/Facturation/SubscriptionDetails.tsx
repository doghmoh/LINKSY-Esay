import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, RefreshCw, ArrowLeft, Calendar, Hash, Repeat } from 'lucide-react';

const SubscriptionDetails: React.FC = () => {
  const { subId } = useParams();
  const navigate = useNavigate();

  // Placeholder mock data; in real use, fetch by subId
  const sub = {
    id: subId || 'unknown',
    service: 'SMS Pro',
    planName: 'Flex GO',
    status: 'active' as 'active' | 'expired' | 'pending_renewal',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 345 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: true,
    quantity: 1,
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-600 hover:text-[#DC0032] transition-colors group"
            aria-label="Retour"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-[#DC0032]" />
            Retour
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Gérer l’abonnement <span className="text-[#DC0032]">{sub.planName}</span>
          </h1>
          <div />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center">
              <Settings className="w-4 h-4 mr-2 text-[#DC0032]" /> Détails
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 flex items-center">
                  <Hash className="w-3.5 h-3.5 mr-2 text-gray-400" /> ID
                </dt>
                <dd className="font-medium text-gray-800">{sub.id}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500">Service</dt>
                <dd className="font-medium text-gray-800">{sub.service}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500">Offre</dt>
                <dd className="font-medium text-gray-800">{sub.planName}{sub.quantity > 1 ? ` ×${sub.quantity}` : ''}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" /> Début
                </dt>
                <dd className="font-medium text-gray-800">{formatDate(sub.startDate)}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" /> Fin
                </dt>
                <dd className="font-medium text-gray-800">{formatDate(sub.endDate)}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-500 flex items-center">
                  <Repeat className="w-3.5 h-3.5 mr-2 text-gray-400" /> Renouv. auto
                </dt>
                <dd className="font-medium text-gray-800">{sub.autoRenew ? 'Activé' : 'Désactivé'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 text-[#DC0032]" /> Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-[#DC0032] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#c40029] transition-colors">
                Renouveler maintenant
              </button>
              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                Activer/Désactiver renouv. auto
              </button>
              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                Voir factures liées
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;


