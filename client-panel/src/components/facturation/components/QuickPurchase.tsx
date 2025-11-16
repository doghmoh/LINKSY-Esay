import React, { useState } from 'react';
import { FaSms, FaServer, FaMoneyBillWave, FaCreditCard, FaUniversity, FaBolt, FaStar } from 'react-icons/fa';
import { SmsOffer, HostingOffer, PaymentMethod, Offer } from '../types';

interface QuickPurchaseProps {
  smsProOffers: SmsOffer[];
  hostingOffers: HostingOffer[];
  paymentMethods: PaymentMethod[];
  onQuickPurchase: (offer: Offer, method: string) => void;
  formatCurrency: (amount: number | undefined) => string;
}

const QuickPurchase: React.FC<QuickPurchaseProps> = ({
  smsProOffers,
  hostingOffers,
  paymentMethods,
  onQuickPurchase,
  formatCurrency,
}) => {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Get popular offers (recommended ones or first few)
  const popularOffers = [
    ...smsProOffers.filter(offer => offer.recommended).slice(0, 1),
    ...hostingOffers.filter(offer => offer.recommended).slice(0, 1),
    ...smsProOffers.filter(offer => !offer.recommended).slice(0, 1),
    ...hostingOffers.filter(offer => !offer.recommended).slice(0, 1),
  ].slice(0, 4);

  const handleOfferSelect = (offer: Offer) => {
    setSelectedOffer(offer);
    setSelectedMethod(null); // Reset method when changing offer
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handlePurchase = () => {
    if (selectedOffer && selectedMethod) {
      onQuickPurchase(selectedOffer, selectedMethod);
    }
  };

  const getOfferIcon = (offer: Offer) => {
    return 'quotaSMS' in offer ? <FaSms className="text-primary-red" /> : <FaServer className="text-primary-red" />;
  };

  const getOfferType = (offer: Offer) => {
    return 'quotaSMS' in offer ? 'SMS Pro' : 'Hosting';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-red to-red-600 text-white p-6">
        <div className="flex items-center justify-center mb-2">
          <FaBolt className="text-2xl mr-3" />
          <h3 className="text-2xl font-bold">Achat Express</h3>
        </div>
        <p className="text-center text-red-100">Commandez en 2 clics - Offres populaires</p>
      </div>

      <div className="p-6">
        {/* Step 1: Select Popular Offer */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-primary-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
            Choisissez une offre populaire
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularOffers.map((offer, index) => (
              <button
                key={index}
                onClick={() => handleOfferSelect(offer)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
                  selectedOffer === offer
                    ? 'border-primary-red bg-red-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {offer.recommended && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <FaStar className="w-3 h-3 mr-1" />
                    TOP
                  </div>
                )}
                <div className="flex items-center mb-3">
                  <div className="text-2xl mr-3">{getOfferIcon(offer)}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{offer.name}</div>
                    <div className="text-xs text-gray-500">{getOfferType(offer)}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary-red">
                  {formatCurrency(offer.price)}
                </div>
                {'quotaSMS' in offer ? (
                  <div className="text-xs text-gray-600 mt-1">
                    {offer.quotaSMS} SMS + {offer.quotaEmail} Emails
                  </div>
                ) : (
                  <div className="text-xs text-gray-600 mt-1">
                    {offer.cpu}c CPU, {offer.memory}GB RAM
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Payment Method (only show if offer selected) */}
        {selectedOffer && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-primary-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
              Choisissez votre méthode de paiement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.name}
                  onClick={() => handleMethodSelect(method.name)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedMethod === method.name
                      ? 'border-primary-red bg-red-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-3xl">{method.icon}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 mb-1">{method.label}</div>
                    <div className="text-xs text-gray-500">{method.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Button (only show if both selected) */}
        {selectedOffer && selectedMethod && (
          <div className="text-center">
            <button
              onClick={handlePurchase}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-red to-red-600 text-white rounded-xl font-bold text-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <FaBolt className="mr-3 text-xl" />
              Acheter maintenant - {formatCurrency(selectedOffer.price)}
            </button>
            <p className="text-xs text-gray-500 mt-2">Paiement sécurisé et activation immédiate</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickPurchase;