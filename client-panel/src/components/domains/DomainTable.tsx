import React from 'react';
import { Globe, Calendar, ShieldCheck, ShieldOff, Lock, Unlock, Settings, ArrowRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'; // Added icons
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../ui/EmptyState';

export interface DomainEntry {
  id: number;
  domainName: string;
  nextBillingDate: string; // Or Date object
  status: 'active' | 'expired' | 'closed' | 'suspended'; // Added suspended
  isProtected: boolean;
  isLocked: boolean;
}

interface DomainTableProps {
  domains: DomainEntry[];
  onManageClick: (domainId: number) => void; // Keep for the button
  onRowClick: (domain: DomainEntry) => void; // Prop for row click (now passes domain object)
}

// Helper function for Protection ID Icon
const getProtectionIcon = (isProtected: boolean) => {
  return isProtected ? (
    <span className="inline-flex items-center text-green-600" title="Protection ID Active">
      <ShieldCheck size={18} className="mr-1" /> Oui
    </span>
  ) : (
    <span className="inline-flex items-center text-red-600" title="Protection ID Inactive">
      <ShieldOff size={18} className="mr-1" /> Non
    </span>
  );
};

// Helper function for Lock Status Icon
const getLockIcon = (isLocked: boolean) => {
  return isLocked ? (
    <span className="inline-flex items-center text-orange-600" title="Domaine Verrouillé (Non transférable)">
      <Lock size={18} className="mr-1" /> Verrouillé
    </span>
  ) : (
    <span className="inline-flex items-center text-blue-600" title="Domaine Déverrouillé (Transférable)">
      <Unlock size={18} className="mr-1" /> Déverrouillé
    </span>
  );
};


const DomainTable: React.FC<DomainTableProps> = ({ domains, onManageClick, onRowClick }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domaines</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prochaine facture</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Protection ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verrouillage</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {domains.length > 0 ? (
              domains.map((domain) => (
                <tr
                  key={domain.id}
                  className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  onClick={() => onRowClick(domain)}
                  title={`Voir les détails pour ${domain.domainName}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{domain.domainName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{domain.nextBillingDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge 
                      status={domain.status as any} 
                      size="sm" 
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{getProtectionIcon(domain.isProtected)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{getLockIcon(domain.isLocked)}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageClick(domain.id);
                        }}
                        className="p-1.5 rounded-md border border-transparent text-gray-600 hover:text-[#DC0032] hover:bg-gray-100"
                        title={`Gérer les paramètres avancés pour ${domain.domainName}`}
                        aria-label={`Gérer les paramètres avancés pour ${domain.domainName}`}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto text-gray-300 mb-3">
                      <Globe className="w-full h-full" />
                    </div>
                    <p className="font-medium mb-1 text-gray-900">Aucun domaine trouvé</p>
                    <p className="text-sm text-gray-500">Commencez par acheter votre premier domaine</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DomainTable;

// Exporting the interface for use in DomainDetails
export type { DomainEntry };
