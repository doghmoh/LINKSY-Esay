import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface CheckoutStepperProps {
  currentStep: number; // 1, 2, or 3
}

const steps = ['Sélectionner', 'Payer', 'Terminé'];

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-lg mx-auto mb-12 px-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center w-20">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold
                    ${isCompleted ? 'bg-primary-red border-primary-red text-white' : ''}
                    ${isCurrent ? 'border-primary-red bg-white text-primary-red ring-4 ring-red-100' : ''}
                    ${!isCompleted && !isCurrent ? 'border-gray-300 bg-white text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? <FaCheck /> : stepNumber}
                </div>
                <p className={`mt-2 text-xs font-semibold
                  ${isCurrent || isCompleted ? 'text-primary-red' : 'text-gray-500'}
                `}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 transition-all duration-300
                  ${isCompleted ? 'bg-primary-red' : 'bg-gray-200'}
                `}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutStepper;