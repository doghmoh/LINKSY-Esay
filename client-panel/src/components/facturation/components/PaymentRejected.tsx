import React from 'react';
import { FaTimesCircle, FaPhoneAlt, FaRedo, FaHistory, FaLifeRing } from 'react-icons/fa';
import { PaymentStatusProps } from '../types'; // Use the main props type

const PaymentRejected: React.FC<PaymentStatusProps> = ({
  paymentResponse,
  formatCurrency,
  formatDate,
  onNewPurchase,
}) => {
  if (!paymentResponse) return null; // Should have response if rejected

  // Determine if it's a specific rejection (e.g., user cancelled on CIB page) vs. general failure
  const isSpecificRejection = paymentResponse.respCode === "00" && paymentResponse.ErrorCode === "0" && paymentResponse.OrderStatus === "3";
  // General failure message from API or default
  const errorMessage = paymentResponse.respCode_desc || paymentResponse.actionCodeDescription || "Erreur inconnue";
  const displayHeading = isSpecificRejection ? "Transaction Annulée" : "Échec du Paiement"; // Changed heading for clarity

  return (
    <div className="animate-fade-in max-w-[72rem] mx-auto">
      <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 md:p-8">
      {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="bg-red-500 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <FaTimesCircle className="text-3xl md:text-4xl text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-red-700 mb-1 md:mb-2">
            {displayHeading}
          </h3>
          {!isSpecificRejection && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 md:p-4 mt-3 md:mt-4">
              <p className="text-red-700 text-sm md:text-base font-medium">
                {errorMessage} (Code: {paymentResponse.respCode})
              </p>
              <p className="text-red-600 mt-2 text-xs md:text-sm">
                Votre transaction a été rejetée / Your transaction was rejected / تم رفض معاملتك
              </p>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
          <h4 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 text-center">Détails de la Transaction</h4>
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between items-center p-2.5 md:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-600 font-medium">ID Commande</span>
              <span className="text-sm md:text-base font-bold text-gray-800">{paymentResponse.orderId || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 md:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-600 font-medium">Montant</span>
              <span className="text-sm md:text-base font-bold text-gray-800">{formatCurrency(paymentResponse.amount)}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 md:p-3 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm text-gray-600 font-medium">Méthode</span>
              <span className="text-sm md:text-base font-bold text-gray-800">{paymentResponse.paymentMethod || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 md:p-3 bg-red-100 rounded-lg border border-red-200">
              <span className="text-xs md:text-sm text-red-600 font-medium">Statut Final</span>
              <span className="text-sm md:text-base font-bold text-red-700">
                {isSpecificRejection ? 'Annulée' : 'Échouée'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 text-center mb-6 md:mb-8">
          <h5 className="font-bold text-gray-700 mb-2 md:mb-3 text-base md:text-lg">Besoin d'assistance ?</h5>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
            Contactez le support SATIM pour résoudre ce problème
          </p>
          <a href="tel:3020" className="inline-flex items-center justify-center bg-primary-red text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-sm md:text-lg hover:bg-red-700 transition-colors">
            <FaPhoneAlt className="mr-3" size={16}/> 3020
          </a>
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
                  priority: 3,
                  subject: `Problème de paiement - Commande ${paymentResponse?.orderId || ''}`,
                  description: `Bonjour,\n\nUn problème est survenu lors de mon paiement.\n\nNuméro de commande: ${paymentResponse?.orderId}\nMontant: ${formatCurrency(paymentResponse?.amount)}\nMéthode: ${paymentResponse?.paymentMethod}\nMessage: ${errorMessage}\n\nMerci.`,
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

export default PaymentRejected;
