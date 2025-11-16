import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Database,
  UserPlus,
  Code,
  Settings,
  HelpCircle,
  CreditCard,
  Key
} from 'lucide-react';
import ServiceCard from './ServiceCard';
import Navigation from './Navigation';
import SMSInterface from './sms/SMSInterface';
import ContactsList from './contacts/ContactsList';
import Configuration from './configuration/Configuration';
import HelpDesk from './HelpDesk';
import Facturation from './facturation/Facturation';
import ApiPage from './api/ApiPage'; // Import the new ApiPage component

const services = [
  { icon: MessageSquare, title: 'SMS Pro', activé: false, tab: 'sms' },
  { icon: Send, title: 'E-mail Marketing', activé: false },
  { icon: Database, title: 'Hébergement', activé: false },
  { icon: UserPlus, title: 'Contacts', activé: false, tab: 'contacts' },
  { icon: Code, title: 'API', activé: true, tab: 'documentation' }, // API is active, with 'documentation' tab
  { icon: Key, title: 'OTP', activé: false },
  { icon: CreditCard, title: 'Facturation', activé: true, tab: 'achat' },
  { icon: Settings, title: 'Paramètres', activé: true, tab: 'config' },
  { icon: HelpCircle, title: 'Support', activé: true, tab: 'overview' },
];

const RestrictedDashboard = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('');

  const handleServiceClick = (title: string, activé: boolean, tab?: string) => {
    if (activé) {
      setSelectedService(title);
      setActiveTab(tab || (title === 'Facturation' ? 'achat' : 'documentation')); // Default to 'documentation' for API
    } else {
      alert(`Le service "${title}" nécessite une activation. Veuillez visiter la section Facturation pour l'activer.`);
    }
  };

  const handleBack = () => {
    setSelectedService(null);
    setActiveTab('');
  };

  const showMainMenu = selectedService !== null && services.find(s => s.title === selectedService)?.activé;
  const currentServiceConfig = services.find(s => s.title === selectedService);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-50 via-white to-white">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={handleBack}
        selectedService={selectedService}
        showMenu={!!showMainMenu}
      />

      <main className="pt-4">
        {selectedService && currentServiceConfig?.activé ? (
          <>
            {selectedService === 'Support' && <HelpDesk activeTab={activeTab} />}
            {selectedService === 'Paramètres' && <Configuration />}
            {selectedService === 'Facturation' && <Facturation activeTab={activeTab} />}
            {selectedService === 'API' && <ApiPage activeTab={activeTab} onTabChange={setActiveTab} onBack={handleBack} selectedService={selectedService} />} {/* Render ApiPage */}
            {selectedService === 'SMS Pro' && <div className="p-6 text-center text-green-600">SMS Pro Active (Placeholder)</div>}
            {selectedService === 'Contacts' && <ContactsList />}
          </>
        ) : (
          <div className="p-6 flex justify-center items-start">
            <div className="max-w-[1100px] w-full">
              <div className="mb-10 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-lg p-8 animate-fade-in">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mb-2">Bienvenue sur LINKSY</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-3xl">
                  Activez votre compte pour profiter d’une expérience fluide et élégante, inspirée des standards de qualité que vous appréciez. Accédez à nos services en toute simplicité.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleServiceClick('Facturation', true, 'achat')}
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Aller à la facturation
                  </button>
                  <button
                    onClick={() => setSelectedService('Support')}
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  >
                    Contacter le support
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon as any;
                  const isActive = service.activé;
                  return (
                    <div
                      key={index}
                      onClick={() => handleServiceClick(service.title, isActive, service.tab)}
                      className={`relative rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-lg p-5 transition-transform will-change-transform ${
                        isActive
                          ? 'hover:scale-[1.02] cursor-pointer'
                          : 'opacity-70 cursor-not-allowed'
                      }`}
                      title={!isActive ? `Le service "${service.title}" nécessite une activation` : service.title}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                          isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-medium text-gray-900 truncate">{service.title}</h3>
                            {!isActive && (
                              <span className="inline-flex items-center rounded-full border border-yellow-300 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Inactif</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{isActive ? 'Disponible' : 'Activation requise'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestrictedDashboard;