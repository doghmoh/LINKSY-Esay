import React, { useState } from 'react';
    import { BarChart3, PieChart, Calendar } from 'lucide-react';
    import BackButton from '../navigation/BackButton';

    const Reports = () => {
      const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

      // Sample data - In a real app, this would come from an API
      const campaignsData = [
        {
          id: 1,
          date: '2024-03-15',
          campaign: 'Promotion Printemps',
          sent: 1500,
          delivered: 1486,
          rate: '99.1%', // Assuming this is pre-calculated, otherwise calculate (delivered/sent)*100
          message: 'Profitez de nos offres spéciales de printemps ! Visitez notre site web pour des réductions exclusives. Offre valable jusqu\'au 31 Mars.',
          contacts: [
            { name: 'John Doe', phone: '+1234567890', status: 'Delivered' },
            { name: 'Jane Smith', phone: '+0987654321', status: 'Delivered' },
            { name: 'Alice Johnson', phone: '+1122334455', status: 'Failed' },
            // Add more contacts to represent the full list if needed for 'Targeted' count
          ],
          details: { // This details object is now unused in the UI but kept in data structure
            objective: 'Augmenter les ventes de printemps',
            targetAudience: 'Femmes de 25 à 45 ans',
            content: 'Profitez de nos offres spéciales de printemps !',
            cost: '500 €',
            results: 'Augmentation de 20% des ventes',
          },
        },
         {
          id: 2,
          date: '2024-04-10',
          campaign: 'Nouvelle Collection Été',
          sent: 2500,
          delivered: 2450,
          rate: '98.0%',
          message: 'Découvrez notre nouvelle collection été ! Fraîcheur et style garantis. Cliquez ici: [lien]',
          contacts: [
             // Add contacts for this campaign
          ],
          details: { // This details object is now unused in the UI but kept in data structure
            objective: 'Lancer la collection été',
            targetAudience: 'Tous clients',
            content: 'Découvrez notre nouvelle collection été !',
            cost: '700 €',
            results: 'TBD',
          },
        },
      ];

      const handleCampaignSelect = (campaignId: number) => {
        setSelectedCampaignId(campaignId);
      };

      const handleBackToTable = () => {
        setSelectedCampaignId(null);
      };

      const selectedCampaign = campaignsData.find(campaign => campaign.id === selectedCampaignId);

      // Calculate derived stats if a campaign is selected
      const targeted = selectedCampaign ? selectedCampaign.contacts.length : 0; // Example: Targeted = number of contacts
      const failed = selectedCampaign ? selectedCampaign.sent - selectedCampaign.delivered : 0;
      // Ensure rate calculation is robust if not provided directly
      const deliveryRate = selectedCampaign ? ((selectedCampaign.delivered / selectedCampaign.sent) * 100).toFixed(1) + '%' : 'N/A';


      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto">
            {selectedCampaignId === null ? (
              // Main Reports View (Table and Charts)
              <>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Rapports de Campagne</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Campaign Performance Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-700">Performance des campagnes</h3>
                      <BarChart3 className="text-[#DC0032]" size={24} />
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-100 rounded">
                      Graphique des performances (Placeholder)
                    </div>
                  </div>

                  {/* Delivery Statistics Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-700">Statistiques de livraison</h3>
                      <PieChart className="text-[#DC0032]" size={24} />
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-100 rounded">
                      Graphique des statistiques (Placeholder)
                    </div>
                  </div>
                </div>

                {/* Recent Campaigns Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                   <div className="flex items-center justify-between p-6 border-b">
                      <h3 className="text-lg font-medium text-gray-700">Campagnes récentes</h3>
                      <Calendar className="text-[#DC0032]" size={24} />
                    </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Campagne</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Envoyés</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Livrés</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Taux</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {campaignsData.map((campaign) => (
                          <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700">{campaign.date}</td>
                            <td className="py-3 px-4 text-gray-700">{campaign.campaign}</td>
                            <td className="py-3 px-4 text-gray-700">{campaign.sent}</td>
                            <td className="py-3 px-4 text-gray-700">{campaign.delivered}</td>
                            <td className="py-3 px-4 text-gray-700">{campaign.rate}</td>
                            <td className="py-3 px-4">
                              <button
                                className="text-[#DC0032] hover:underline font-medium"
                                onClick={() => handleCampaignSelect(campaign.id)}
                              >
                                Détails
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              // Campaign Details View
              selectedCampaign && (
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                     <BackButton onBack={handleBackToTable} />
                     <h2 className="text-xl font-semibold text-gray-800">Détails de la Campagne: {selectedCampaign.campaign}</h2>
                     <span className="text-sm text-gray-500">{selectedCampaign.date}</span>
                  </div>


                  {/* SMS Performance Section */}
                  <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Performance SMS</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded shadow-sm">
                        <p className="text-xs text-gray-500 uppercase">Ciblés</p>
                        <p className="text-xl font-bold text-gray-800">{targeted}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded shadow-sm">
                        <p className="text-xs text-gray-500 uppercase">Envoyés</p>
                        <p className="text-xl font-bold text-blue-600">{selectedCampaign.sent}</p>
                      </div>
                       <div className="text-center p-3 bg-white rounded shadow-sm">
                        <p className="text-xs text-gray-500 uppercase">Échoués</p>
                        <p className="text-xl font-bold text-red-600">{failed}</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded shadow-sm">
                        <p className="text-xs text-gray-500 uppercase">Taux Livr.</p>
                        <p className="text-xl font-bold text-green-600">{deliveryRate}</p> {/* Use calculated rate */}
                      </div>
                    </div>
                     <div>
                        <h4 className="text-md font-medium mb-2 text-gray-600">Message Envoyé:</h4>
                        <div className="p-4 border border-gray-300 bg-white rounded text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedCampaign.message}
                        </div>
                      </div>
                  </div>

                  {/* Other Details (Example: Contact List) */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Liste des Contacts (Extrait)</h3>
                     <div className="max-h-60 overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50">
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedCampaign.contacts.slice(0, 10).map((contact, index) => ( // Show only first 10 for brevity
                          <li key={index} className="text-sm text-gray-600">
                            {contact.name} ({contact.phone}) -{' '}
                            <span className={`font-medium ${contact.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>
                              {contact.status}
                            </span>
                          </li>
                        ))}
                         {selectedCampaign.contacts.length > 10 && (
                           <li className="text-sm text-gray-500 italic">... et {selectedCampaign.contacts.length - 10} autres</li>
                         )}
                      </ul>
                    </div>
                  </div>

                   {/* Removed "Informations Campagne" section */}

                </div>
              )
            )}
          </div>
        </div>
      );
    };

    export default Reports;
