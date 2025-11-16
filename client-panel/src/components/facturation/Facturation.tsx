import React, { useState, useEffect } from 'react';
import {
  FaSms, FaServer, FaMoneyBillWave, FaCreditCard, FaUniversity, FaArrowLeft
} from 'react-icons/fa';

// Import types and components
import { Offer, PaymentApiResponse, SmsOffer, HostingOffer, PaymentMethod } from './types';
import ServiceSelection from './components/ServiceSelection';
import OrderSummary from './components/OrderSummary';
import PaymentMethodSelection from './components/PaymentMethodSelection';
import PaymentStatusContainer from './components/PaymentStatusContainer';
import QuickPurchase from './components/QuickPurchase';
import CheckoutStepper from './components/CheckoutStepper'; // Import the new stepper
import PaymentReports from './components/PaymentReports';
import ActiveSubscriptions from './components/ActiveSubscriptions';

interface FacturationProps {
  activeTab: string;
}

// --- Static Data ---
const smsProOffersData: SmsOffer[] = [
  { name: 'Flex UP', price: 2500, quotaSMS: 250, quotaEmail: 10000, senderID: 1, icon: <FaSms className="text-primary-red text-4xl mb-3" /> },
  { name: 'Flex GO', price: 4500, quotaSMS: 500, quotaEmail: 20000, senderID: 5, recommended: true, icon: <FaSms className="text-primary-red text-4xl mb-3" /> },
  { name: 'Flex Pro', price: 12000, quotaSMS: 1500, quotaEmail: 60000, senderID: 10, icon: <FaSms className="text-primary-red text-4xl mb-3" /> },
];

const hostingOffersData: HostingOffer[] = [
  { name: 'Eco plus', description: 'Idéal pour démarrer', price: 12500, period: 12, domain: true, cpu: 1, memory: 1, io: 1, php: true, python: true, nodeJs: true, emails: 'illimité*', ssl: true, storage: 'SSD illimité*', traffic: 'illimité', backups: '12/24H', panel: true, apache: true, support: '24/7', icon: <FaServer className="text-primary-red text-4xl mb-3" /> },
  { name: 'StartUp', description: 'Pour sites en croissance', price: 25000, period: 12, domain: true, cpu: 2, memory: 2, io: 2, php: true, python: true, nodeJs: true, emails: 'illimité*', ssl: true, storage: 'SSD illimité*', traffic: 'illimité', backups: '12/24H', panel: true, apache: true, support: '24/7', recommended: true, icon: <FaServer className="text-primary-red text-4xl mb-3" /> },
  { name: 'Optimum', description: 'Performance et fiabilité', price: 50000, period: 12, domain: true, cpu: 4, memory: 4, io: 4, php: true, python: true, nodeJs: true, emails: 'illimité*', ssl: true, storage: 'SSD illimité*', traffic: 'illimité', backups: '12/24H', panel: true, apache: true, support: '24/7', icon: <FaServer className="text-primary-red text-4xl mb-3" /> },
  { name: 'NoLimit', description: 'Puissance sans compromis', price: 100000, period: 12, domain: true, cpu: 8, memory: 8, io: 8, php: true, python: true, nodeJs: true, emails: 'illimité*', ssl: true, storage: 'SSD illimité*', traffic: 'illimité', backups: '12/24H', panel: true, apache: true, support: '24/7', icon: <FaServer className="text-primary-red text-4xl mb-3" /> },
];

const paymentMethodsData: PaymentMethod[] = [
  { name: 'Cash', label: 'Paiement en espèces', icon: <FaMoneyBillWave className="text-3xl text-green-600" />, logo: null, description: "Payez directement à notre agence." },
  { name: 'CIB', label: 'Carte CIB', icon: <FaCreditCard className="text-3xl text-primary-red" />, logo: 'https://www.bitakati.dz/assets/front/img/logo-square.svg', description: "Paiement sécurisé via SATIM." },
  { name: 'Dahabia', label: 'Carte Edahabia', icon: <FaUniversity className="text-3xl text-yellow-500" />, logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/AlgeriePoste.svg', description: "Utilisez votre carte Edahabia." },
];

// --- Parent Component ---
const Facturation: React.FC<FacturationProps> = ({ activeTab }) => {
  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentAttempted, setPaymentAttempted] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'accepted' | 'rejected' | 'pending_cash'>('pending');
  const [paymentResponse, setPaymentResponse] = useState<PaymentApiResponse | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  // const [showQuickPurchase, setShowQuickPurchase] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (paymentAttempted) {
      setCurrentStep(3);
    } else if (selectedOffer) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [selectedOffer, paymentAttempted]);

  // Scroll to top on every step change (offers → summary/payment → status)
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      // no-op for non-browser environments
    }
  }, [currentStep]);

  // --- Helper Functions ---
  const formatCurrency = (amount: number | undefined) => {
    return amount ? `${amount.toLocaleString('fr-DZ')} DA` : 'N/A';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (e) {
      return 'Date invalide';
    }
  };

  // --- Event Handlers ---
  const handleCategorySelect = (category: string) => setSelectedCategory(category);
  const handleOfferSelect = (offer: Offer) => setSelectedOffer(offer);
  const handleBackToCategories = () => setSelectedCategory(null);
  const handleBackToOffers = () => {
    setSelectedOffer(null);
    setPaymentMethod(null);
  };
  const handleMethodSelect = (method: string) => setPaymentMethod(method);
  const handleChangeMethod = () => setPaymentMethod(null);
  const handleQuickPurchase = (offer: Offer, method: string) => {
    setSelectedOffer(offer);
    setPaymentMethod(method);
    setSelectedCategory(offer.name.includes('Flex') ? 'smsPro' : 'hosting');
    handlePayment();
  };

  const handlePayment = () => {
    if (!selectedOffer || !paymentMethod) return;

    setIsProcessingPayment(true);
    setPaymentResponse(null);
    setPaymentAttempted(false);

    if (paymentMethod === 'Cash') {
      setTimeout(() => {
        setPaymentStatus('pending_cash');
        const cashResponse: PaymentApiResponse = {
          respCode: "PC", respCode_desc: "En attente de paiement en espèces",
          orderId: `ORD${Date.now().toString().slice(-6)}`, orderNumber: `PAY${Math.floor(Math.random() * 900000) + 100000}`,
          amount: selectedOffer?.price, currency: "DZD", paymentMethod: paymentMethod,
          transactionDate: new Date().toISOString(), ErrorCode: "0", OrderStatus: "0",
        };
        setPaymentResponse(cashResponse);
        setPaymentAttempted(true);
        setIsProcessingPayment(false);
      }, 500);
      return;
    }

    setPaymentStatus('pending');
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      let response: PaymentApiResponse;

      if (isSuccess) {
        setPaymentStatus('accepted');
        response = {
          respCode: "00", respCode_desc: "Approuvé", orderId: `ORD${Date.now().toString().slice(-6)}`,
          orderNumber: `PAY${Math.floor(Math.random() * 900000) + 100000}`, approvalCode: `AUTH${Math.floor(Math.random() * 90000) + 10000}`,
          amount: selectedOffer?.price, currency: "DZD", paymentMethod: paymentMethod,
          transactionDate: new Date().toISOString(), ErrorCode: "0", OrderStatus: "2",
        };
      } else {
        setPaymentStatus('rejected');
        const isSpecificRejection = Math.random() > 0.5;
        if (isSpecificRejection) {
           response = {
            respCode: "00", respCode_desc: "Transaction Annulée par l'utilisateur", orderId: `ORD${Date.now().toString().slice(-6)}`,
            orderNumber: `PAY${Math.floor(Math.random() * 900000) + 100000}`, amount: selectedOffer?.price,
            currency: "DZD", paymentMethod: paymentMethod, transactionDate: new Date().toISOString(),
            ErrorCode: "0", OrderStatus: "3",
           };
        } else {
          response = {
            respCode: "05", respCode_desc: "Transaction Refusée", actionCodeDescription: "Le paiement a été refusé par la banque.",
            orderId: `ORD${Date.now().toString().slice(-6)}`, orderNumber: `PAY${Math.floor(Math.random() * 900000) + 100000}`,
            amount: selectedOffer?.price, currency: "DZD", paymentMethod: paymentMethod,
            transactionDate: new Date().toISOString(), ErrorCode: "5", OrderStatus: "3",
          };
        }
      }

      setPaymentResponse(response);
      setPaymentAttempted(true);
      setIsProcessingPayment(false);
    }, 1500);
  };

  const handleNewPurchase = () => {
    setSelectedCategory(null);
    setSelectedOffer(null);
    setPaymentMethod(null);
    setPaymentAttempted(false);
    setPaymentStatus('pending');
    setPaymentResponse(null);
    setIsProcessingPayment(false);
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (paymentAttempted) {
      return (
        <PaymentStatusContainer
          paymentResponse={paymentResponse}
          paymentStatus={paymentStatus}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          onNewPurchase={handleNewPurchase}
        />
      );
    }

    if (selectedOffer) {
      return (
        <div className="animate-fade-in max-w-[72rem] mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <button
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary-red transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              disabled={isProcessingPayment}
              onClick={handleBackToOffers}
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Retour aux offres
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 sticky top-24">
              <OrderSummary
                selectedCategory={selectedCategory}
                selectedOffer={selectedOffer}
                formatCurrency={formatCurrency}
                mobilePaymentSlot={
                  <PaymentMethodSelection
                    paymentMethods={paymentMethodsData}
                    selectedMethod={paymentMethod}
                    isProcessingPayment={isProcessingPayment}
                    onMethodSelect={handleMethodSelect}
                    onConfirmPayment={handlePayment}
                    onChangeMethod={handleChangeMethod}
                  />
                }
              />
            </div>
            <div className="hidden md:block lg:col-span-2 sticky top-24 self-start">
              <PaymentMethodSelection
                paymentMethods={paymentMethodsData}
                selectedMethod={paymentMethod}
                isProcessingPayment={isProcessingPayment}
                onMethodSelect={handleMethodSelect}
                onConfirmPayment={handlePayment}
                onChangeMethod={handleChangeMethod}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto">
        <div
          className={`mb-8 transition-all duration-500 ease-in-out ${selectedCategory ? 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none' : 'opacity-100 translate-y-0'}`}
        >
          <QuickPurchase
            smsProOffers={smsProOffersData}
            hostingOffers={hostingOffersData}
            paymentMethods={paymentMethodsData}
            onQuickPurchase={handleQuickPurchase}
            formatCurrency={formatCurrency}
          />
        </div>
        
        <div
          className={`relative mb-8 transition-all duration-500 ease-in-out ${selectedCategory ? 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none' : 'opacity-100 translate-y-0'}`}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">ou</span>
          </div>
        </div>
        
        <ServiceSelection
          smsProOffers={smsProOffersData}
          hostingOffers={hostingOffersData}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onOfferSelect={handleOfferSelect}
          onBackToCategories={handleBackToCategories}
        />
      </div>
    );
  };

  const renderBasedOnTab = () => {
    switch (activeTab) {
      case 'achat':
        return renderContent();
      case 'rapports':
        return <PaymentReports />;
      case 'abonnements':
        return <ActiveSubscriptions />;
      default:
        return renderContent();
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="min-h-[calc(100vh-120px)]">
        {activeTab === 'achat' && <CheckoutStepper currentStep={currentStep} />}
        {renderBasedOnTab()}
      </div>
    </div>
  );
};

export default Facturation;