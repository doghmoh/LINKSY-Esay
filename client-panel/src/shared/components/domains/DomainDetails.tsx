import React, { useState } from 'react';
import { 
  Calendar, AlertTriangle, Clock, CreditCard, RefreshCw, Power, Trash2, X, Info, CheckCircle, XCircle, 
  ArrowLeft, Globe, Tag, Database, Edit3, Save, Shield, Lock, Unlock, ShieldCheck, 
  Server, Users, Activity, ExternalLink, Copy, Key,
  Settings
} from 'lucide-react';
import { DomainEntry } from './DomainTable';
import { Switch } from '../sms/Switch';

// Enhanced domain details interface
export interface DomainDetailsType extends DomainEntry {
    registrationDate: string;
    expirationDate: string;
    daysUntilExpiration: number;
    nextBillDate: string;
    paymentMethod: string;
    initialAmount: number;
    recurringAmount: number;
  autoRenew: boolean;
  registrar: string;
  whoisPrivacy: boolean;
  dnsManagement: boolean;
  emailForwarding: boolean;
  subdomains: number;
  nameServers: Array<{
    id: number;
    server: string;
    ip?: string;
  }>;
  dnsRecords: Array<{
    id: number;
    type: string;
    name: string;
    value: string;
    ttl: number;
  }>;
  sslCertificate: {
    status: 'active' | 'expired' | 'pending';
    issuer: string;
    expiryDate: string;
  };
  lastUpdated: string;
  contactInfo: {
    registrant: string;
    admin: string;
    tech: string;
  };
  // Enhanced features
  analytics: {
    monthlyVisits: number;
    bounceRate: number;
    avgSessionDuration: string;
    topCountries: Array<{ country: string; visits: number; percentage: number }>;
    trafficSources: Array<{ source: string; visits: number; percentage: number }>;
  };
  security: {
    dnssecEnabled: boolean;
    twoFactorAuth: boolean;
    loginAttempts: number;
    lastSecurityScan: string;
    threatsDetected: number;
    firewallStatus: 'active' | 'inactive';
  };
  marketplace: {
    estimatedValue: number;
    marketTrend: 'up' | 'down' | 'stable';
    similarDomains: Array<{ domain: string; price: number; status: string }>;
    auctionStatus: 'none' | 'active' | 'sold';
  };
  transfer: {
    unlockCode: string;
    transferStatus: 'locked' | 'unlocked' | 'pending';
    transferDate?: string;
    authCode: string;
  };
  backup: {
    lastBackup: string;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupSize: string;
    restorePoints: number;
  };
  monitoring: {
    uptime: number;
    responseTime: number;
    lastDown: string;
    alertsEnabled: boolean;
    monitoringPoints: Array<{ location: string; status: 'up' | 'down'; responseTime: number }>;
  };
}

interface DomainDetailsProps {
  domain: DomainDetailsType;
  onBack: () => void;
}

// Helper function for Status Badge (can be reused or adapted)
const getStatusBadge = (status: 'active' | 'expired' | 'closed' | 'suspended') => { // Added suspended
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" /> Actif
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <XCircle className="w-3 h-3 mr-1" /> Expiré
        </span>
      );
    case 'closed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          <XCircle className="w-3 h-3 mr-1" /> Fermé
        </span>
      );
    case 'suspended': // Added suspended style
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" /> Suspendu
          </span>
        );
    default:
      return null;
  }
};

// Reusable components
const SectionContainer: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode; actionButton?: React.ReactNode }> = 
({ icon: Icon, title, children, actionButton }) => (
  <div className="border border-gray-200 rounded p-3">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center">
        <Icon size={16} className="mr-2 text-[#DC0032]" /> {title}
      </h4>
      {actionButton}
    </div>
    {children}
  </div>
);

  const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0">
      <dt className="text-gray-500 flex items-center text-sm">
        <Icon size={14} className="mr-2 text-gray-400 flex-shrink-0" />
        {label}
      </dt>
      <dd className="text-gray-800 font-medium text-sm text-right">{value}</dd>
    </div>
  );

const DomainDetails: React.FC<DomainDetailsProps> = ({ domain, onBack }) => {
  const [isAutoRenewEnabled, setIsAutoRenewEnabled] = useState(domain.autoRenew);
  const [isEditingNS, setIsEditingNS] = useState(false);
  const [currentNameServers, setCurrentNameServers] = useState(domain.nameServers);
  const [isEditingDNS, setIsEditingDNS] = useState(false);
  const [currentDNSRecords, setCurrentDNSRecords] = useState(domain.dnsRecords);
  const [activeTab, setActiveTab] = useState('overview');

  const handleDisableDomain = () => {
    alert(`Désactivation du domaine ${domain.domainName}... (simulation)`);
  };

  const handleDeleteDomain = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le domaine ${domain.domainName} ? Cette action est irréversible.`)) {
      alert(`Suppression du domaine ${domain.domainName}... (simulation)`);
      onBack();
    }
  };

  const validateNameServers = (servers: Array<{ id: number; server: string; ip?: string }>) => {
    const errors: string[] = [];
    
    if (servers.length === 0) {
      errors.push('Au moins un serveur de noms est requis');
    }
    
    servers.forEach((ns, index) => {
      if (!ns.server.trim()) {
        errors.push(`Le serveur de noms ${index + 1} ne peut pas être vide`);
      }
    });
    
    return errors;
  };

  const handleSaveNameServers = () => {
    const validationErrors = validateNameServers(currentNameServers);
    
    if (validationErrors.length > 0) {
      alert(`Erreurs de validation:\n\n${validationErrors.join('\n')}`);
      return;
    }
    
    alert(`✅ Serveurs de noms mis à jour avec succès pour ${domain.domainName}!\n\n${currentNameServers.length} serveur(s) configuré(s).`);
    setIsEditingNS(false);
  };

  const handleCancelEditNS = () => {
    setCurrentNameServers(domain.nameServers);
    setIsEditingNS(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papiers !');
  };

  const handleDNSRecordAdd = () => {
    const newRecord = {
      id: Date.now(),
      type: 'A',
      name: '',
      value: '',
      ttl: 3600
    };
    setCurrentDNSRecords([...currentDNSRecords, newRecord]);
  };

  const handleDNSRecordDelete = (id: number) => {
    setCurrentDNSRecords(currentDNSRecords.filter(record => record.id !== id));
  };

  const handleSaveDNSRecords = () => {
    alert(`Enregistrements DNS mis à jour pour ${domain.domainName}... (simulation)`);
    setIsEditingDNS(false);
  };

  const handleCancelEditDNS = () => {
    setCurrentDNSRecords(domain.dnsRecords);
    setIsEditingDNS(false);
  };


  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-[#DC0032] transition-colors group"
          aria-label="Retour à la liste"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-[#DC0032]" />
          Retour
        </button>
        <h3 className="text-xl font-semibold text-gray-800">
          Gestion du domaine : <span className="font-bold text-[#DC0032]">{domain.domainName}</span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(domain.domainName)}
            className="flex items-center text-sm text-gray-600 hover:text-[#DC0032] transition-colors"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copier
          </button>
          <button
            onClick={() => window.open(`https://${domain.domainName}`, '_blank')}
            className="flex items-center text-sm text-gray-600 hover:text-[#DC0032] transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Visiter
          </button>
        </div>
      </div>

      {/* Header status and chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {getStatusBadge(domain.status as any)}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          {domain.isProtected ? <ShieldCheck className="w-3 h-3 mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
          {domain.isProtected ? 'Protection ID' : 'Pas de protection'}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          {domain.isLocked ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
          {domain.isLocked ? 'Verrouillé' : 'Déverrouillé'}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <Server className="w-3 h-3 mr-1" />
          {domain.registrar}
        </span>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: Globe },
          { id: 'dns-servers', label: 'Serveurs DNS', icon: Server },
          { id: 'dns-manage', label: 'Gestion DNS', icon: Database },
          { id: 'transfer', label: 'Transfert', icon: Key }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-[#DC0032] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Informations du compte */}
            <SectionContainer icon={Globe} title="Informations du compte">
              <dl className="space-y-1">
                <DetailItem icon={Tag} label="Nom de domaine" value={domain.domainName} />
                <DetailItem icon={Power} label="Statut" value={getStatusBadge(domain.status as any)} />
                <DetailItem icon={Calendar} label="Date d'enregistrement" value={domain.registrationDate} />
                <DetailItem icon={Calendar} label="Date d'expiration" value={domain.expirationDate} />
                <DetailItem icon={Clock} label="Jours avant l'expiration" value={`${domain.daysUntilExpiration} jours`} />
                <DetailItem icon={Activity} label="Dernière mise à jour" value={domain.lastUpdated} />
                <DetailItem icon={Globe} label="Extension" value={domain.domainName.split('.').pop()?.toUpperCase()} />
                <DetailItem icon={Shield} label="Protection ID" value={domain.isProtected ? 'Activée' : 'Désactivée'} />
                <DetailItem icon={Lock} label="Verrouillage" value={domain.isLocked ? 'Verrouillé' : 'Déverrouillé'} />
              </dl>
            </SectionContainer>

            {/* Section 2: Facturation et Renouvellement */}
            <SectionContainer icon={CreditCard} title="Facturation et Renouvellement">
              <dl className="space-y-1">
                <DetailItem icon={Calendar} label="Prochaine facture" value={domain.nextBillDate} />
                <DetailItem icon={CreditCard} label="Mode de paiement" value={domain.paymentMethod} />
                <DetailItem icon={CreditCard} label="Montant initial" value={`${domain.initialAmount.toFixed(2)} €`} />
                <DetailItem icon={CreditCard} label="Montant récurrent" value={`${domain.recurringAmount.toFixed(2)} €`} />
                <DetailItem icon={RefreshCw} label="Renouvellement auto" value={domain.autoRenew ? 'Activé' : 'Désactivé'} />
                <DetailItem icon={Users} label="Titulaire" value={domain.contactInfo.registrant} />
                <DetailItem icon={Users} label="Administrateur" value={domain.contactInfo.admin} />
                <DetailItem icon={Users} label="Technique" value={domain.contactInfo.tech} />
              </dl>
            </SectionContainer>

            {/* Section 3: Options du domaine */}
            <SectionContainer icon={RefreshCw} title="Options du domaine">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <label className="font-medium text-gray-700 text-sm block mb-1">
                      Renouvellement automatique
                    </label>
                    <p className="text-xs text-gray-500 max-w-xs">
                      Lorsqu'elle est activée, nous générerons automatiquement une facture {domain.daysUntilExpiration - 20 > 0 ? `environ ${domain.daysUntilExpiration - 20} jours` : ''} avant la date d'expiration ({domain.expirationDate}).
                    </p>
                  </div>
                  <Switch
                    checked={isAutoRenewEnabled}
                    onChange={setIsAutoRenewEnabled}
                  />
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Info size={12} className="mr-1 flex-shrink-0"/>
                  Cette option a pour but de vous aider à gérer votre domaine.
                </div>
              </div>
            </SectionContainer>

            {/* Section 4: Actions */}
            <SectionContainer icon={Settings} title="Actions">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => alert(domain.isLocked ? 'Déverrouillage du domaine... (simulation)' : 'Verrouillage du domaine... (simulation)')}
                  className={`w-full inline-flex items-center justify-center gap-1.5 border px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    domain.isLocked 
                      ? 'border-green-300 text-green-700 hover:bg-green-50' 
                      : 'border-red-300 text-red-700 hover:bg-red-50'
                  }`}
                >
                  {domain.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{domain.isLocked ? 'Déverrouiller' : 'Verrouiller'}</span>
                </button>
                <button
                  onClick={() => window.open(`https://dnschecker.org/all-dns-records.php?host=${domain.domainName}`, '_blank')}
                  className="w-full inline-flex items-center justify-center gap-1.5 border border-purple-300 text-purple-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Vérifier DNS</span>
                </button>
                <button
                  onClick={handleDisableDomain}
                  className="w-full inline-flex items-center justify-center gap-1.5 border border-yellow-300 text-yellow-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-50 transition-colors"
                >
                  <Power className="w-4 h-4" />
                  <span>Désactiver</span>
                </button>
                <button
                  onClick={handleDeleteDomain}
                  className="w-full inline-flex items-center justify-center gap-1.5 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </SectionContainer>
          </div>
        )}

        {/* DNS Servers Tab */}
        {activeTab === 'dns-servers' && (
          <div className="space-y-6">
            {/* Section 1: Serveurs de noms */}
            <SectionContainer 
              icon={Server} 
              title="Serveurs de noms" 
              actionButton={
                !isEditingNS ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const defaultServers = [
                          { id: 1, server: 'ns1.linksy.com', ip: '' },
                          { id: 2, server: 'ns2.linksy.com', ip: '' }
                        ];
                        setCurrentNameServers(defaultServers);
                        alert('✅ Serveurs DNS remis par défaut avec succès!');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <RefreshCw size={12} className="mr-1" />
                      Par défaut
                    </button>
                    <button
                      onClick={() => setIsEditingNS(true)}
                      className="text-xs text-[#DC0032] hover:text-[#B80028] flex items-center"
                    >
                      <Edit3 size={12} className="mr-1" />
                      Modifier
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveNameServers}
                      className="text-xs text-green-600 hover:text-green-700 flex items-center"
                    >
                      <Save size={12} className="mr-1" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancelEditNS}
                      className="text-xs text-gray-500 hover:text-gray-600 flex items-center"
                    >
                      <X size={12} className="mr-1" />
                      Annuler
                    </button>
                  </div>
                )
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentNameServers.map((ns, index) => (
                  <div key={ns.id} className="p-4 bg-gray-50 rounded-lg border">
                    {isEditingNS ? (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Serveur de noms {index + 1}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={ns.server}
                            onChange={(e) => {
                              const newNS = [...currentNameServers];
                              newNS[index].server = e.target.value;
                              setCurrentNameServers(newNS);
                            }}
                            placeholder="ns1.example.com"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC0032] focus:border-transparent"
                          />
                          <button
                            onClick={() => {
                              const newNS = currentNameServers.filter((_, i) => i !== index);
                              setCurrentNameServers(newNS);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Serveur de noms {index + 1}</label>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-800 flex items-center">
                            <Server size={14} className="mr-2 text-gray-400" />
                            {ns.server}
                          </div>
                          <button
                            onClick={() => copyToClipboard(ns.server)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="Copier le serveur"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isEditingNS && (
                  <div className="md:col-span-2">
                    <button
                      onClick={() => {
                        const newNS = [...currentNameServers, { id: Date.now(), server: '', ip: '' }];
                        setCurrentNameServers(newNS);
                      }}
                      className="w-full text-sm text-[#DC0032] hover:text-[#B80028] py-3 border border-dashed border-gray-300 rounded-lg hover:border-[#DC0032] transition-colors flex items-center justify-center"
                    >
                      <Server size={16} className="mr-2" />
                      + Ajouter un serveur de noms
                    </button>
                  </div>
                )}
              </div>
            </SectionContainer>
          </div>
        )}

        {/* DNS Management Tab */}
        {activeTab === 'dns-manage' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Enregistrements DNS */}
            <SectionContainer 
              icon={Database} 
              title="Enregistrements DNS"
              actionButton={
                !isEditingDNS ? (
                  <button
                    onClick={() => setIsEditingDNS(true)}
                    className="text-xs text-[#DC0032] hover:text-[#B80028] flex items-center"
                  >
                    <Edit3 size={12} className="mr-1" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveDNSRecords}
                      className="text-xs text-green-600 hover:text-green-700 flex items-center"
                    >
                      <Save size={12} className="mr-1" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancelEditDNS}
                      className="text-xs text-gray-500 hover:text-gray-600 flex items-center"
                    >
                      <X size={12} className="mr-1" />
                      Annuler
                    </button>
                  </div>
                )
              }
            >
              <div className="space-y-2">
                {currentDNSRecords.slice(0, 8).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{record.name}</div>
                      <div className="text-xs text-gray-500">{record.type} - {record.value}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-400">TTL: {record.ttl}</div>
                      {isEditingDNS && (
                        <button
                          onClick={() => handleDNSRecordDelete(record.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isEditingDNS && (
                  <button
                    onClick={handleDNSRecordAdd}
                    className="w-full text-sm text-[#DC0032] hover:text-[#B80028] py-2 border border-dashed border-gray-300 rounded hover:border-[#DC0032] transition-colors"
                  >
                    + Ajouter un enregistrement DNS
                  </button>
                )}
                {currentDNSRecords.length > 8 && (
                  <div className="text-xs text-gray-500 text-center py-2">
                    +{currentDNSRecords.length - 8} autres enregistrements
                  </div>
                )}
              </div>
            </SectionContainer>

          </div>
        )}

        {/* Transfer Tab */}
        {activeTab === 'transfer' && (
          <div className="space-y-6">
            {/* Section 1: Code d'authentification */}
            <SectionContainer icon={Key} title="Code d'authentification">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Code d'authentification</label>
                  <button
                    onClick={() => copyToClipboard(domain.transfer.authCode)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copier
                  </button>
                </div>
                <code className="text-sm bg-white px-3 py-2 rounded border block font-mono">
                  {domain.transfer.authCode}
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  Ce code est requis par le nouveau registraire pour initier le transfert
                </p>
              </div>
            </SectionContainer>

            {/* Section 2: Actions de transfert */}
            <SectionContainer icon={Settings} title="Actions de transfert">
              <div className="space-y-4">
                {/* 3 Sample Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Button 1: Unlock/Lock Toggle */}
                  <button
                    onClick={() => {
                      if (domain.isLocked) {
                        alert('✅ Domaine déverrouillé avec succès!\n\nLe domaine est maintenant prêt pour le transfert.');
                      } else {
                        alert('🔒 Domaine verrouillé avec succès!\n\nLe domaine est maintenant protégé contre les transferts non autorisés.');
                      }
                    }}
                    className={`w-full inline-flex items-center justify-center gap-2 border px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      domain.isLocked 
                        ? 'border-green-300 text-green-700 hover:bg-green-50 hover:shadow-sm' 
                        : 'border-red-300 text-red-700 hover:bg-red-50 hover:shadow-sm'
                    }`}
                  >
                    {domain.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>{domain.isLocked ? 'Déverrouiller le domaine' : 'Verrouiller le domaine'}</span>
                  </button>
                  
                  {/* Button 2: Approve Transfer (if in transfer) */}
                  <button
                    onClick={() => {
                      alert('✅ Transfert approuvé avec succès!\n\nVotre approbation a été enregistrée. Le transfert va maintenant être finalisé.');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 border border-blue-300 text-blue-700 px-4 py-3 rounded-md text-sm font-medium hover:bg-blue-50 hover:shadow-sm transition-all duration-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approuver le transfert</span>
                  </button>
                  
                  {/* Button 3: Check Status and Update */}
                  <button
                    onClick={() => {
                      alert('🔄 Statut du transfert mis à jour!\n\nStatut actuel: En cours\nProgression: 60%\nProchaine étape: Approbation du titulaire\nTemps estimé: 2-3 jours ouvrables');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 border border-purple-300 text-purple-700 px-4 py-3 rounded-md text-sm font-medium hover:bg-purple-50 hover:shadow-sm transition-all duration-200"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Vérifier le statut et mettre à jour</span>
                  </button>
                </div>
                
                {/* Simple Status Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Statut actuel</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Domaine</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      domain.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {domain.isLocked ? 'Verrouillé' : 'Déverrouillé'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Transfert</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      En attente
                    </span>
                  </div>
                </div>
              </div>
            </SectionContainer>

          </div>
        )}
      </div>
    </div>
  );
};

export default DomainDetails;
