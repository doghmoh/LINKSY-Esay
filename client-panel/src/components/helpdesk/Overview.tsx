import React from 'react';
import { Ticket, PlusCircle, BookOpen, LifeBuoy, Server, AlertTriangle, CheckCircle, Clock, XCircle, Wrench, ChevronRight, FileText, Calendar, Tag, MessageSquare, Code, Database, Key, Mail } from 'lucide-react';

// Mock data - replace with actual data fetching later
const ticketCounts = {
  open: 5,
  pending: 2,
};

const systemStatus = [
  { service: 'SMS A2P', status: 'Operational' },
  { service: 'API SMS A2P', status: 'Operational' },
  { service: 'API OTP', status: 'Under Maintenance' },
  { service: 'E-mail Marketing', status: 'Degraded Performance' },
  { service: 'API E-mail Marketing', status: 'Operational' },
  { service: 'Domaine', status: 'Outage' },
  { service: 'Hébergement', status: 'Operational' },
];

// Mock Changelog Data - replace with actual data
const changelogData = [
  { version: 'v1.2.1', date: '2024-07-25', summary: 'Correction de bugs mineurs dans le module SMS.' },
  { version: 'v1.2.0', date: '2024-07-20', summary: 'Amélioration de l\'interface de création de ticket.' },
  { version: 'v1.1.5', date: '2024-07-15', summary: 'Optimisation des performances de chargement du tableau de bord.' },
];

// Knowledge Base Categories
const kbCategories = [
  { name: 'SMS', icon: MessageSquare, link: '#' }, // Placeholder link
  { name: 'API', icon: Code, link: '#' },
  { name: 'Hosting', icon: Server, link: '#' }, // Using Server icon for Hosting
  { name: 'OTP', icon: Key, link: '#' },
  { name: 'Emailing', icon: Mail, link: '#' },
];


const Overview: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Under Maintenance':
        return <Wrench className="w-5 h-5 text-yellow-500" />;
      case 'Outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Degraded Performance':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Server className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
     switch (status) {
      case 'Operational':
        return 'text-green-700 bg-green-50 border border-green-200';
      case 'Under Maintenance':
        return 'text-yellow-700 bg-yellow-50 border border-yellow-200';
      case 'Outage':
        return 'text-red-700 bg-red-50 border border-red-200';
      case 'Degraded Performance':
        return 'text-orange-700 bg-orange-50 border border-orange-200';
      default:
        return 'text-gray-700 bg-gray-50 border border-gray-200';
    }
  }

  // Placeholder function for category click
  const handleCategoryClick = (categoryName: string) => {
    console.log(`Navigating to Knowledge Base category: ${categoryName}`);
    // In a real implementation, this would filter articles or navigate
    // e.g., window.location.href = `http://kp.linksy.tech/category/${categoryName.toLowerCase()}`;
  };


  return (
    // Apply max-width and centering to the main content area
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Key Metrics & CTAs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Open Tickets */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-red-100">
              <Ticket className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tickets Ouverts</p>
              <p className="text-2xl font-semibold text-gray-800">{ticketCounts.open}</p>
            </div>
          </div>

          {/* Pending Tickets */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tickets En Attente</p>
              <p className="text-2xl font-semibold text-gray-800">{ticketCounts.pending}</p>
            </div>
          </div>

          {/* Create Ticket CTA */}
          <button
            onClick={() => (window.location.hash = '#/helpdesk/create-ticket')}
            className="group bg-[#DC0032] text-white rounded-lg shadow p-4 md:p-6 hover:bg-[#c40029] transition-colors flex items-center space-x-4 text-left"
          >
            <div className="p-3 rounded-full bg-white/20">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Créer un Ticket</p>
              <p className="text-sm opacity-90">Ouvrir une nouvelle demande</p>
            </div>
          </button>

          {/* View My Tickets CTA */}
          <button
            onClick={() => (window.location.hash = '#/helpdesk/my-tickets')}
            className="group bg-white rounded-lg shadow p-4 md:p-6 hover:bg-[#FFF5F7] transition-colors flex items-center space-x-4 text-left"
          >
            <div className="p-3 rounded-full bg-gray-100 group-hover:bg-[#DC0032]/10 transition-colors">
              <LifeBuoy className="w-6 h-6 text-gray-600 group-hover:text-[#DC0032] transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-[#DC0032] transition-colors">Mes Tickets</p>
              <p className="text-sm text-gray-500">Voir vos demandes en cours</p>
            </div>
          </button>
        </div>

        {/* System Status, Documentation & Changelog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* System Status - Enhanced */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">État du Système</h2>
            <div className="space-y-3">
              {systemStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex-1 pr-4">{item.service}</span>
                  <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`} >
                    {getStatusIcon(item.status)}
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <a href="#" className="mt-5 inline-flex items-center text-sm font-medium text-[#DC0032] hover:underline">
              Voir l'historique complet
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Documentation / FAQ with Categories */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col"> {/* Removed justify-between */}
            <div>
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-full bg-blue-100 inline-block mr-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Base de Connaissances</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Trouvez des réponses rapides et des guides. Filtrez par catégorie ou consultez la documentation complète.
              </p>

              {/* Service Categories */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Parcourir par catégorie :</h3>
                <div className="flex flex-wrap gap-2">
                  {kbCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      // href={category.link} // Use href if direct linking is preferred later
                      // target="_blank"
                      // rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium"
                    >
                      <category.icon className="w-3.5 h-3.5 mr-1.5" />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Link to Full Documentation */}
            <div className="mt-auto pt-4 border-t border-gray-100"> {/* Pushes button to bottom */}
              <a
                href="http://kp.linksy.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
              >
                Consulter la Documentation Complète
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Changelog Section */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dernières Mises à Jour</h2>
          <div className="space-y-4">
            {changelogData.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    <Tag className="w-3 h-3 mr-1.5" />
                    {item.version}
                  </span>
                  <span className="text-xs text-gray-500 inline-flex items-center">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {item.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.summary}</p>
              </div>
            ))}
          </div>
           <a href="#" className="mt-5 inline-flex items-center text-sm font-medium text-[#DC0032] hover:underline">
              Voir tout l'historique des mises à jour
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
        </div>
      </div> {/* Closing the max-width container */}
    </div>
  );
};

export default Overview;
