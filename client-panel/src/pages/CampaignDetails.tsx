import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import BackButton from '../components/navigation/BackButton';
import Navigation from '../components/Navigation';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received');
  const [selectedService, setSelectedService] = useState('reports'); // Default to 'reports'

  // Mock campaign data
  const campaignsData = [
    {
      id: 1,
      date: '2024-03-15',
      campaign: 'Promotion Printemps',
      sent: 1500,
      delivered: 1486,
      rate: '99.1%',
      message: 'Profitez de nos offres spéciales de printemps !',
      contacts: [
        { name: 'John Doe', phone: '+1234567890', status: 'Delivered' },
        { name: 'Jane Smith', phone: '+0987654321', status: 'Delivered' },
        { name: 'Alice Johnson', phone: '+1122334455', status: 'Failed' },
      ],
      details: {
        objective: 'Augmenter les ventes de printemps',
        targetAudience: 'Femmes de 25 à 45 ans',
        content: 'Profitez de nos offres spéciales de printemps !',
        cost: '500 €',
        results: 'Augmentation de 20% des ventes',
      },
    },
  ];

  const campaignId = parseInt(id || '1', 10);
  const selectedCampaign = campaignsData.find(campaign => campaign.id === campaignId);

  const receivedContacts = selectedCampaign?.contacts.filter(contact => contact.status === 'Delivered') || [];
  const notReceivedContacts = selectedCampaign?.contacts.filter(contact => contact.status === 'Failed') || [];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleExport = () => {
    console.log(`Exporting ${activeTab} contacts`);
  };

  const handleBack = () => {
    navigate('/rapports');
  };

  if (!selectedCampaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div>
      <Navigation 
        showMenu={true}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedService={selectedService}
      />
      <div className="p-6">
        <div className="max-w-[1000px] mx-auto">
          <BackButton onBack={handleBack} />
          <h2 className="text-2xl font-medium mb-4">Campaign Details</h2>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'received' ? 'border-b-2 border-[#DC0032] text-[#DC0032]' : 'text-gray-500'}`}
              onClick={() => handleTabChange('received')}
            >
              Liste de contact reçu
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'notReceived' ? 'border-b-2 border-[#DC0032] text-[#DC0032]' : 'text-gray-500'}`}
              onClick={() => handleTabChange('notReceived')}
            >
              Liste de contact pas reçu
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'received' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-medium">Received Contacts:</h4>
                  <button className="text-gray-600 hover:text-[#DC0032] flex items-center" onClick={handleExport}>
                    <FileDown className="mr-2" size={16} /> Export
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {receivedContacts.map((contact, index) => (
                    <li key={index} className="mb-1">
                      {contact.name} ({contact.phone}) - <span className="text-green-500">{contact.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'notReceived' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-medium">Not Received Contacts:</h4>
                  <button className="text-gray-600 hover:text-[#DC0032] flex items-center" onClick={handleExport}>
                    <FileDown className="mr-2" size={16} /> Export
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {notReceivedContacts.map((contact, index) => (
                    <li key={index} className="mb-1">
                      {contact.name} ({contact.phone}) - <span className="text-red-500">{contact.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
