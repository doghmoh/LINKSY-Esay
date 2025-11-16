import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, LogIn, Search, PlusCircle } from 'lucide-react';
import LoadingButton from '../../components/ui/LoadingButton';
import StatusBadge from '../../components/ui/StatusBadge';
import HostingDetails from '../../components/hosting/HostingDetails';

// Define possible statuses for clarity and filtering
type HostingStatus = 'active' | 'suspended' | 'disabled';

interface HostingEntry {
  id: number;
  domain: string;
  username: string;
  infrastructure: string;
  location: 'DZ' | 'FR' | 'CA';
  type: 'Shared' | 'VPS' | 'Litespeed' | 'Dedicated';
  platform: 'cPanel' | 'CloudPanel' | 'N0C';
  status: HostingStatus; // Use the defined type
}

// Mock Data (remains the same)
const mockHostingData: HostingEntry[] = [
  { id: 1, domain: 'example-dz.com', username: 'userdz01', infrastructure: 'SRV-ALG-01', location: 'DZ', type: 'Shared', platform: 'cPanel', status: 'active' },
  { id: 2, domain: 'mybusiness.fr', username: 'profr75', infrastructure: 'VPS-PAR-12', location: 'FR', type: 'VPS', platform: 'CloudPanel', status: 'active' },
  { id: 3, domain: 'dev-project.ca', username: 'devca_xyz', infrastructure: 'SRV-MTL-05', location: 'CA', type: 'Litespeed', platform: 'cPanel', status: 'suspended' },
  { id: 4, domain: 'legacy-app.dz', username: 'legacy00', infrastructure: 'DED-ALG-03', location: 'DZ', type: 'Dedicated', platform: 'N0C', status: 'disabled' },
  { id: 5, domain: 'another-site.fr', username: 'sitefr99', infrastructure: 'SHARED-LYN-8', location: 'FR', type: 'Shared', platform: 'cPanel', status: 'active' },
  { id: 6, domain: 'test-suspend.com', username: 'susp01', infrastructure: 'VPS-ALG-02', location: 'DZ', type: 'VPS', platform: 'CloudPanel', status: 'suspended' },
];

// Helper functions (getLocationFlag, getStatusBadge remain the same)
const getLocationFlag = (location: 'DZ' | 'FR' | 'CA') => {
  switch (location) {
    case 'DZ': return '🇩🇿 Algeria';
    case 'FR': return '🇫🇷 France';
    case 'CA': return '🇨🇦 Canada';
    default: return '';
  }
};

// Define filter options type
type StatusFilter = 'all' | HostingStatus; // 'all' | 'active' | 'suspended' | 'disabled'

const ManageHosting: React.FC = () => {
  const [selectedHosting, setSelectedHosting] = useState<HostingEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all'); // State for status filter
  const navigate = useNavigate();

  // Filter data based on search term and status filter
  const filteredHostingData = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return mockHostingData.filter(hosting => {
      // Check search term match (domain, username, infrastructure)
      const searchMatch =
        hosting.domain.toLowerCase().includes(lowerCaseSearchTerm) ||
        hosting.username.toLowerCase().includes(lowerCaseSearchTerm) ||
        hosting.infrastructure.toLowerCase().includes(lowerCaseSearchTerm);

      // Check status match
      const statusMatch = statusFilter === 'all' || hosting.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [searchTerm, statusFilter, mockHostingData]); // Add statusFilter to dependencies

  const handleConnect = (e: React.MouseEvent, platform: string, domain: string) => {
    e.stopPropagation();
    alert(`Connexion à ${platform} pour ${domain}... (simulation)`);
  };

  const handleRowClick = (hosting: HostingEntry) => {
    setSelectedHosting(hosting);
  };

  const handleBackToList = () => {
    setSelectedHosting(null);
  };

  const handleBuyNewHosting = () => {
    navigate('/facturation?category=hosting');
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {selectedHosting ? (
          <HostingDetails hosting={selectedHosting} onBack={handleBackToList} />
        ) : (
          <>
            {/* Filters and Search Card */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Rechercher (domaine, user, infra...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md"
                    aria-label="Rechercher des hébergements"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Filters */}
                <div className="flex items-center space-x-2 overflow-x-auto">
                  <span className="text-sm font-medium text-gray-500 mr-2 flex-shrink-0">Statut:</span>
                  {(['all', 'active', 'suspended', 'disabled'] as const).map((status) => {
                    const isActive = statusFilter === status;
                    const getStatusInfo = (status: string) => {
                      switch (status) {
                        case 'active': return { text: 'Actif', color: 'bg-green-100 text-green-700', ring: 'ring-green-600/10' };
                        case 'suspended': return { text: 'Suspendu', color: 'bg-yellow-100 text-yellow-700', ring: 'ring-yellow-600/10' };
                        case 'disabled': return { text: 'Désactivé', color: 'bg-gray-100 text-gray-700', ring: 'ring-gray-600/10' };
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
                
                {/* Buy Button */}
                <LoadingButton
                  variant="primary"
                  size="md"
                  onClick={handleBuyNewHosting}
                  className="flex-shrink-0"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Acheter un nouvel hébergement
                </LoadingButton>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domaines</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom d'utilisateur</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Infrastructure</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Localisation</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plateforme</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHostingData.length > 0 ? (
                      filteredHostingData.map((hosting) => (
                        <tr
                          key={hosting.id}
                          className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                          onClick={() => handleRowClick(hosting)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{hosting.domain}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{hosting.username}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{hosting.infrastructure}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{getLocationFlag(hosting.location)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{hosting.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{hosting.platform}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <StatusBadge 
                              status={hosting.status as any} 
                              size="sm" 
                            />
                          </td>
                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => handleConnect(e, hosting.platform, hosting.domain)}
                                className="p-1.5 rounded-md border border-transparent text-gray-600 hover:text-[#DC0032] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={hosting.status === 'disabled'}
                                title={hosting.status === 'disabled' ? 'Hébergement désactivé' : `Se connecter à ${hosting.platform}`}
                                aria-label={`Se connecter à ${hosting.platform} pour ${hosting.domain}`}
                              >
                                <LogIn className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-6 text-center text-gray-500 text-sm">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 mx-auto text-gray-300 mb-3">
                              <Server className="w-full h-full" />
                            </div>
                            <p className="font-medium mb-1 text-gray-900">
                              {searchTerm || statusFilter !== 'all' ? 'Aucun hébergement trouvé' : 'Aucun hébergement'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {searchTerm || statusFilter !== 'all' ? 'Essayez de modifier vos critères de recherche' : 'Commencez par acheter votre premier hébergement'}
                            </p>
                            {!searchTerm && statusFilter === 'all' && (
                              <button
                                onClick={handleBuyNewHosting}
                                className="mt-3 inline-flex items-center px-4 py-2 bg-[#DC0032] text-white text-sm font-medium rounded-md hover:bg-[#c40029] transition-colors"
                              >
                                <PlusCircle size={16} className="mr-2" />
                                Acheter un hébergement
                              </button>
                            )}
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

export default ManageHosting;
