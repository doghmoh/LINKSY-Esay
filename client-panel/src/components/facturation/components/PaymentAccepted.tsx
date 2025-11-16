import React from 'react';
import { FaCheckCircle, FaPrint, FaDownload, FaEnvelope, FaPhoneAlt, FaRedo, FaHistory, FaLifeRing } from 'react-icons/fa';
import { PaymentStatusProps } from '../types'; // Use the main props type

const PaymentAccepted: React.FC<PaymentStatusProps> = ({
  paymentResponse,
  formatCurrency,
  formatDate,
  onNewPurchase,
}) => {
  if (!paymentResponse) return null; // Should have response if accepted

  return (
    <div className="animate-fade-in max-w-[72rem] mx-auto">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 md:p-8">
      {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="bg-green-500 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <FaCheckCircle className="text-3xl md:text-4xl text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-1 md:mb-2">
          Paiement Accepté
          </h3>
          <p className="text-green-600 text-sm md:text-lg">Votre commande a été traitée avec succès !</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
          <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Détails de la Transaction</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="flex justify-between">
              <span className="text-xs md:text-sm text-gray-500 font-medium">ID Commande:</span>
              <span className="text-sm md:text-base font-bold text-gray-800">{paymentResponse.orderId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs md:text-sm text-gray-500 font-medium">Montant:</span>
              <span className="text-base md:text-lg font-bold text-primary-red">{formatCurrency(paymentResponse.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs md:text-sm text-gray-500 font-medium">Date & Heure:</span>
              <span className="text-sm md:text-base font-bold text-gray-800">{formatDate(paymentResponse.transactionDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs md:text-sm text-gray-500 font-medium">Méthode:</span>
              <span className="text-sm md:text-base font-bold text-gray-800">{paymentResponse.paymentMethod || 'N/A'}</span>
            </div>
            {paymentResponse.approvalCode && (
              <div className="flex justify-between sm:col-span-2">
                <span className="text-xs md:text-sm text-gray-500 font-medium">Code d'approbation:</span>
                <span className="text-xs md:text-base font-bold text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">{paymentResponse.approvalCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Contact Info */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 text-center">
            <h5 className="font-bold text-gray-700 mb-2 md:mb-3 text-base md:text-lg">Besoin d'aide ?</h5>
            <p className="text-xs md:text-sm text-gray-600 mb-3">
              Contactez le support SATIM
            </p>
            <a href="tel:3020" className="inline-flex items-center justify-center bg-primary-red text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold hover:bg-red-700 transition-colors text-sm">
              <FaPhoneAlt className="mr-2" size={14}/> 3020
            </a>
          </div>

          {/* Receipt Actions */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <h5 className="font-bold text-gray-700 mb-2 md:mb-3 text-center text-base md:text-lg">Reçu de Paiement</h5>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <FaPrint className="mr-2" /> Imprimer
              </button>
              <button className="w-full flex items-center justify-center px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <FaDownload className="mr-2" /> Télécharger PDF
              </button>
            </div>
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
            onClick={() => {
              window.dispatchEvent(new Event('navigateToReports'));
            }}
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
                  priority: 2,
                  subject: `Paiement accepté - Commande ${paymentResponse?.orderId || ''}`,
                  description: `Bonjour,\n\nJe souhaite ouvrir un ticket concernant ma commande.\n\nNuméro de commande: ${paymentResponse?.orderId}\nMontant: ${formatCurrency(paymentResponse?.amount)}\nMéthode: ${paymentResponse?.paymentMethod}\nDate: ${formatDate(paymentResponse?.transactionDate)}\n\nMerci.`,
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

export default PaymentAccepted;
