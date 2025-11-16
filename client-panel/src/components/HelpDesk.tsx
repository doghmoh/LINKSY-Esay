import React from 'react';
import Overview from './helpdesk/Overview';
import MyTickets from './helpdesk/MyTickets';
import CreateTicket from './helpdesk/CreateTicket';

interface HelpDeskProps {
  activeTab: string;
}

const HelpDesk: React.FC<HelpDeskProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'overview':
      return <Overview />;
    case 'create-ticket':
      return <CreateTicket />;
    case 'tickets':
      return <MyTickets />;
    default:
      return <Overview />;
  }
};

export default HelpDesk;
