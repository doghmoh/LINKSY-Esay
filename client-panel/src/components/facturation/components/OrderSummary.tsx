import React from 'react';
import { FaSms, FaServer, FaCheck, FaShieldAlt, FaClock, FaTag, FaInfoCircle, FaGift, FaHeadset, FaLock, FaRocket, FaDatabase, FaGlobe, FaEnvelope, FaCertificate, FaBackward } from 'react-icons/fa';
import { OrderSummaryProps, SmsOffer, HostingOffer } from '../types';

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedCategory,
  selectedOffer,
  formatCurrency,
  mobilePaymentSlot,
}) => {
  if (!selectedOffer || !selectedCategory) return null;

  const isSms = selectedCategory === 'smsPro';
  const offer = selectedOffer as SmsOffer | HostingOffer;

  // Calculate pricing details
  const subtotal = offer.price;
  const taxRate = 0; // 0% tax as shown in original
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Order Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <div className="flex items-center mb-4 flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left">
          <div className="bg-primary-red rounded-full p-2 md:p-3 mr-0 sm:mr-4 mb-3 sm:mb-0">
            {isSms ? <FaSms className="text-white text-lg md:text-xl" /> : <FaServer className="text-white text-lg md:text-xl" />}
          </div>
          <div className="flex-grow">
            <h4 className="text-lg md:text-2xl font-bold text-gray-800">Récapitulatif de commande</h4>
            <p className="text-xs md:text-sm text-gray-600 font-medium">{isSms ? 'Service SMS Pro' : 'Hébergement Web'}</p>
          </div>
          {offer.recommended && (
            <span className="mt-3 sm:mt-0 bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full inline-flex items-center">
              <FaTag className="w-3 h-3 mr-1" />
              RECOMMANDÉ
            </span>
          )}
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 md:p-4 border border-gray-200">
          <h5 className="font-bold text-gray-800 text-lg md:text-xl mb-1 md:mb-2">{offer.name}</h5>
          {!isSms && (
            <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">{(offer as HostingOffer).description}</p>
          )}
          <div className="text-2xl md:text-3xl font-bold text-primary-red">
            {formatCurrency(offer.price)}
            <span className="text-sm md:text-lg font-medium text-gray-600 ml-1 md:ml-2">
              {isSms ? '/mois' : `pour ${(offer as HostingOffer).period} mois`}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Features */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h6 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
          <FaRocket className="text-primary-red w-4 h-4 md:w-5 md:h-5 mr-2" />
          Caractéristiques détaillées
        </h6>
        
        {isSms ? (
          <div className="space-y-4">
            {/* SMS Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
                <div className="flex items-center mb-2">
                  <FaSms className="text-primary-red w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="text-sm md:text-base font-semibold text-gray-800">Messages SMS</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-primary-red">{(offer as SmsOffer).quotaSMS.toLocaleString()}</div>
                <div className="text-[11px] md:text-xs text-gray-600 mt-1">Messages par mois</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                <div className="flex items-center mb-2">
                  <FaEnvelope className="text-blue-600 w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="text-sm md:text-base font-semibold text-gray-800">Emails inclus</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-blue-600">{(offer as SmsOffer).quotaEmail.toLocaleString()}</div>
                <div className="text-[11px] md:text-xs text-gray-600 mt-1">Emails par mois</div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center mb-2">
                <FaTag className="text-green-600 w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="text-sm md:text-base font-semibold text-gray-800">Sender ID personnalisés</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-green-600">{(offer as SmsOffer).senderID}</div>
              <div className="text-[11px] md:text-xs text-gray-600 mt-1">Identifiants d'expéditeur</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Hosting Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 text-center">
                <FaRocket className="text-blue-600 w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" />
                <div className="text-base md:text-lg font-bold text-blue-600">{(offer as HostingOffer).cpu}</div>
                <div className="text-[11px] md:text-xs text-gray-600">CPU Cores</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 text-center">
                <FaDatabase className="text-green-600 w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" />
                <div className="text-base md:text-lg font-bold text-green-600">{(offer as HostingOffer).memory}GB</div>
                <div className="text-[11px] md:text-xs text-gray-600">RAM</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 md:p-4 text-center">
                <FaServer className="text-purple-600 w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" />
                <div className="text-base md:text-lg font-bold text-purple-600">{(offer as HostingOffer).storage}</div>
                <div className="text-[11px] md:text-xs text-gray-600">Stockage SSD</div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4 text-center">
                <FaGlobe className="text-orange-600 w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" />
                <div className="text-base md:text-lg font-bold text-orange-600">{(offer as HostingOffer).traffic}</div>
                <div className="text-[11px] md:text-xs text-gray-600">Bande passante</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                <div className="flex items-center mb-2">
                  <FaClock className="text-gray-600 w-4 h-4 mr-2" />
                  <span className="text-sm md:text-base font-semibold text-gray-800">Durée du contrat</span>
                </div>
                <div className="text-base md:text-lg font-bold text-gray-800">{(offer as HostingOffer).period} mois</div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                <div className="flex items-center mb-2">
                  <FaBackward className="text-gray-600 w-4 h-4 mr-2" />
                  <span className="text-sm md:text-base font-semibold text-gray-800">Sauvegardes</span>
                </div>
                <div className="text-base md:text-lg font-bold text-gray-800">{(offer as HostingOffer).backups}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Included Services */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h6 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
          <FaGift className="text-green-600 w-4 h-4 md:w-5 md:h-5 mr-2" />
          Services inclus gratuitement
        </h6>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isSms ? (
            <>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Rapports de livraison détaillés</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">API d'intégration complète</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Support technique 24/7</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Gestion des listes de contacts</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Programmation de campagnes</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Statistiques avancées</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Certificat SSL gratuit</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Nom de domaine inclus</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Sauvegardes automatiques</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Support technique 24/7</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Panneau de contrôle cPanel</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">PHP, Python, Node.js</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Emails illimités</span>
              </div>
              <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheck className="text-green-600 w-4 h-4 mr-3 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Serveur Apache</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Technical Specifications */}
      {!isSms && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
          <h6 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
            <FaServer className="text-blue-600 w-4 h-4 md:w-5 md:h-5 mr-2" />
            Spécifications techniques
          </h6>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs md:text-sm text-gray-600 flex items-center">
                  <FaRocket className="w-4 h-4 mr-2 text-blue-500" />
                  Processeur
                </span>
                <span className="text-sm md:text-base font-semibold text-gray-800">{(offer as HostingOffer).cpu} Core</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs md:text-sm text-gray-600 flex items-center">
                  <FaDatabase className="w-4 h-4 mr-2 text-green-500" />
                  Mémoire RAM
                </span>
                <span className="text-sm md:text-base font-semibold text-gray-800">{(offer as HostingOffer).memory} GB</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs md:text-sm text-gray-600 flex items-center">
                  <FaServer className="w-4 h-4 mr-2 text-purple-500" />
                  I/O Disque
                </span>
                <span className="text-sm md:text-base font-semibold text-gray-800">{(offer as HostingOffer).io} MB/s</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs md:text-sm text-gray-600 flex items-center">
                  <FaGlobe className="w-4 h-4 mr-2 text-orange-500" />
                  Trafic mensuel
                </span>
                <span className="text-sm md:text-base font-semibold text-gray-800">{(offer as HostingOffer).traffic}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs md:text-sm text-gray-600 flex items-center">
                  <FaEnvelope className="w-4 h-4 mr-2 text-indigo-500" />
                  Comptes email
                </span>
                <span className="text-sm md:text-base font-semibold text-gray-800">{(offer as HostingOffer).emails}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-xs md:text-sm text-gray-600 flex items-center">
                  <FaCertificate className="w-4 h-4 mr-2 text-green-500" />
                  Certificat SSL
                </span>
                <span className="text-sm md:text-base font-semibold text-gray-800">{(offer as HostingOffer).ssl ? 'Inclus' : 'Non inclus'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h6 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
          <FaInfoCircle className="text-blue-600 w-4 h-4 md:w-5 md:h-5 mr-2" />
          Détail de facturation
        </h6>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2.5 md:py-3 px-3 md:px-4 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs md:text-sm font-medium text-gray-700">Plan {offer.name}</span>
            <span className="text-sm md:text-base font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2.5 md:py-3 px-3 md:px-4 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs md:text-sm font-medium text-gray-700">Quantité</span>
            <span className="text-sm md:text-base font-semibold text-gray-800">1</span>
          </div>
          
          <div className="flex justify-between items-center py-2.5 md:py-3 px-3 md:px-4 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs md:text-sm font-medium text-gray-700">Sous-total</span>
            <span className="text-sm md:text-base font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2.5 md:py-3 px-3 md:px-4 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs md:text-sm font-medium text-gray-700">TVA ({(taxRate * 100).toFixed(0)}%)</span>
            <span className="text-sm md:text-base font-semibold text-gray-800">{formatCurrency(taxAmount)}</span>
          </div>
          
          <div className="border-t-2 border-gray-300 pt-3">
            <div className="flex justify-between items-center py-3 md:py-4 px-3 md:px-4 bg-gradient-to-r from-primary-red to-red-600 text-white rounded-lg">
              <span className="text-base md:text-lg font-bold">Total à payer</span>
              <span className="text-xl md:text-2xl font-bold">{formatCurrency(total)}</span>
            </div>
          </div>
          
          <div className="text-center text-xs md:text-sm text-gray-600 mt-2 flex items-center justify-center">
            <FaClock className="w-4 h-4 mr-2" />
            {isSms ? 'Facturation mensuelle récurrente' : `Paiement unique pour ${(offer as HostingOffer).period} mois`}
          </div>
        </div>
      </div>

      {/* Mobile Payment Methods (rendered right after billing detail) */}
      {mobilePaymentSlot && (
        <div className="md:hidden">
          {mobilePaymentSlot}
        </div>
      )}

      {/* Support & Security */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h6 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
          <FaShieldAlt className="text-green-600 w-4 h-4 md:w-5 md:h-5 mr-2" />
          Support & Sécurité
        </h6>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="flex items-center p-2.5 md:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <FaHeadset className="text-blue-600 w-4 h-4 md:w-5 md:h-5 mr-3" />
            <div>
              <div className="font-semibold text-gray-800 text-xs md:text-sm">Support 24/7</div>
              <div className="text-[11px] md:text-xs text-gray-600">Assistance technique disponible</div>
            </div>
          </div>
          
          <div className="flex items-center p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg">
            <FaLock className="text-green-600 w-4 h-4 md:w-5 md:h-5 mr-3" />
            <div>
              <div className="font-semibold text-gray-800 text-xs md:text-sm">Sécurité garantie</div>
              <div className="text-[11px] md:text-xs text-gray-600">Protection SSL et monitoring</div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 md:mt-4 p-2.5 md:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <FaInfoCircle className="text-yellow-600 w-4 h-4 mr-2" />
            <span className="text-[11px] md:text-xs text-yellow-800 font-medium">
              Activation immédiate après confirmation du paiement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;