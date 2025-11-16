import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceActivation: React.FC = () => {
  const [smsPro, setSmsPro] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [hosting, setHosting] = useState(false);
  const [otp, setOtp] = useState(false);
  const [api, setApi] = useState(false);
  const navigate = useNavigate();

  const handleActivation = (service: string, value: boolean) => {
    switch (service) {
      case 'smsPro':
        setSmsPro(value);
        break;
      case 'emailMarketing':
        setEmailMarketing(value);
        break;
      case 'hosting':
        setHosting(value);
        break;
      case 'otp':
        setOtp(value);
        break;
      case 'api':
        setApi(value);
        break;
      default:
        break;
    }
  };

  const handleCompleteSetup = () => {
    console.log('Activated Services:', {
      smsPro,
      emailMarketing,
      hosting,
      otp,
      api,
    });
    alert('Services activated successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Activate Services</h2>
        
        <div className="space-y-4">
          <ServiceToggle
            label="SMS Pro"
            value={smsPro}
            onChange={(value) => handleActivation('smsPro', value)}
            verificationRequired
          />
          <ServiceToggle label="E-mail Marketing" value={emailMarketing} onChange={(value) => handleActivation('emailMarketing', value)} />
          <ServiceToggle label="Hosting" value={hosting} onChange={(value) => handleActivation('hosting', value)} />
          <ServiceToggle label="OTP" value={otp} onChange={(value) => handleActivation('otp', value)} />
          <ServiceToggle
            label="API"
            value={api}
            onChange={(value) => handleActivation('api', value)}
            verificationRequired
          />
        </div>

        <button
          onClick={handleCompleteSetup}
          className="w-full bg-[#DC0032] text-white py-2 px-4 rounded-md hover:bg-[#c40029] transition-colors mt-6"
        >
          Complete Setup
        </button>

        <p className="text-gray-600 text-sm mt-4">
          <span className="font-semibold">Note:</span> Service settings can be modified later from the settings page.
        </p>
      </div>
    </div>
  );
};

interface ServiceToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  verificationRequired?: boolean;
}

const ServiceToggle: React.FC<ServiceToggleProps> = ({ label, value, onChange, verificationRequired }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-gray-700">{label}</label>
        {verificationRequired && (
          <p className="text-xs text-gray-500">Identity verification required</p>
        )}
      </div>
      <button
        className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
          value ? 'bg-[#DC0032]' : 'bg-gray-300'
        }`}
        onClick={() => onChange(!value)}
      >
        <div
          className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ${
            value ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'
          }`}
        />
      </button>
    </div>
  );
};

export default ServiceActivation;
