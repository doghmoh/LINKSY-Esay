import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
  return (
    <button
      onClick={onBack}
      className="flex items-center text-white hover:text-gray-200 transition-colors"
    >
      <ArrowLeft size={20} className="mr-2" />
      <span className="text-sm font-medium">Retour</span>
    </button>
  );
};

export default BackButton;
