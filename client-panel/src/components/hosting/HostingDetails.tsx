import React, { useState } from 'react';
import { Server, Cpu, MemoryStick, HardDrive, User, Key, Terminal, Globe, Calendar, Tag, Layers, Power, WifiOff, AlertTriangle, MapPin, Lock, LogIn, ArrowLeft, RefreshCw, Loader2, Eye, EyeOff, Copy, Check, PauseCircle, X } from 'lucide-react';

interface HostingDetailsProps {
  hosting: {
    id: number;
    domain: string;
    username: string;
    status: 'active' | 'suspended' | 'disabled';
    type: string;
    platform: 'cPanel' | 'CloudPanel' | 'N0C';
    location: 'DZ' | 'FR' | 'CA';
  };
  onBack: () => void;
}

// Helper function to get status badge styling
const getStatusBadge = (status: 'active' | 'suspended' | 'disabled') => {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <Power className="w-3 h-3 mr-1.5" /> Actif
        </span>
      );
    case 'suspended':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          <AlertTriangle className="w-3 h-3 mr-1.5" /> Suspendu
        </span>
      );
    case 'disabled':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <WifiOff className="w-3 h-3 mr-1.5" /> Désactivé
        </span>
      );
    default:
      return null;
  }
};

// Helper function to get location flag and name
const getLocationFlag = (location: 'DZ' | 'FR' | 'CA') => {
    switch (location) {
      case 'DZ': return <span className="flex items-center"><span className="mr-1.5">🇩🇿</span> Algeria</span>;
      case 'FR': return <span className="flex items-center"><span className="mr-1.5">🇫🇷</span> France</span>;
      case 'CA': return <span className="flex items-center"><span className="mr-1.5">🇨🇦</span> Canada</span>;
      default: return '';
    }
  };


const HostingDetails: React.FC<HostingDetailsProps> = ({ hosting, onBack }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false);
  const [isSftpPasswordVisible, setIsSftpPasswordVisible] = useState(false);
  const [loginCopied, setLoginCopied] = useState(false);
  const [sftpCopied, setSftpCopied] = useState(false);

  // State for confirmation modals
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disableReason, setDisableReason] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const deleteConfirmationSentence = `Je confirme la suppression définitive de ${hosting.domain} et de toutes ses données.`;


  // Static data - Added placeholder passwords
  const details = {
    creationDate: '2021-03-09',
    mode: 'Pro',
    ipAddress: '199.16.129.142',
    dns: ['nsa.n0c.com', 'nsb.n0c.com', 'nsc.n0c.com'],
    cpu: '8 CPU',
    memory: '24 GB',
    diskIO: '24 MB/s',
    sftpHost: 'nodels3-ca.n0c.com',
    sftpPort: '5022',
    loginPassword: 'ExampleLoginPassword123!',
    sftpPassword: 'ExampleSftpPassword456$',
  };

  const handleConnect = () => {
    alert(`Connexion à ${hosting.platform} pour ${hosting.domain}... (simulation)`);
  };

  const handleRegeneratePassword = () => {
    if (hosting.platform !== 'cPanel' || hosting.status !== 'active') return;

    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      alert(`Mot de passe pour ${hosting.domain} (${hosting.platform}) régénéré avec succès ! (simulation)`);
    }, 1500);
  };

  const toggleLoginPasswordVisibility = () => {
    setIsLoginPasswordVisible(!isLoginPasswordVisible);
  };

  const toggleSftpPasswordVisibility = () => {
    setIsSftpPasswordVisible(!isSftpPasswordVisible);
  };

  const copyToClipboard = (text: string, type: 'login' | 'sftp') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'login') {
        setLoginCopied(true);
        setTimeout(() => setLoginCopied(false), 2000);
      } else {
        setSftpCopied(true);
        setTimeout(() => setSftpCopied(false), 2000);
      }
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Erreur lors de la copie du mot de passe.');
    });
  };

  // --- Handlers for Disable/Delete ---
  const handleOpenDisableModal = () => {
    setDisableReason(''); // Reset reason on open
    setShowDisableConfirm(true);
  };

  const handleConfirmDisable = () => {
    if (!disableReason.trim()) {
      alert('Veuillez fournir une raison pour la désactivation.');
      return;
    }
    // --- Add API call here ---
    alert(`Hébergement ${hosting.domain} désactivé. Raison : ${disableReason} (simulation)`);
    setShowDisableConfirm(false);
    // Potentially update hosting status in parent component or refetch data
  };

  const handleOpenDeleteModal = () => {
    setDeleteConfirmInput(''); // Reset input on open
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmInput !== deleteConfirmationSentence) {
      alert('La phrase de confirmation ne correspond pas. Veuillez la saisir exactement comme indiqué.');
      return;
    }
    // --- Add API call here ---
    alert(`Hébergement ${hosting.domain} supprimé définitivement ! (simulation)`);
    setShowDeleteConfirm(false);
    // Potentially navigate back or refetch data
    onBack(); // Navigate back after deletion simulation
  };

  const handleCloseModals = () => {
    setShowDisableConfirm(false);
    setShowDeleteConfirm(false);
  };
  // --- End Handlers ---


  // Reusable component for detail items
  const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0">
      <dt className="text-gray-500 flex items-center text-sm">
        <Icon size={14} className="mr-2 text-gray-400 flex-shrink-0" />
        {label}
      </dt>
      <dd className="text-gray-800 font-medium text-sm text-right">{value}</dd>
    </div>
  );

  // Reusable component for section containers
  const SectionContainer: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
     <div className="border border-gray-200 rounded p-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <Icon size={16} className="mr-2 text-[#DC0032]" /> {title}
        </h4>
        {children}
      </div>
  );


  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm relative"> {/* Added relative positioning for modals */}
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-600 hover:text-[#DC0032] transition-colors group"
          aria-label="Retour à la liste"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-[#DC0032]" />
          Retour à la liste
        </button>
        <h3 className="text-base font-semibold text-gray-800">Hébergement <span className="text-[#DC0032]">{hosting.domain}</span></h3>
        <div />
      </div>

      {/* Header status and chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {getStatusBadge(hosting.status)}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{hosting.type}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{hosting.platform}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{getLocationFlag(hosting.location)}</span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Section 1: Informations du compte */}
        <SectionContainer icon={Server} title="Informations du compte">
          <dl className="space-y-1">
            <DetailItem icon={Globe} label="Domaine principal" value={hosting.domain} />
            <DetailItem icon={Power} label="Statut" value={getStatusBadge(hosting.status)} />
            <DetailItem icon={Calendar} label="Date de création" value={details.creationDate} />
            <DetailItem icon={Tag} label="Type" value={hosting.type} />
            <DetailItem icon={Layers} label="Plateforme" value={hosting.platform} />
            <DetailItem icon={Tag} label="Mode" value={details.mode} />
            <DetailItem icon={Server} label="Adresse IP" value={<code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{details.ipAddress}</code>} />
            <DetailItem icon={MapPin} label="Centre de données" value={getLocationFlag(hosting.location)} />
            <div className="pt-2">
              <dt className="text-gray-500 mb-1.5 flex items-center text-sm">
                <Globe size={14} className="mr-2 text-gray-400" /> DNS
              </dt>
              <dd className="text-gray-800 space-y-1.5 text-right">
                {details.dns.map((ns, index) => (
                  <div key={index} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200 inline-block ml-1">{ns}</div>
                ))}
              </dd>
            </div>
          </dl>
        </SectionContainer>

        {/* Section 2: Informations de connexion & Actions */}
        <SectionContainer icon={User} title="Informations de connexion & Actions">
          <dl className="space-y-1 mb-4">
             <DetailItem icon={User} label="Utilisateur" value={hosting.username} />
             {/* Login Password Row */}
             <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-gray-500 flex items-center text-sm">
                  <Key size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                  Mot de passe
                </dt>
                <dd className="text-gray-800 font-medium text-sm text-right flex items-center space-x-2">
                  {/* Password Display */}
                  <span className={`font-mono text-xs ${isLoginPasswordVisible ? 'bg-yellow-50 border border-yellow-200 px-1.5 py-0.5 rounded' : 'text-gray-500 italic'}`}>
                    {isLoginPasswordVisible ? details.loginPassword : '********'}
                  </span>
                  {/* Visibility Toggle */}
                  <button onClick={toggleLoginPasswordVisibility} className="text-gray-500 hover:text-gray-700" title={isLoginPasswordVisible ? "Cacher" : "Afficher"}>
                    {isLoginPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(details.loginPassword, 'login')}
                    className={`text-gray-500 hover:text-gray-700 ${loginCopied ? 'text-green-600' : ''}`}
                    title={loginCopied ? "Copié!" : "Copier"}
                    disabled={loginCopied}
                  >
                    {loginCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  {/* Regenerate Button */}
                  {hosting.platform === 'cPanel' && hosting.status === 'active' && (
                    <button
                      onClick={handleRegeneratePassword}
                      disabled={isRegenerating}
                      className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded border border-blue-200 transition-colors flex items-center disabled:opacity-50 disabled:cursor-wait"
                      title="Régénérer le mot de passe cPanel"
                    >
                      {isRegenerating ? (
                        <Loader2 size={14} className="animate-spin mr-1" />
                      ) : (
                        <RefreshCw size={14} className="mr-1" />
                      )}
                      Régénérer
                    </button>
                  )}
                </dd>
             </div>
          </dl>
          {/* --- Action Buttons --- */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={handleConnect}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-[#DC0032] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#c40029] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={hosting.status !== 'active'}
              title={hosting.status !== 'active' ? 'Hébergement non actif' : `Se connecter à ${hosting.platform}`}
            >
              <LogIn className="w-4 h-4" />
              <span>Connexion</span>
            </button>

            <button
              onClick={handleOpenDisableModal}
              className="w-full inline-flex items-center justify-center gap-1.5 border border-yellow-300 text-yellow-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={hosting.status === 'disabled' || hosting.status === 'suspended'}
              title={hosting.status !== 'active' ? 'Hébergement déjà inactif' : 'Désactiver temporairement'}
            >
              <PauseCircle className="w-4 h-4" />
              <span>Désactiver</span>
            </button>

            <button
              onClick={handleOpenDeleteModal}
              className="w-full border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={hosting.status === 'disabled'}
              title={hosting.status === 'disabled' ? 'Hébergement déjà désactivé' : 'Supprimer l\'hébergement'}
            >
              Supprimer
            </button>
          </div>
          {/* --- End Action Buttons --- */}
        </SectionContainer>

        {/* Section 3: Accès sFTP/SSH */}
        <SectionContainer icon={Terminal} title="Accès sFTP/SSH">
          <dl className="space-y-1">
            <DetailItem icon={Server} label="Nom du serveur" value={<code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{details.sftpHost}</code>} />
            <DetailItem icon={User} label="Nom d'utilisateur" value={hosting.username} />
            {/* SFTP/SSH Password Row */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-gray-500 flex items-center text-sm">
                  <Key size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                  Mot de passe
                </dt>
                <dd className="text-gray-800 font-medium text-sm text-right flex items-center space-x-2">
                   {/* Password Display */}
                   <span className={`font-mono text-xs ${isSftpPasswordVisible ? 'bg-yellow-50 border border-yellow-200 px-1.5 py-0.5 rounded' : 'text-gray-500 italic'}`}>
                    {isSftpPasswordVisible ? details.sftpPassword : '********'}
                  </span>
                  {/* Visibility Toggle */}
                  <button onClick={toggleSftpPasswordVisibility} className="text-gray-500 hover:text-gray-700" title={isSftpPasswordVisible ? "Cacher" : "Afficher"}>
                    {isSftpPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(details.sftpPassword, 'sftp')}
                    className={`text-gray-500 hover:text-gray-700 ${sftpCopied ? 'text-green-600' : ''}`}
                    title={sftpCopied ? "Copié!" : "Copier"}
                    disabled={sftpCopied}
                  >
                    {sftpCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </dd>
             </div>
            <DetailItem icon={Lock} label="Port" value={details.sftpPort} />
          </dl>
        </SectionContainer>

        {/* Section 4: Ressources */}
        <SectionContainer icon={Cpu} title="Ressources">
          <dl className="space-y-1">
            <DetailItem icon={Cpu} label="CPU" value={details.cpu} />
            <DetailItem icon={MemoryStick} label="Mémoire" value={details.memory} />
            <DetailItem icon={HardDrive} label="Disque I/O" value={details.diskIO} />
          </dl>
        </SectionContainer>

      </div>

      {/* --- Confirmation Modals --- */}
      {/* Disable Confirmation */}
      {showDisableConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-700 flex items-center">
                <AlertTriangle size={20} className="mr-2" /> Confirmer la désactivation
              </h3>
              <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez indiquer la raison de la désactivation temporaire de l'hébergement <strong className="font-medium">{hosting.domain}</strong>. Le service sera inaccessible jusqu'à sa réactivation.
            </p>
            <textarea
              value={disableReason}
              onChange={(e) => setDisableReason(e.target.value)}
              placeholder="Raison de la désactivation..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500 mb-4"
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDisable}
                disabled={!disableReason.trim()}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer la désactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center">
                <AlertTriangle size={20} className="mr-2" /> Confirmer la suppression définitive
              </h3>
              <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Cette action est <strong className="font-medium text-red-600">irréversible</strong> et entraînera la suppression complète de l'hébergement <strong className="font-medium">{hosting.domain}</strong>, y compris tous les fichiers, bases de données et configurations associés.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Pour confirmer, veuillez taper la phrase suivante exactement : <br />
              <code className="block bg-gray-100 p-2 rounded text-xs my-2 border border-gray-200">{deleteConfirmationSentence}</code>
            </p>
            <input
              type="text"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder="Tapez la phrase de confirmation ici..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteConfirmInput !== deleteConfirmationSentence}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- End Confirmation Modals --- */}

    </div>
  );
};

export default HostingDetails;
