import React, { useState, useEffect } from 'react';
import TicketDetail from './TicketDetail';
import { Search, ChevronRight, Inbox, ArrowUpDown, Zap, MessageSquare } from 'lucide-react'; // Added ArrowUpDown for sorting indication
import { Ticket } from '../../types';

// Mock data - replace with actual data fetching later
const mockTickets: Ticket[] = [
  {
    id: 'TKT-A1B2',
    subject: 'Problème de connexion à l\'espace client',
    status: 'Open',
    priority: 'High',
    created: '2024-07-15T10:00:00Z',
    description: 'Je ne parviens pas à me connecter à mon espace client.',
    category: 'Support Technique',
    assignee: 'Jean Dupont',
    chatType: 'live'
  },
  {
    id: 'TKT-C3D4',
    subject: 'Demande de fonctionnalité : Exportation CSV',
    status: 'Answered',
    priority: 'Medium',
    created: '2024-07-14T09:15:00Z',
    description: 'J\'aimerais pouvoir exporter mes contacts en CSV.',
    category: 'Demande de fonctionnalité',
    assignee: 'Marie Martin',
    chatType: 'classic'
  },
  {
    id: 'TKT-E5F6',
    subject: 'Facture incorrecte pour le mois de Juin',
    status: 'Closed',
    priority: 'Medium',
    created: '2024-06-28T16:45:00Z',
    description: 'Ma facture de juin contient des erreurs.',
    category: 'Facturation',
    assignee: 'Pierre Durand',
    chatType: 'classic'
  },
   {
    id: 'TKT-G7H8',
    subject: 'Lenteur du site web hébergé',
    status: 'Open',
    priority: 'Low',
    created: '2024-07-17T08:00:00Z',
    description: 'Mon site web est très lent depuis hier.',
    category: 'Hébergement',
    assignee: 'Non assigné',
    chatType: 'live'
  },
];

// Helper to format status
const formatStatus = (status: Ticket['status']) => {
  switch (status) {
    case 'Open': return { text: 'Ouvert', color: 'bg-red-100 text-red-700', ring: 'ring-red-600/10' };
    case 'Answered': return { text: 'Répondu', color: 'bg-blue-100 text-blue-700', ring: 'ring-blue-600/10' };
    case 'Pending': return { text: 'En attente', color: 'bg-yellow-100 text-yellow-700', ring: 'ring-yellow-600/10' };
    case 'Closed': return { text: 'Fermé', color: 'bg-gray-100 text-gray-700', ring: 'ring-gray-600/10' };
    default: return { text: status, color: 'bg-gray-100 text-gray-700', ring: 'ring-gray-500/10' };
  }
};

// Helper to format priority
const formatPriority = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'Low': return { text: 'Faible', color: 'bg-blue-100 text-blue-700', ring: 'ring-blue-600/10' }; // Changed low to blue
      case 'Medium': return { text: 'Moyenne', color: 'bg-yellow-100 text-yellow-700', ring: 'ring-yellow-600/10' };
      case 'High': return { text: 'Haute', color: 'bg-orange-100 text-orange-700', ring: 'ring-orange-600/10' };
      default: return { text: priority, color: 'bg-gray-100 text-gray-700', ring: 'ring-gray-500/10' };
    }
  };

// Helper to format chat type
const formatChatType = (chatType: Ticket['chatType']) => {
  switch (chatType) {
    case 'live': return { 
      text: 'Live Chat', 
      color: 'bg-green-100 text-green-700', 
      ring: 'ring-green-600/10',
      icon: <Zap className="w-3 h-3" />
    };
    case 'classic': return { 
      text: 'Ticket Classique', 
      color: 'bg-blue-100 text-blue-700', 
      ring: 'ring-blue-600/10',
      icon: <MessageSquare className="w-3 h-3" />
    };
    default: return { 
      text: chatType, 
      color: 'bg-gray-100 text-gray-700', 
      ring: 'ring-gray-500/10',
      icon: <MessageSquare className="w-3 h-3" />
    };
  }
};

// Helper to format date (example)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // More robust formatting can be added
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
};


const MyTickets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'Open' | 'Answered' | 'Pending' | 'Closed'>('all');
  const [tickets] = useState<Ticket[]>(mockTickets); // Use state for potential future updates
  // Add state for sorting - Example: Sort by created descending by default
  const [sortConfig, setSortConfig] = useState<{ key: keyof Ticket | null; direction: 'ascending' | 'descending' }>({ key: 'created', direction: 'descending' });


  // Handle hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#\/helpdesk\/ticket\/(.+)$/);
      if (match && match[1]) {
        setSelectedTicketId(match[1]);
      } else if (hash === '#/helpdesk/my-tickets' || hash === '#/helpdesk') {
         setSelectedTicketId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Sorting logic
  const sortedTickets = React.useMemo(() => {
    let sortableItems = [...tickets];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle date sorting specifically if needed, otherwise basic comparison
        let comparison = 0;
        if (aValue > bValue) {
          comparison = 1;
        } else if (aValue < bValue) {
          comparison = -1;
        }
        return sortConfig.direction === 'descending' ? comparison * -1 : comparison;
      });
    }
    return sortableItems;
  }, [tickets, sortConfig]);


  // Filtering logic (applied after sorting)
  const filteredTickets = sortedTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTicketClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    window.location.hash = `#/helpdesk/ticket/${ticketId}`;
  };

  const handleBackToList = () => {
    setSelectedTicketId(null);
    window.location.hash = '#/helpdesk/my-tickets';
  };

  // Function to handle sorting requests
  const requestSort = (key: keyof Ticket) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Render Ticket Detail View if an ID is selected
  if (selectedTicketId) {
    const selectedTicket = tickets.find(ticket => ticket.id === selectedTicketId);
    if (selectedTicket) {
      // Pass max-width to TicketDetail as well if needed, or handle it inside TicketDetail
      // Note: TicketDetail might need its own max-width wrapper if not already present
      return <TicketDetail ticketId={selectedTicketId} onBack={handleBackToList} />;
    } else {
       // If ticket ID from hash doesn't exist in our list, go back to list
       handleBackToList();
       return null;
    }
  }

  // Render Ticket List View
  return (
    // Outer container for padding and background
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Inner container for max-width and centering */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Actions - Button Removed */}
        {/*
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
          <button
            onClick={() => window.location.hash = '#/helpdesk/create-ticket'}
            className="flex items-center px-4 py-2 bg-[#DC0032] text-white rounded-lg hover:bg-[#c40029] transition-colors shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Ticket
          </button>
        </div>
        */}

        {/* Filters and Search Card */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par titre ou ID..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md"
                aria-label="Rechercher des tickets"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
               <span className="text-sm font-medium text-gray-500 mr-2 flex-shrink-0">Statut:</span>
              {(['all', 'Open', 'Answered', 'Pending', 'Closed'] as const).map((status) => {
                const isActive = filterStatus === status;
                const statusInfo = status !== 'all' ? formatStatus(status) : null;
                const buttonText = status === 'all' ? 'Tous' : statusInfo?.text;

                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? status === 'all'
                          ? 'bg-[#DC0032] text-white'
                          : `${statusInfo?.color} ring-1 ${statusInfo?.ring}`
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                    aria-pressed={isActive}
                  >
                    {buttonText}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => {
              const statusInfo = formatStatus(ticket.status);
              const priorityInfo = formatPriority(ticket.priority);
              const chatTypeInfo = formatChatType(ticket.chatType);
              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                  onClick={() => handleTicketClick(ticket.id)}
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handleTicketClick(ticket.id)}
                  aria-label={`Voir détails pour ticket ${ticket.id}: ${ticket.subject}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate mb-1" title={ticket.subject}>
                        {ticket.subject}
                      </h3>
                      <p className="text-xs font-mono text-gray-500 mb-2">{ticket.id}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusInfo.color} ${statusInfo.ring}`}>
                      {statusInfo.text}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${chatTypeInfo.color} ${chatTypeInfo.ring}`}>
                      {chatTypeInfo.icon}
                      {chatTypeInfo.text}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${priorityInfo.color} ${priorityInfo.ring}`}>
                      {priorityInfo.text}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Créé le {formatDate(ticket.created)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium mb-1 text-gray-900">Aucun ticket trouvé</p>
              <p className="text-sm text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[{ key: 'id', label: 'ID Ticket' }, { key: 'subject', label: 'Objet' }, { key: 'status', label: 'Statut' }, { key: 'chatType', label: 'Type' }, { key: 'priority', label: 'Priorité' }, { key: 'created', label: 'Créé le' }].map((header) => (
                    <th
                      key={header.key}
                      scope="col"
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${header.key !== 'subject' ? 'whitespace-nowrap' : ''} ${['id', 'created', 'status', 'priority', 'chatType'].includes(header.key) ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                      onClick={() => ['id', 'created', 'status', 'priority', 'chatType'].includes(header.key) ? requestSort(header.key as keyof Ticket) : null}
                      aria-sort={sortConfig.key === header.key ? sortConfig.direction : 'none'}
                    >
                      <div className="flex items-center">
                        {header.label}
                        {['id', 'created', 'status', 'priority', 'chatType'].includes(header.key) && (
                          <ArrowUpDown
                            className={`ml-1.5 w-3.5 h-3.5 ${sortConfig.key === header.key ? 'text-gray-700' : 'text-gray-400'}`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    const statusInfo = formatStatus(ticket.status);
                    const priorityInfo = formatPriority(ticket.priority);
                    const chatTypeInfo = formatChatType(ticket.chatType);
                    return (
                      <tr
                        key={ticket.id}
                        className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                        onClick={() => handleTicketClick(ticket.id)}
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleTicketClick(ticket.id)}
                        aria-label={`Voir détails pour ticket ${ticket.id}: ${ticket.subject}`}
                      >
                        <td className="px-4 py-3 text-sm font-mono text-gray-500 whitespace-nowrap">{ticket.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium max-w-sm truncate" title={ticket.subject}>{ticket.subject}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${statusInfo.color} ${statusInfo.ring}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${chatTypeInfo.color} ${chatTypeInfo.ring}`}>
                            {chatTypeInfo.icon}
                            {chatTypeInfo.text}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${priorityInfo.color} ${priorityInfo.ring}`}>
                            {priorityInfo.text}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(ticket.created)}</td>
                        <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#DC0032] transition-colors" aria-hidden="true" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-sm">
                      <div className="flex flex-col items-center">
                        <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="font-medium mb-1 text-gray-900">Aucun ticket trouvé</p>
                        <p className="text-sm text-gray-500">Essayez d'ajuster votre recherche ou vos filtres.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
