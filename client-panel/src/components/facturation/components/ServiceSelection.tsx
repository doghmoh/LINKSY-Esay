import React from 'react';
import { FaSms, FaServer, FaArrowLeft, FaStar, FaInfoCircle, FaMicrochip, FaMemory, FaHdd } from 'react-icons/fa';
import { ServiceSelectionProps, Offer } from '../types'; // Import types

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  smsProOffers,
  hostingOffers,
  selectedCategory,
  onCategorySelect,
  onOfferSelect,
  onBackToCategories,
}) => {
  const renderCategories = () => (
    <div className="animate-fade-in max-w-[72rem] mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-3">Tous nos services</h3>
        <p className="text-gray-600">Découvrez l'ensemble de nos offres et trouvez celle qui vous convient</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* SMS Pro Widget */}
        <div
          className="group bg-gradient-to-br from-white to-red-50 border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-primary-red transition-all duration-300 cursor-pointer p-8 flex flex-col items-center text-center transform hover:-translate-y-2"
          onClick={() => onCategorySelect('smsPro')}
        >
          <div className="bg-primary-red rounded-full p-4 mb-5 group-hover:scale-110 transition-transform duration-300">
            <FaSms className="text-4xl text-white" />
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-3">SMS Pro</h4>
          <p className="text-gray-600 mb-4">Engagez votre audience avec des campagnes SMS ciblées et performantes.</p>
          <div className="mt-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              À partir de {Math.min(...smsProOffers.map(o => o.price)).toLocaleString()} DA
            </span>
          </div>
        </div>
        {/* Hosting Widget */}
        <div
          className="group bg-gradient-to-br from-white to-blue-50 border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-primary-red transition-all duration-300 cursor-pointer p-8 flex flex-col items-center text-center transform hover:-translate-y-2"
          onClick={() => onCategorySelect('hosting')}
        >
          <div className="bg-primary-red rounded-full p-4 mb-5 group-hover:scale-110 transition-transform duration-300">
            <FaServer className="text-4xl text-white" />
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-3">Hosting</h4>
          <p className="text-gray-600 mb-4">Hébergement web fiable, rapide et sécurisé pour tous vos projets.</p>
          <div className="mt-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              À partir de {Math.min(...hostingOffers.map(o => o.price)).toLocaleString()} DA
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOffers = () => {
    const offers = selectedCategory === 'smsPro' ? smsProOffers : hostingOffers;
    const categoryTitle = selectedCategory === 'smsPro' ? 'SMS Pro' : 'Hosting';
    const categoryIcon = selectedCategory === 'smsPro' ? <FaSms className="text-2xl" /> : <FaServer className="text-2xl" />;
    
    return (
      <div className="animate-slide-in max-w-[72rem] mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-red transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            onClick={onBackToCategories}
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Retour aux catégories
          </button>
          <div className="flex items-center text-sm text-gray-500">
            {categoryIcon}
            <span className="ml-2">Étape 1 sur 2</span>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            Plans {categoryTitle}
          </h3>
          <p className="text-gray-600">Sélectionnez l'offre qui correspond à vos besoins</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl overflow-visible transition-all duration-300 cursor-pointer border-2 ${
                offer.recommended ? 'border-primary-red ring-2 ring-red-100' : 'border-gray-200 hover:border-primary-red'
              } flex flex-col transform hover:-translate-y-2 group`}
              onClick={() => onOfferSelect(offer as Offer)} // Cast offer to Offer type
            >
              {offer.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-4 py-2 rounded-full flex items-center z-20 shadow-lg">
                  <FaStar className="w-3 h-3 mr-1" /> 
                  RECOMMANDÉ
                </div>
              )}
              
              <div className={`p-6 flex flex-col items-center text-center flex-grow ${offer.recommended ? 'pt-8' : ''}`}>
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{offer.icon}</div>
                <h4 className="text-2xl font-bold text-gray-800 mb-4">{offer.name}</h4>
                
                {selectedCategory === 'smsPro' ? (
                  <div className="space-y-3 mb-6 w-full">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">SMS</span>
                      <span className="font-bold text-gray-800">{offer.quotaSMS.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Emails</span>
                      <span className="font-bold text-gray-800">{offer.quotaEmail.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Sender ID</span>
                      <span className="font-bold text-gray-800">{offer.senderID}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6 w-full">
                    <p className="text-sm text-gray-600 italic mb-4">{offer.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <div className="text-xs text-gray-500">CPU</div>
                        <div className="font-bold text-gray-800">{offer.cpu}c</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <div className="text-xs text-gray-500">RAM</div>
                        <div className="font-bold text-gray-800">{offer.memory}GB</div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Stockage</div>
                      <div className="font-bold text-gray-800">{offer.storage}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 text-center border-t border-gray-200 mt-auto">
                <div className="mb-3">
                  <span className="text-3xl font-bold text-primary-red">
                    {offer.price.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-gray-600 ml-1">DA</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {selectedCategory === 'smsPro' ? 'par mois' : `pour ${offer.period} mois`}
                </p>
                <button className="w-full bg-primary-red text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Choisir ce plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return !selectedCategory ? renderCategories() : renderOffers();
};

export default ServiceSelection;
