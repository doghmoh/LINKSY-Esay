import React from 'react';
import NavButton from './NavButton';

interface NavLinksProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedService: string;
  mobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({
  activeTab,
  onTabChange,
  selectedService,
  mobile = false
}) => {
  const getTabs = () => {
    switch (selectedService) {
      case 'SMS Pro':
        return [
          { id: 'sms', label: 'Marketing par SMS' },
          { id: 'contacts', label: 'Liste des contacts' },
          { id: 'reports', label: 'Rapports' },
          { id: 'config', label: 'Configuration' },
        ];
      case 'Help Desk':
        return [
          { id: 'overview', label: 'Aperçu' },
          { id: 'create-ticket', label: 'Créer un ticket' },
          { id: 'tickets', label: 'Mes tickets' },
        ];
      case 'Facturation':
        return [
          { id: 'achat', label: 'Achat de Services' },
          { id: 'rapports', label: 'Rapports de Paiement' },
          { id: 'abonnements', label: 'Abonnements Actifs' },
        ];
      case 'Hosting': // Add case for Hosting service
        return [
          { id: 'manage-hosting', label: "Gérer l'hébergement" },
          { id: 'manage-domains', label: 'Gérer domaine' },
        ];
      case 'API': // Add case for API service
        return [
          { id: 'documentation', label: 'Documentation' },
          { id: 'management', label: 'Gestion des clés' }, // New tab for API management
        ];
      case 'Settings': // Assuming Settings might have its own tabs eventually
         return [
           { id: 'config', label: 'Configuration Générale' }, // Example tab
         ];
      default:
        return []; // Return empty for services without specific sub-menus like Contacts, API etc.
    }
  };

  const tabs = getTabs();

  // If no tabs are defined for the selected service, don't render the container
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={`flex ${mobile ? 'flex-col space-y-2' : 'space-x-4'}`}>
      {tabs.map((tab) => (
        <NavButton
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </NavButton>
      ))}
    </div>
  );
};

export default NavLinks;