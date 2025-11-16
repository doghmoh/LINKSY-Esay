import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DomainTable, { DomainEntry } from '../../components/domains/DomainTable';
import DomainDetails from '../../components/domains/DomainDetails';
import { PlusCircle, Search } from 'lucide-react';
import LoadingButton from '../../components/ui/LoadingButton';
import { mockDomainData } from '../../utils/mockDomainData';
import { DomainDetailsType } from '../../components/domains/DomainDetails';

// Define possible statuses for clarity and filtering
type DomainStatus = 'active' | 'suspended' | 'expired' | 'closed';

// Define enhanced filter options type including specific statuses
type StatusFilter = 'all' | DomainStatus; // 'all' | 'active' | 'suspended' | 'expired' | 'closed'

const ManageDomains: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState<DomainDetailsType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all'); // State for status filter

  // Filter data based on search term and specific status filter
  const filteredDomainData = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return mockDomainData.filter(domain => {
      // Check search term match
      const nameMatch = domain.domainName.toLowerCase().includes(lowerCaseSearchTerm);

      // Check status match - now filters by specific status if not 'all'
      const statusMatch = statusFilter === 'all' || domain.status === statusFilter;

      return nameMatch && statusMatch;
    });
  }, [searchTerm, statusFilter, mockDomainData]); // Dependencies: searchTerm, statusFilter, mockData

  // Helper function to generate comprehensive domain details
  const generateDomainDetails = (domain: DomainEntry): DomainDetailsType => {
    const now = new Date();
    const registrationDate = new Date(now.getFullYear() - 1, now.getMonth() + (domain.id % 12), (domain.id % 28) + 1);
    const expirationDate = new Date(registrationDate.getFullYear() + 1, registrationDate.getMonth(), registrationDate.getDate());
    const daysUntilExpiration = Math.max(0, Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Adjust dates based on status for more realistic data
    let adjustedExpirationDate = expirationDate;
    let adjustedDaysUntilExpiration = daysUntilExpiration;
    
    if (domain.status === 'expired') {
      adjustedExpirationDate = new Date(now.getTime() - (30 + (domain.id % 30)) * 24 * 60 * 60 * 1000);
      adjustedDaysUntilExpiration = 0;
    } else if (domain.status === 'suspended') {
      adjustedExpirationDate = new Date(now.getTime() + (15 + (domain.id % 15)) * 24 * 60 * 60 * 1000);
      adjustedDaysUntilExpiration = Math.max(0, Math.ceil((adjustedExpirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // Determine payment method and amounts based on domain
    const paymentMethods = ['Carte de crédit', 'PayPal', 'Virement bancaire', 'Carte de débit'];
    const paymentMethod = paymentMethods[domain.id % paymentMethods.length];
    
    // Calculate amounts based on domain type and status
    const baseAmount = domain.domainName.includes('.dz') ? 8.50 : 12.00;
    const initialAmount = baseAmount + (domain.id % 5);
    const recurringAmount = baseAmount + (domain.id % 3);

    // Set next bill date based on status
    let nextBillDate = domain.nextBillingDate;
    if (domain.status === 'expired' || domain.status === 'closed') {
      nextBillDate = 'N/A';
    }

    // Generate comprehensive domain data
    const registrars = ['LINKSY', 'GoDaddy', 'Namecheap', 'Cloudflare', 'OVH'];
    const registrar = registrars[domain.id % registrars.length];

    // Generate name servers
    const nameServers = [
      { id: 1, server: `ns1.${registrar.toLowerCase()}.com`, ip: `192.168.${domain.id % 255}.1` },
      { id: 2, server: `ns2.${registrar.toLowerCase()}.com`, ip: `192.168.${domain.id % 255}.2` },
      { id: 3, server: `ns3.${registrar.toLowerCase()}.com`, ip: `192.168.${domain.id % 255}.3` },
    ];

    // Generate DNS records
    const dnsRecords = [
      { id: 1, type: 'A', name: domain.domainName, value: `192.168.${domain.id % 255}.10`, ttl: 3600 },
      { id: 2, type: 'CNAME', name: `www.${domain.domainName}`, value: domain.domainName, ttl: 3600 },
      { id: 3, type: 'MX', name: domain.domainName, value: `mail.${domain.domainName}`, ttl: 3600 },
      { id: 4, type: 'TXT', name: domain.domainName, value: `v=spf1 include:_spf.${registrar.toLowerCase()}.com ~all`, ttl: 3600 },
      { id: 5, type: 'A', name: `mail.${domain.domainName}`, value: `192.168.${domain.id % 255}.20`, ttl: 3600 },
    ];

    // Generate SSL certificate info
    const sslStatuses: Array<'active' | 'expired' | 'pending'> = ['active', 'expired', 'pending'];
    const sslStatus = sslStatuses[domain.id % sslStatuses.length];
    const sslExpiryDate = new Date(now.getTime() + (30 + (domain.id % 365)) * 24 * 60 * 60 * 1000);

    // Generate contact info
    const contactEmails = [
      'admin@example.com',
      'contact@business.com',
      'support@company.org',
      'info@website.net'
    ];

    // Generate enhanced analytics data
    const analytics = {
      monthlyVisits: Math.floor(Math.random() * 50000) + 1000,
      bounceRate: Math.floor(Math.random() * 40) + 20,
      avgSessionDuration: `${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      topCountries: [
        { country: 'France', visits: Math.floor(Math.random() * 10000) + 1000, percentage: Math.floor(Math.random() * 30) + 20 },
        { country: 'Algérie', visits: Math.floor(Math.random() * 8000) + 500, percentage: Math.floor(Math.random() * 25) + 15 },
        { country: 'Canada', visits: Math.floor(Math.random() * 5000) + 300, percentage: Math.floor(Math.random() * 20) + 10 },
      ],
      trafficSources: [
        { source: 'Recherche organique', visits: Math.floor(Math.random() * 15000) + 2000, percentage: Math.floor(Math.random() * 40) + 30 },
        { source: 'Réseaux sociaux', visits: Math.floor(Math.random() * 8000) + 1000, percentage: Math.floor(Math.random() * 25) + 15 },
        { source: 'Direct', visits: Math.floor(Math.random() * 6000) + 500, percentage: Math.floor(Math.random() * 20) + 10 },
      ],
    };

    // Generate security data
    const security = {
      dnssecEnabled: domain.id % 3 === 0,
      twoFactorAuth: domain.id % 2 === 0,
      loginAttempts: Math.floor(Math.random() * 20) + 1,
      lastSecurityScan: new Date(now.getTime() - (domain.id % 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      threatsDetected: Math.floor(Math.random() * 5),
      firewallStatus: domain.id % 4 === 0 ? 'inactive' as const : 'active' as const,
    };

    // Generate marketplace data
    const marketplace = {
      estimatedValue: Math.floor(Math.random() * 50000) + 1000,
      marketTrend: ['up', 'down', 'stable'][domain.id % 3] as 'up' | 'down' | 'stable',
      similarDomains: [
        { domain: `similar${domain.id}-1.com`, price: Math.floor(Math.random() * 10000) + 500, status: 'Disponible' },
        { domain: `similar${domain.id}-2.net`, price: Math.floor(Math.random() * 15000) + 1000, status: 'Vendu' },
        { domain: `similar${domain.id}-3.org`, price: Math.floor(Math.random() * 8000) + 300, status: 'En vente' },
      ],
      auctionStatus: domain.id % 5 === 0 ? 'active' as const : domain.id % 7 === 0 ? 'sold' as const : 'none' as const,
    };

    // Generate transfer data
    const transfer = {
      unlockCode: `UNLOCK${domain.id.toString().padStart(6, '0')}`,
      transferStatus: domain.isLocked ? 'locked' as const : 'unlocked' as const,
      authCode: `AUTH${domain.id.toString().padStart(8, '0')}`,
    };

    // Generate backup data
    const backup = {
      lastBackup: new Date(now.getTime() - (domain.id % 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      backupFrequency: ['daily', 'weekly', 'monthly'][domain.id % 3] as 'daily' | 'weekly' | 'monthly',
      backupSize: `${(Math.random() * 100 + 10).toFixed(1)} MB`,
      restorePoints: Math.floor(Math.random() * 10) + 1,
    };

    // Generate monitoring data
    const monitoring = {
      uptime: Math.floor(Math.random() * 5) + 95,
      responseTime: Math.floor(Math.random() * 200) + 50,
      lastDown: domain.id % 10 === 0 ? new Date(now.getTime() - (domain.id % 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 'Jamais',
      alertsEnabled: domain.id % 3 !== 0,
      monitoringPoints: [
        { location: 'Paris, France', status: 'up' as const, responseTime: Math.floor(Math.random() * 100) + 20 },
        { location: 'Alger, Algérie', status: 'up' as const, responseTime: Math.floor(Math.random() * 150) + 30 },
        { location: 'Montreal, Canada', status: domain.id % 8 === 0 ? 'down' as const : 'up' as const, responseTime: Math.floor(Math.random() * 200) + 50 },
      ],
    };

    return {
      ...domain,
      registrationDate: registrationDate.toISOString().split('T')[0],
      expirationDate: adjustedExpirationDate.toISOString().split('T')[0],
      daysUntilExpiration: adjustedDaysUntilExpiration,
      nextBillDate: nextBillDate,
      paymentMethod: paymentMethod,
      initialAmount: initialAmount,
      recurringAmount: recurringAmount,
      autoRenew: domain.status === 'active',
      registrar: registrar,
      whoisPrivacy: domain.isProtected,
      dnsManagement: true,
      emailForwarding: domain.status === 'active',
      subdomains: domain.id % 10,
      nameServers: nameServers,
      dnsRecords: dnsRecords,
      sslCertificate: {
        status: sslStatus,
        issuer: sslStatus === 'active' ? 'Let\'s Encrypt' : 'Self-Signed',
        expiryDate: sslExpiryDate.toISOString().split('T')[0],
      },
      lastUpdated: new Date(now.getTime() - (domain.id % 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contactInfo: {
        registrant: contactEmails[domain.id % contactEmails.length],
        admin: contactEmails[(domain.id + 1) % contactEmails.length],
        tech: contactEmails[(domain.id + 2) % contactEmails.length],
      },
      analytics,
      security,
      marketplace,
      transfer,
      backup,
      monitoring,
    };
  };

  const handleManageClick = (domainId: number) => {
    console.log(`Navigate to ADVANCED settings for domain ID: ${domainId}`);
    alert(`Gestion AVANCÉE pour le domaine ID: ${domainId} (page à créer)`);
    // Example navigation: navigate(`/domains/advanced/${domainId}`);
  };

  const handleRowClick = (domain: DomainEntry) => {
    const domainDetails = generateDomainDetails(domain);
    setSelectedDomain(domainDetails);
  };

  const handleBackToList = () => {
    setSelectedDomain(null);
  };

  const handleBuyNewDomain = () => {
    navigate('/facturation?category=domain');
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {selectedDomain ? (
          <DomainDetails domain={selectedDomain} onClose={handleBackToList} />
        ) : (
          <>
            {/* Filters and Search Card */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md"
                    aria-label="Rechercher des domaines"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Filters */}
                <div className="flex items-center space-x-2 overflow-x-auto">
                  <span className="text-sm font-medium text-gray-500 mr-2 flex-shrink-0">Statut:</span>
                  {(['all', 'active', 'suspended', 'expired', 'closed'] as const).map((status) => {
                    const isActive = statusFilter === status;
                    const getStatusInfo = (status: string) => {
                      switch (status) {
                        case 'active': return { text: 'Actif', color: 'bg-green-100 text-green-700', ring: 'ring-green-600/10' };
                        case 'suspended': return { text: 'Suspendu', color: 'bg-yellow-100 text-yellow-700', ring: 'ring-yellow-600/10' };
                        case 'expired': return { text: 'Expiré', color: 'bg-red-100 text-red-700', ring: 'ring-red-600/10' };
                        case 'closed': return { text: 'Fermé', color: 'bg-gray-100 text-gray-700', ring: 'ring-gray-600/10' };
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
                  onClick={handleBuyNewDomain}
                  className="flex-shrink-0"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Acheter un nouveau domaine
                </LoadingButton>
              </div>
            </div>

            {/* Domain Table */}
            <DomainTable
              domains={filteredDomainData} // Use filtered data
              onManageClick={handleManageClick}
              onRowClick={handleRowClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ManageDomains;
