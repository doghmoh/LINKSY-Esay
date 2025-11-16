import React from 'react';
import { FaCheckCircle, FaArrowLeft, FaLock, FaShieldAlt, FaCreditCard, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';
import { PaymentMethod } from '../types';
// Removed default spinner in favor of custom Apple-style loader

interface PaymentMethodSelectionProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: string | null;
  isProcessingPayment: boolean;
  onMethodSelect: (method: string) => void;
  onConfirmPayment: () => void;
  onChangeMethod: () => void;
}

const AppleLoader: React.FC = () => {
  const dots = Array.from({ length: 12 });
  return (
    <div className="relative w-12 h-12 mx-auto">
      {dots.map((_, index) => {
        const angle = (index * 30) * (Math.PI / 180);
        const radius = 20; // px
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const delay = index * 0.08; // stagger for fade
        return (
          <span
            key={index}
            className="absolute w-2 h-2 bg-gray-800 rounded-full opacity-20 animate-pulse"
            style={{
              left: `calc(50% + ${x}px - 4px)`,
              top: `calc(50% + ${y}px - 4px)`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  paymentMethods,
  selectedMethod,
  isProcessingPayment,
  onMethodSelect,
  onConfirmPayment,
  onChangeMethod,
}) => {
  const currentMethod = paymentMethods.find(m => m.name === selectedMethod);
  const isOnlinePayment = selectedMethod === 'CIB' || selectedMethod === 'Dahabia';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="text-center">
        <h4 className="text-xl font-bold text-gray-800 mb-2">
          {selectedMethod ? 'Méthode sélectionnée' : 'Méthode de paiement'}
        </h4>
        <p className="text-gray-600 text-sm">
          {selectedMethod ? 'Confirmez votre choix' : 'Choisissez votre méthode'}
        </p>
      </div>

      {isProcessingPayment ? (
        <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
          <AppleLoader />
          <p className="mt-4 text-gray-800 font-medium">Traitement en cours...</p>
          <p className="text-sm text-gray-500 mt-1">Veuillez patienter</p>
          {isOnlinePayment && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-xs mx-auto">
              <div className="flex items-center justify-center mb-1">
                <FaShieldAlt className="text-blue-600 w-4 h-4 mr-2" />
                <span className="text-xs font-medium text-blue-800">Redirection SATIM</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {!selectedMethod ? (
            /* Payment Method Selection - Compact Cards */
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.name}
                  onClick={() => onMethodSelect(method.name)}
                  className="w-full border-2 border-gray-200 rounded-lg p-4 hover:border-primary-red hover:bg-red-50 transition-all duration-200"
                  disabled={isProcessingPayment}
                >
                  <div className="flex items-center">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center mr-4 bg-gray-50 rounded-lg">
                      {method.name === 'Cash' && <FaMoneyBillWave className="text-2xl text-green-600" />}
                      {method.name === 'CIB' && <FaCreditCard className="text-2xl text-primary-red" />}
                      {method.name === 'Dahabia' && <FaUniversity className="text-2xl text-yellow-600" />}
                    </div>
                    
                    {/* Content */}
                    <div className="text-left flex-grow">
                      <div className="font-bold text-gray-800 text-lg mb-1">
                        {method.label}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>

                    {/* Logo */}
                    {method.logo && (
                      <div className="flex-shrink-0 ml-4">
                        <img 
                          src={method.logo} 
                          alt={`${method.label} logo`} 
                          className="h-8 object-contain opacity-70" 
                        />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Selected Method Confirmation - Compact */
            <div className="space-y-4">
              {/* Selected Method Display */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mr-3 bg-white rounded-lg">
                      {currentMethod?.icon}
                    </div>
                    <div>
                      <div className="font-bold text-green-800 text-lg">{currentMethod?.label}</div>
                      <p className="text-sm text-green-700">{currentMethod?.description}</p>
                    </div>
                  </div>
                  <FaCheckCircle className="text-green-500 text-2xl" />
                </div>
              </div>

              {/* Method-specific Information */}
              {selectedMethod === 'Cash' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-yellow-600 w-4 h-4 mr-2" />
                    <span className="font-medium text-yellow-800 text-sm">Paiement en agence</span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    Commande réservée 48h. Finalisez en agence.
                  </p>
                </div>
              )}
              
              {isOnlinePayment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaLock className="text-blue-600 w-4 h-4 mr-2" />
                    <span className="font-medium text-blue-800 text-sm">Paiement sécurisé SATIM</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Redirection vers la plateforme sécurisée.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onConfirmPayment}
                  className="w-full bg-gradient-to-r from-primary-red to-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center"
                  disabled={isProcessingPayment}
                >
                  <FaLock className="w-4 h-4 mr-2" />
                  <span>{selectedMethod === 'Cash' ? 'Valider la commande' : 'Procéder au paiement'}</span>
                </button>

                <button
                  onClick={onChangeMethod}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
                  disabled={isProcessingPayment}
                >
                  <FaArrowLeft className="w-4 h-4 mr-2" />
                  Changer de méthode
                </button>
              </div>

              {/* Security Indicators - Compact */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                <div className="text-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <FaShieldAlt className="w-4 h-4 text-green-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">SSL</div>
                </div>
                <div className="text-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <FaLock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">PCI DSS</div>
                </div>
                <div className="text-center p-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <FaCheckCircle className="w-4 h-4 text-primary-red mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">Immédiat</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentMethodSelection;