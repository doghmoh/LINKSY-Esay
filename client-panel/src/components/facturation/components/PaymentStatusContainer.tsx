import React from 'react';
import { PaymentStatusProps } from '../types'; // Import the main props type
import PaymentAccepted from './PaymentAccepted';
import PaymentRejected from './PaymentRejected';
import PaymentPendingCash from './PaymentPendingCash';

const PaymentStatusContainer: React.FC<PaymentStatusProps> = (props) => {
  const { paymentStatus, paymentResponse } = props;

  if (!paymentResponse) {
    // Optional: Add a loading or error state if response is missing unexpectedly
    return <div className="text-center p-10 text-gray-500">Chargement du statut...</div>;
  }

  switch (paymentStatus) {
    case 'accepted':
      return <PaymentAccepted {...props} />;
    case 'rejected':
      return <PaymentRejected {...props} />;
    case 'pending_cash':
      return <PaymentPendingCash {...props} />;
    case 'pending': // Should typically not reach here as Facturation waits for a final status
    default:
      // Fallback or loading state if needed
      return <div className="text-center p-10 text-gray-500">Statut de paiement en cours de détermination...</div>;
  }
};

export default PaymentStatusContainer;
