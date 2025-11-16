import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Mail, User, MapPin, Phone, Building, Briefcase, Lock, AlertCircle } from 'lucide-react';

type Step = 'email' | 'verifyEmail' | 'userDetails' | 'verifyPhone' | 'accountType' | 'setPassword' | 'complete';

// Helper component for inline errors
const InputError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-600 flex items-center">
      <AlertCircle className="w-4 h-4 mr-1" />
      {message}
    </p>
  );
};

// Example lists for Wilayas and Communes
const exampleWilayas = ["Alger", "Oran", "Constantine"];
const exampleCommunes = ["Alger Centre", "Oran Ville", "Constantine Ville"];


const Register: React.FC = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [commune, setCommune] = useState(''); // Changed from municipality
  const [wilaya, setWilaya] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCompanyAccount, setIsCompanyAccount] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyBusinessField, setCompanyBusinessField] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [accountType, setAccountType] = useState<'developer' | 'normal' | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For loading states

  // Error states
  const [emailError, setEmailError] = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [accountTypeError, setAccountTypeError] = useState('');


  const navigate = useNavigate();
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const clearErrors = () => {
    setEmailError('');
    setDetailsError('');
    setPhoneError('');
    setOtpError('');
    setPasswordError('');
    setAccountTypeError('');
  };

  const handleSendVerificationLink = () => {
    clearErrors();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Verification link sent to:', email);
      setStep('verifyEmail');
      setIsLoading(false);
    }, 1000);
  };

  const handleEmailVerified = () => {
    clearErrors();
    console.log('Email verified:', email);
    setStep('userDetails');
  };

  const handleUserDetailsSubmit = () => {
    clearErrors();
    let isValid = true;
    // Updated validation to check 'wilaya' and 'commune'
    if (!firstName || !lastName || !address || !commune || !wilaya || !phoneNumber) {
      setDetailsError('Veuillez remplir toutes les informations personnelles, y compris la Wilaya et la Commune.');
      isValid = false;
    }
    if (isCompanyAccount && (!companyName || !companyBusinessField)) {
       setDetailsError(prev => prev ? prev + ' Veuillez remplir toutes les informations de l\'entreprise.' : 'Veuillez remplir toutes les informations de l\'entreprise.');
       isValid = false;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
        setPhoneError('Veuillez entrer un numéro de téléphone valide (ex: +33612345678).');
        isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      console.log('Sending OTP to:', phoneNumber);
      setStep('verifyPhone');
      setIsLoading(false);
    }, 1000);
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (/[^0-9]/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit entered
    setOtp(newOtp);
    setOtpError(''); // Clear error on change

    // Focus next input
    if (value && index < otp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    clearErrors();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setOtpError('Veuillez entrer le code OTP complet à 6 chiffres.');
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      console.log('Verifying OTP:', enteredOtp);
      if (enteredOtp === '123456') { // Example valid OTP
        console.log('Phone verified:', phoneNumber);
        setStep('accountType');
      } else {
        setOtpError('Code OTP invalide. Veuillez réessayer.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleAccountTypeSelect = (type: 'developer' | 'normal') => {
    setAccountType(type);
    setAccountTypeError(''); // Clear error on selection
  };

   const handleAccountTypeSubmit = () => {
    clearErrors();
    if (!accountType) {
      setAccountTypeError('Veuillez sélectionner un type de compte.');
      return;
    }
    setStep('setPassword');
  };


  const handleCompleteRegistration = () => {
    clearErrors();
    let isValid = true;
    if (!password || password.length < 8) {
      setPasswordError('Le mot de passe doit comporter au moins 8 caractères.');
      isValid = false;
    }
    if (password !== confirmPassword) {
      setPasswordError(prev => prev ? prev + ' Les mots de passe ne correspondent pas.' : 'Les mots de passe ne correspondent pas.');
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    // Simulate final registration API call
    setTimeout(() => {
      console.log('Registration data:', {
        email,
        firstName,
        lastName,
        address,
        commune, // Changed from municipality
        wilaya,
        phoneNumber,
        isCompanyAccount,
        companyName: isCompanyAccount ? companyName : undefined,
        companyBusinessField: isCompanyAccount ? companyBusinessField : undefined,
        accountType,
      });
      console.log('Registration completed successfully!');
      setIsLoading(false);
      alert('Inscription terminée avec succès !');
      navigate('/restricted'); // Redirect to Restricted Dashboard
    }, 1500);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center"><Mail className="w-5 h-5 mr-2 text-[#DC0032]" />
            Entrez votre e-mail
            </h3>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                className={`w-full input-field ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="vous@exemple.com"
                aria-invalid={!!emailError}
                aria-describedby="email-error"
                required
              />
              <InputError message={emailError} />
            </div>
            <button
              onClick={handleSendVerificationLink}
              className="w-full bg-[#DC0032] text-white py-2 px-4 rounded-md hover:bg-[#c40029] transition-colors flex items-center justify-center disabled:opacity-50"
              disabled={!email || isLoading}
            >
              {isLoading ? 'Envoi en cours...' : <>Envoyer le lien de vérification <ArrowRight className="ml-2 w-4 h-4" /></>}
            </button>
          </div>
        );

      case 'verifyEmail':
        return (
          <div className="text-center space-y-4">
             <h3 className="text-lg font-medium text-gray-900 flex items-center justify-center"><Mail className="w-5 h-5 mr-2 text-[#DC0032]" />
             Vérifiez votre e-mail
             </h3>
            <p className="text-gray-600">
              Nous avons envoyé un lien de vérification à <b>{email}</b>. Veuillez cliquer sur le lien dans l'e-mail pour continuer.
            </p>
            <p className="text-sm text-gray-500">
              (Pour cette démo, cliquez sur le bouton ci-dessous pour simuler la vérification)
              </p>
            <button
              onClick={handleEmailVerified}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Check className="mr-2 w-4 h-4" />
              J'ai vérifié mon e-mail
            </button>
          </div>
        );

      case 'userDetails':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center"><User className="w-5 h-5 mr-2 text-[#DC0032]" />
            Vos coordonnées
            </h3>
            <InputError message={detailsError} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                  </label>
                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full input-field" required />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                  </label>
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full input-field" required />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
                </label>
              <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full input-field" required />
            </div>
            {/* Wilaya and Commune fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-1">
                  Wilaya
                  </label>
                <select
                  id="wilaya"
                  value={wilaya}
                  onChange={(e) => { setWilaya(e.target.value); setDetailsError(''); }}
                  className={`w-full input-field ${detailsError && !wilaya ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="" disabled>Sélectionnez une Wilaya</option>
                  {exampleWilayas.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-1">
                  Commune {/* Changed Label */}
                  </label>
                <select
                  id="commune"
                  value={commune}
                  onChange={(e) => { setCommune(e.target.value); setDetailsError(''); }} // Changed state setter
                  className={`w-full input-field ${detailsError && !commune ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="" disabled>Sélectionnez une Commune</option>
                  {exampleCommunes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
             <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone
                  </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); setPhoneError(''); }}
                  className={`w-full input-field ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="+33612345678"
                  aria-invalid={!!phoneError}
                  aria-describedby="phone-error"
                  required
                />
                <InputError message={phoneError} />
              </div>

            {/* Company Account Toggle */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="isCompany"
                checked={isCompanyAccount}
                onChange={(e) => setIsCompanyAccount(e.target.checked)}
                className="h-4 w-4 text-[#DC0032] focus:ring-[#DC0032] border-gray-300 rounded"
              />
              <label htmlFor="isCompany" className="ml-2 block text-sm text-gray-900">
                Ce compte est pour une entreprise {/* Refined Text */}
              </label>
            </div>

            {/* Conditional Company Fields */}
            {isCompanyAccount && (
              <div className="space-y-4 border-t pt-4 mt-4 border-gray-200">
                 <h4 className="text-md font-medium text-gray-800 flex items-center"><Building className="w-4 h-4 mr-2 text-gray-600" />
                 Informations sur l'entreprise
                 </h4>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise
                    </label>
                  <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full input-field" required={isCompanyAccount} />
                </div>
                <div>
                  <label htmlFor="companyBusinessField" className="block text-sm font-medium text-gray-700 mb-1">
                    Secteur d'activité de l'entreprise
                    </label>
                  <input type="text" id="companyBusinessField" value={companyBusinessField} onChange={(e) => setCompanyBusinessField(e.target.value)} className="w-full input-field" required={isCompanyAccount} />
                </div>
              </div>
            )}

            <button
              onClick={handleUserDetailsSubmit}
              className="w-full bg-[#DC0032] text-white py-2 px-4 rounded-md hover:bg-[#c40029] transition-colors flex items-center justify-center disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Traitement en cours...' : <>Continuer <ArrowRight className="ml-2 w-4 h-4" /></>}
            </button>
          </div>
        );

      case 'verifyPhone':
        return (
          <div className="space-y-4">
             <h3 className="text-lg font-medium text-gray-900 flex items-center"><Phone className="w-5 h-5 mr-2 text-[#DC0032]" />
             Vérifier le numéro de téléphone
             </h3>
            <p className="text-center text-gray-600">
              Entrez le code à 6 chiffres envoyé à <b>{phoneNumber}</b>.
              </p>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpInputs.current[index] = el}
                  type="text" // Use text for better mobile compatibility
                  inputMode="numeric" // Hint for numeric keyboard
                  pattern="[0-9]*" // Pattern for numeric input
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-10 h-12 text-center text-xl border rounded-md focus:ring-[#DC0032] focus:border-[#DC0032] ${otpError ? 'border-red-500' : 'border-gray-300'}`}
                  aria-label={`Chiffre OTP ${index + 1}`}
                  required
                />
              ))}
            </div>
             <InputError message={otpError} />
             <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#DC0032] text-white py-2 px-4 rounded-md hover:bg-[#c40029] transition-colors flex items-center justify-center disabled:opacity-50"
              disabled={otp.join('').length !== 6 || isLoading}
            >
              {isLoading ? 'Vérification en cours...' : <>Vérifier le code OTP <Check className="ml-2 w-4 h-4" /></>}
            </button>
             <button
                onClick={() => alert('Renvoi du code OTP... (simulation)')}
                className="w-full text-sm text-center text-[#DC0032] hover:underline mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Renvoyer le code
              </button>
          </div>
        );

      case 'accountType':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-[#DC0032]" />
            Sélectionnez le type de compte
            </h3>
            <InputError message={accountTypeError} />
            <div className="space-y-3">
              <div
                className={`p-4 border rounded-md cursor-pointer transition-all duration-150 ${accountType === 'developer' ? 'border-[#DC0032] bg-[#fff0f3] ring-1 ring-[#DC0032]' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => handleAccountTypeSelect('developer')}
                role="radio"
                aria-checked={accountType === 'developer'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleAccountTypeSelect('developer') : null}
              >
                <div className="flex items-center">
                  <div className={`radio-circle ${accountType === 'developer' ? 'selected' : ''}`}>
                    {accountType === 'developer' && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Compte Développeur
                      </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Pour les développeurs individuels et les utilisateurs techniques nécessitant un accès API.
                      </p>
                  </div>
                </div>
              </div>
              <div
                 className={`p-4 border rounded-md cursor-pointer transition-all duration-150 ${accountType === 'normal' ? 'border-[#DC0032] bg-[#fff0f3] ring-1 ring-[#DC0032]' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => handleAccountTypeSelect('normal')}
                role="radio"
                aria-checked={accountType === 'normal'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleAccountTypeSelect('normal') : null}
              >
                 <div className="flex items-center">
                   <div className={`radio-circle ${accountType === 'normal' ? 'selected' : ''}`}>
                    {accountType === 'normal' && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Compte Normal
                      </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Pour une utilisation professionnelle standard, les campagnes et les fonctionnalités générales.
                      </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleAccountTypeSubmit}
              className="w-full bg-[#DC0032] text-white py-2 px-4 rounded-md hover:bg-[#c40029] transition-colors flex items-center justify-center disabled:opacity-50"
              disabled={!accountType || isLoading}
            >
               {isLoading ? 'Traitement en cours...' : <>Continuer <ArrowRight className="ml-2 w-4 h-4" /></>}
            </button>
          </div>
        );

       case 'setPassword':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center"><Lock className="w-5 h-5 mr-2 text-[#DC0032]" />
            Définissez votre mot de passe
            </h3>
            <InputError message={passwordError} />
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                className={`w-full input-field ${passwordError && (!password || password.length < 8) ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="********"
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
                required
              />
               <p className="mt-1 text-xs text-gray-500">
                 Doit comporter au moins 8 caractères.
                 </p>
            </div>
             <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                className={`w-full input-field ${passwordError && password !== confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="********"
                aria-invalid={!!passwordError && password !== confirmPassword}
                aria-describedby="password-error"
                required
              />
            </div>
            <button
              onClick={handleCompleteRegistration}
              className="w-full bg-[#DC0032] text-white py-2 px-4 rounded-md hover:bg-[#c40029] transition-colors flex items-center justify-center disabled:opacity-50"
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? 'Finalisation de l\'inscription...' : 'Terminer l\'inscription'}
            </button>
          </div>
        );


      default:
        return null;
    }
  };

  // Progress Steps Logic
  const stepsConfig = [
    { id: 'email', label: 'E-mail', icon: Mail },
    { id: 'userDetails', label: 'Détails', icon: User },
    { id: 'verifyPhone', label: 'Téléphone', icon: Phone },
    { id: 'accountType', label: 'Compte', icon: Briefcase },
    { id: 'setPassword', label: 'Mot de passe', icon: Lock },
  ];

  const getCurrentStepIndex = () => {
     if (step === 'email' || step === 'verifyEmail') return 0;
     if (step === 'userDetails') return 1;
     if (step === 'verifyPhone') return 2;
     if (step === 'accountType') return 3;
     if (step === 'setPassword') return 4;
     return 0; // Default
  }
  const currentStepIndex = getCurrentStepIndex();


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-xl"> {/* Increased max-width */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Créez votre compte LINKSY
          </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Suivez les étapes pour commencer.
          </p>

        {/* Progress Bar */}
        <div className="mb-10 px-2 md:px-4"> {/* Increased bottom margin */}
          <div className="flex items-start justify-between"> {/* Align items start for labels */}
            {stepsConfig.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className={`flex flex-col items-center text-center ${index <= currentStepIndex ? 'text-[#DC0032]' : 'text-gray-400'}`}>
                  <div className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 mb-1 ${index <= currentStepIndex ? 'border-[#DC0032] bg-[#DC0032] text-white' : 'border-gray-300 bg-white'}`}>
                    {index < currentStepIndex ? <Check className="w-5 h-5" /> : <s.icon className={`w-4 h-4 ${index === currentStepIndex ? 'text-[#DC0032]' : 'text-gray-400'}`} />}
                  </div>
                  <span className={`text-xs ${index <= currentStepIndex ? 'font-semibold' : 'font-normal'}`}>{s.label}</span>
                </div>
                {index < stepsConfig.length - 1 && (
                  // Make the line connect between centers of circles
                  <div className="flex-1 h-0.5 mt-4 mx-1 md:mx-2 relative">
                     <div className={`absolute top-0 left-0 h-full w-full ${index < currentStepIndex ? 'bg-[#DC0032]' : 'bg-gray-300'}`}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>


        {/* Step Content */}
        <div className="mt-8">
          {renderStepContent()}
        </div>

         {/* Login Link */}
         <p className="mt-8 text-center text-sm text-gray-600"> {/* Increased top margin */}
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="font-medium text-[#DC0032] hover:text-[#c40029] hover:underline">
              Se connecter
            </a>
          </p>
      </div>
      {/* Simple CSS for input fields and radio button */}
      <style jsx>{`
        .input-field {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          appearance: none; /* Improve default styling */
          background-color: white; /* Ensure background */
        }
        /* Style for select dropdowns */
        select.input-field {
          background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'); /* Basic dropdown arrow */
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1.25em 1.25em;
          padding-right: 2.5rem; /* Space for arrow */
        }
        /* Style for text inputs */
        input.input-field {
           background-image: none;
           padding-right: 0.75rem;
        }

        .input-field:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #DC0032;
          box-shadow: 0 0 0 3px rgba(220, 0, 50, 0.2); /* ring-[#DC0032] */
        }
        .input-field.border-red-500 {
           border-color: #ef4444; /* red-500 */
        }
        .input-field.border-red-500:focus {
           box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3); /* ring-red-500 */
        }

        .radio-circle {
          min-width: 1.25rem; /* w-5 */
          height: 1.25rem; /* h-5 */
          border-radius: 9999px; /* rounded-full */
          border-width: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem; /* mr-3 */
          border-color: #9ca3af; /* border-gray-400 */
          transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
        }
        .radio-circle.selected {
          border-color: #DC0032;
          background-color: #DC0032;
        }
      `}</style>
    </div>
  );
};

export default Register;
