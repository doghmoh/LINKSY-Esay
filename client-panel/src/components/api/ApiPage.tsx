import React from 'react';
import ApiDocumentation from './ApiDocumentation';
import ApiManagement from './ApiManagement';

interface ApiPageProps {
  activeTab: string;
}

const ApiPage: React.FC<ApiPageProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'documentation':
      return <ApiDocumentation />;
    case 'management':
      return <ApiManagement />;
    default:
      return <ApiDocumentation />;
  }
};

export default ApiPage;