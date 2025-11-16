import React from 'react';
import { FaClock, FaMapMarkerAlt, FaBuilding, FaPhoneAlt, FaRedo, FaHistory, FaLifeRing } from 'react-icons/fa';
import { PaymentStatusProps } from '../types'; // Use the main props type

const PaymentPendingCash: React.FC<PaymentStatusProps> = ({
  paymentResponse,
  formatCurrency,
  formatDate,
  onNewPurchase,
}) => {
  if (!paymentResponse) return null; // Should have response if pending cash

  return (
    <div className="animate-fade-in max-w-[72rem] mx-auto">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 md:p-8">
      {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="bg-yellow-500 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <FaClock className="text-3xl md:text-4xl text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-yellow-700 mb-1 md:mb-2">
            Commande Enregistrée
          </h3>
          <p className="text-yellow-600 text-sm md:text-lg">
            Finalisez votre achat en agence
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
          <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Votre Commande</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 md:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-xs md:text-sm text-gray-600 font-medium">ID Commande</span>
              <span className="text-base md:text-lg font-bold text-gray-800">{paymentResponse.orderId || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-3 md:p-4 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-600 font-medium">Montant à Payer</span>
              <span className="text-lg md:text-xl font-bold text-yellow-700">{formatCurrency(paymentResponse.amount)}</span>
            </div>
            <div className="flex justify-between items-center p-3 md:p-4 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-600 font-medium">Date de Commande</span>
              <span className="text-sm md:text-base font-bold text-gray-800">{formatDate(paymentResponse.transactionDate)}</span>
            </div>
          </div>
        </div>

        {/* Agency Details */}
        <div className="bg-white rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
          <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Comment finaliser votre achat</h4>
          <div className="space-y-4">
            <div className="flex items-center p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FaBuilding className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 text-primary-red flex-shrink-0" />
              <div>
                <div className="text-sm md:text-base font-bold text-gray-800">Rendez-vous en agence</div>
                <div className="text-xs md:text-sm text-gray-600">Présentez-vous avec votre ID de commande</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 md:p-4 bg-gray-50 rounded-lg">
              <FaMapMarkerAlt className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 text-primary-red flex-shrink-0" />
              <div>
                <div className="text-sm md:text-base font-bold text-gray-800">Notre adresse</div>
                <div className="text-xs md:text-sm text-gray-600">123 Rue Exemple, Ville, Pays</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 md:p-4 bg-gray-50 rounded-lg">
              <FaPhoneAlt className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 text-primary-red flex-shrink-0" />
              <div>
                <div className="text-sm md:text-base font-bold text-gray-800">Contact</div>
                <a href="tel:+213000000000" className="text-primary-red hover:underline font-medium text-sm md:text-base">
                  +213 (0) 00 00 00 00
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-center text-yellow-800 font-bold text-sm md:text-base">
              📋 Mentionnez votre ID: <span className="font-mono bg-yellow-200 px-2 py-0.5 md:py-1 rounded">{paymentResponse.orderId}</span>
            </p>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 text-center">
          <button
            onClick={onNewPurchase}
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-primary-red to-red-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-200 text-sm md:text-base"
          >
            <FaRedo className="mr-2" /> Effectuer un autre achat
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event('navigateToReports'))}
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 border border-gray-300 bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 text-sm md:text-base"
          >
            <FaHistory className="mr-2" /> Rapports de Paiement
          </button>
          <button
            onClick={() => {
              try {
                const prefill = {
                  department: 'Commercial/Facturation',
                  service: 'other',
                  priority: 1,
                  subject: `Paiement en espèces - Commande ${paymentResponse?.orderId || ''}`,
                  description: `Bonjour,\n\nJe souhaite obtenir de l'aide pour compléter mon paiement en espèces.\n\nNuméro de commande: ${paymentResponse?.orderId}\nMontant: ${formatCurrency(paymentResponse?.amount)}\nDate de commande: ${formatDate(paymentResponse?.transactionDate)}\n\nMerci.`,
                };
                sessionStorage.setItem('helpdeskPrefill', JSON.stringify(prefill));
              } catch {}
              window.dispatchEvent(new Event('openHelpDeskTicket'));
            }}
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 border border-gray-300 bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 text-sm md:text-base"
          >
            <FaLifeRing className="mr-2" /> Ouvrir un ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingCash;
