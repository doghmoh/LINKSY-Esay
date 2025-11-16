import React, { useState } from 'react';
import { MessageSquare, Send, Database, UserPlus, Code, Settings, HelpCircle, CreditCard, Key } from 'lucide-react';
import ServiceCard from './ServiceCard';
import SMSInterface from './sms/SMSInterface';
import ContactsList from './contacts/ContactsList';
import Reports from './reports/Reports';
import Configuration from './configuration/Configuration';
import HelpDesk from './HelpDesk';
import Navigation from './Navigation';
import Facturation from './facturation/Facturation';
import ManageHosting from '../pages/Hosting/ManageHosting';
import ManageDomains from '../pages/Domains/ManageDomains';
import ApiPage from './api/ApiPage'; // Import the new ApiPage component
import { useEffect } from 'react';

const services = [
  { icon: MessageSquare, title: 'SMS Pro' },
  { icon: Send, title: 'E-mail Marketing' },
  { icon: Database, title: 'Hosting' },
  { icon: UserPlus, title: 'Contacts' },
  { icon: Code, title: 'API' },
  { icon: Key, title: 'OTP' },
  { icon: Settings, title: 'Settings' },
  { icon: HelpCircle, title: 'Help Desk' },
  { icon: CreditCard, title: 'Facturation' },
];

const Dashboard = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sms'); // Default tab

  const handleServiceClick = (title: string) => {
    setSelectedService(title);
    // Set default active tab for specific services
    switch (title) {
      case 'SMS Pro':
        setActiveTab('sms');
        break;
      case 'Help Desk':
        setActiveTab('overview');
        break;
      case 'Facturation':
        setActiveTab('achat');
        break;
      case 'Settings':
        setActiveTab('config');
        break;
      case 'Hosting':
        setActiveTab('manage-hosting');
        break;
      case 'API':
        setActiveTab('documentation'); // Default to documentation tab for API
        break;
      default:
        setActiveTab('');
        break;
    }
  };

  const handleBack = () => {
    setSelectedService(null);
    setActiveTab('sms');
  };

  // Global navigation events from other modules (e.g., Facturation result screens)
  useEffect(() => {
    const toReports = () => {
      setSelectedService('Facturation');
      setActiveTab('rapports');
    };
    const toHelpdeskCreate = () => {
      setSelectedService('Help Desk');
      setActiveTab('create-ticket');
    };

    const handleNavigateToReports = () => toReports();
    const handleOpenHelpDeskTicket = () => toHelpdeskCreate();

    window.addEventListener('navigateToReports', handleNavigateToReports as EventListener);
    window.addEventListener('openHelpDeskTicket', handleOpenHelpDeskTicket as EventListener);
    return () => {
      window.removeEventListener('navigateToReports', handleNavigateToReports as EventListener);
      window.removeEventListener('openHelpDeskTicket', handleOpenHelpDeskTicket as EventListener);
    };
  }, []);

  const showMainMenu = ['SMS Pro', 'Help Desk', 'Facturation', 'Settings', 'Hosting', 'API'].includes(selectedService || '');

  const renderServiceContent = () => {
    switch (selectedService) {
      case 'Help Desk':
        return <HelpDesk activeTab={activeTab} />;
      case 'SMS Pro':
        switch (activeTab) {
          case 'sms': return <SMSInterface />;
          case 'contacts': return <ContactsList />;
          case 'reports': return <Reports />;
          case 'config': return <Configuration />;
          default: return <SMSInterface />;
        }
      case 'Facturation':
        return <Facturation activeTab={activeTab} />;
      case 'Settings':
        return <Configuration />;
      case 'Hosting':
        switch (activeTab) {
          case 'manage-hosting': return <ManageHosting />;
          case 'manage-domains': return <ManageDomains />;
          default: return <ManageHosting />;
        }
      case 'API':
        return <ApiPage activeTab={activeTab} onTabChange={setActiveTab} onBack={handleBack} selectedService={selectedService} />; // Render ApiPage
      case 'OTP':
        return <div className="p-6 text-center"><h2>OTP Service Content</h2><p>This section will contain the OTP service interface.</p></div>;
      case 'Contacts':
        return <ContactsList />;
      case 'E-mail Marketing':
        return <div className="p-6 text-center"><h2>E-mail Marketing Content</h2></div>;
      default:
        return (
          <div className="p-6 flex justify-center items-center">
            <div className="max-w-[1000px] w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <ServiceCard
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    onClick={() => handleServiceClick(service.title)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={handleBack}
        selectedService={selectedService}
        showMenu={showMainMenu}
      />
      <main className="pt-4">
        {renderServiceContent()}
      </main>
    </div>
  );
};

export default Dashboard;