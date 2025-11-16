import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building, Phone, ArrowRight, Check, Briefcase, Code, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation';
import Logo from '../components/navigation/Logo';

type Step = 'emailEntry' | 'verifyEmail' | 'personalDetails' | 'verifyPhone' | 'accountType' | 'setPassword';

const WILAYAS = ["Alger", "Oran", "Constantine", "Sétif", "Annaba", "Blida", "Tlemcen"];
const COMMUNES = ["Alger Centre", "Oran", "Constantine", "Sétif", "Annaba", "Blida", "Tlemcen", "Bab Ezzouar"];
const COMPANY_TYPES = ["StartUp", "Auto-entrepreneur", "EURL", "SARL", "SPA", "Personne physique"];

const STEPS_CONFIG = [
  { id: 'emailEntry', title: 'Email', icon: Mail },
  { id: 'personalDetails', title: 'Détails', icon: User },
  { id: 'verifyPhone', title: 'Téléphone', icon: Phone },
  { id: 'accountType', title: 'Usage', icon: Briefcase },
  { id: 'setPassword', title: 'Sécurité', icon: Lock },
];

const Register2: React.FC = () => {
  const [step, setStep] = useState<Step>('emailEntry');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    address: '',
    wilaya: '',
    commune: '',
    phoneNumber: '',
    isCompany: false,
    companyType: '',
    companyName: '',
    companyAddress: '',
    companyWilaya: '',
    companyCommune: '',
    accountType: '',
  });
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useNavigate();
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Form persistence
  useEffect(() => {
    const savedData = localStorage.getItem('register2-form-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('register2-form-data', JSON.stringify(formData));
  }, [formData]);

  // Password strength calculation
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);
    
    // Format as 0XXX XX XX XX (4-2-2-2)
    if (limitedDigits.length <= 4) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 4)} ${limitedDigits.slice(4)}`;
    } else if (limitedDigits.length <= 8) {
      return `${limitedDigits.slice(0, 4)} ${limitedDigits.slice(4, 6)} ${limitedDigits.slice(6)}`;
    } else {
      return `${limitedDigits.slice(0, 4)} ${limitedDigits.slice(4, 6)} ${limitedDigits.slice(6, 8)} ${limitedDigits.slice(8)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

    // Format phone number if it's the phoneNumber field
    if (name === 'phoneNumber') {
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFieldBlur = () => {
    // Field blur handler - can be used for additional validation if needed
  };

  const validateAlgerianPhone = (phone: string): boolean => {
    // Remove spaces and check if it matches Algerian phone format
    const cleanPhone = phone.replace(/\s/g, '');
    return /^(05|06|07)\d{8}$/.test(cleanPhone);
  };

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 'emailEntry') {
      if (validateRequired(formData.email, 'Email')) newErrors.email = 'L\'adresse e-mail est requise.';
      else if (!validateEmail(formData.email)) newErrors.email = 'Adresse e-mail invalide.';
    } else if (currentStep === 'personalDetails') {
      if (validateRequired(formData.firstName, 'Prénom')) newErrors.firstName = 'Le prénom est requis.';
      if (validateRequired(formData.lastName, 'Nom')) newErrors.lastName = 'Le nom est requis.';
      if (validateRequired(formData.address, 'Adresse')) newErrors.address = 'L\'adresse est requise.';
      if (validateRequired(formData.wilaya, 'Wilaya')) newErrors.wilaya = 'La wilaya est requise.';
      if (validateRequired(formData.commune, 'Commune')) newErrors.commune = 'La commune est requise.';
      if (validateRequired(formData.phoneNumber, 'Téléphone')) newErrors.phoneNumber = 'Le numéro de téléphone est requis.';
      else if (!validateAlgerianPhone(formData.phoneNumber)) newErrors.phoneNumber = 'Le numéro doit commencer par 05, 06 ou 07 et contenir 10 chiffres.';
      
      if (formData.isCompany) {
        if (validateRequired(formData.companyType, 'Type d\'entreprise')) newErrors.companyType = 'Le type d\'entreprise est requis.';
        if (validateRequired(formData.companyName, 'Nom de l\'entreprise')) newErrors.companyName = 'Le nom de l\'entreprise est requis.';
        if (validateRequired(formData.companyAddress, 'Adresse de l\'entreprise')) newErrors.companyAddress = 'L\'adresse de l\'entreprise est requise.';
        if (validateRequired(formData.companyWilaya, 'Wilaya de l\'entreprise')) newErrors.companyWilaya = 'La wilaya de l\'entreprise est requise.';
        if (validateRequired(formData.companyCommune, 'Commune de l\'entreprise')) newErrors.companyCommune = 'La commune de l\'entreprise est requise.';
      }
    } else if (currentStep === 'verifyPhone') {
      if (otp.join('').length < 6) newErrors.otp = 'Le code doit contenir 6 chiffres.';
    } else if (currentStep === 'accountType') {
      if (!formData.accountType) newErrors.accountType = 'Veuillez sélectionner un type de compte.';
    } else if (currentStep === 'setPassword') {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors.join(', ');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = (currentStep: Step): boolean => {
    if (currentStep === 'emailEntry') {
      return formData.email.trim() !== '' && validateEmail(formData.email);
    } else if (currentStep === 'personalDetails') {
      const basicFieldsValid = formData.firstName.trim() !== '' && 
                              formData.lastName.trim() !== '' && 
                              formData.address.trim() !== '' && 
                              formData.wilaya !== '' && 
                              formData.commune !== '' && 
                              formData.phoneNumber.trim() !== '' && 
                              validateAlgerianPhone(formData.phoneNumber);
      
      if (!formData.isCompany) {
        return basicFieldsValid;
      } else {
        return basicFieldsValid && 
               formData.companyType !== '' && 
               formData.companyName.trim() !== '' && 
               formData.companyAddress.trim() !== '' && 
               formData.companyWilaya !== '' && 
               formData.companyCommune !== '';
      }
    } else if (currentStep === 'verifyPhone') {
      return otp.join('').length === 6;
    } else if (currentStep === 'accountType') {
      return formData.accountType !== '';
    } else if (currentStep === 'setPassword') {
      const passwordValidation = validatePassword(formData.password);
      return passwordValidation.isValid && formData.password === formData.confirmPassword;
    }
    return false;
  };

  const handleNextStep = async () => {
    if (!validateStep(step)) return;

    setIsLoading(true);
    setIsAnimating(true);
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (step === 'emailEntry') {
      setStep('verifyEmail');
    } else if (step === 'personalDetails') {
      setStep('verifyPhone');
      setResendTimer(60);
    } else if (step === 'verifyPhone') {
      if (otp.join('') !== '123456') {
        setErrors({ otp: 'Code OTP invalide. Veuillez réessayer.' });
        setIsLoading(false);
        setIsAnimating(false);
        return;
      }
      setStep('accountType');
    } else if (step === 'accountType') {
      setStep('setPassword');
    } else if (step === 'setPassword') {
      console.log('Final registration data:', formData);
      // Clear saved form data on successful registration
      localStorage.removeItem('register2-form-data');
      alert('Inscription réussie ! Vous allez être redirigé.');
      navigate('/service-activation');
    }
    
    setIsLoading(false);
    setIsAnimating(false);
  };

  const handleResendOtp = (via: 'sms' | 'whatsapp') => {
    if (resendTimer > 0) return;
    alert(`Renvoyer l'OTP via ${via}... (simulation)`);
    setResendTimer(60);
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (errors.otp) setErrors({});
    if (value && index < otp.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }

    const joined = newOtp.join('');
    if (joined.length === 6) {
      // Auto-validate when all digits are filled
      if (joined !== '123456') {
        setErrors({ otp: 'Code OTP invalide. Veuillez réessayer.' });
        return;
      }
      setIsLoading(true);
      setIsAnimating(true);
      setTimeout(() => {
        setStep('accountType');
        setIsLoading(false);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength <= 2) return 'Faible';
    if (strength <= 3) return 'Moyen';
    return 'Fort';
  };

  const renderPasswordStrengthIndicator = () => {
    if (!formData.password) return null;
    
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Force du mot de passe</span>
          <span className={`font-medium ${
            passwordStrength <= 2 ? 'text-red-600' : 
            passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {getPasswordStrengthText(passwordStrength)}
          </span>
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full ${
                level <= passwordStrength 
                  ? getPasswordStrengthColor(passwordStrength)
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 'emailEntry':
        return (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">Créer votre compte</h2>
              <p className="text-gray-500 text-base font-light">Commençons par votre adresse e-mail</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-0">
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${
                    errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#DC0032]'
                  }`} size={20} />
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    aria-label="Adresse e-mail"
                    aria-invalid={!!errors.email}
                    className={`w-full pl-12 pr-12 py-3.5 text-base border-2 rounded-xl transition-all duration-200 ease-out placeholder-gray-400
                      ${errors.email 
                        ? 'border-red-500 bg-red-50/50 focus:border-red-600 focus:bg-red-50 focus:ring-4 focus:ring-red-100' 
                        : 'bg-white border-gray-200 hover:border-gray-300 focus:border-[#DC0032] focus:shadow-sm'
                      } focus:outline-none`}
                    placeholder="Entrez votre e-mail"
                  />
                  {errors.email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-fade-in">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  )}
                  {!errors.email && formData.email && validateEmail(formData.email) && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in">
                      <Check size={20} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'verifyEmail':
        return (
          <div className={`text-center transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">Vérifiez votre e-mail</h2>
            <p className="text-gray-500 mb-8 text-base">
              Nous avons envoyé un lien de vérification à
            </p>
            
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-8">
              <p className="text-base font-medium text-gray-800 break-all">{formData.email}</p>
            </div>
            
            
            <button 
              onClick={() => setStep('personalDetails')} 
              className="w-full bg-[#DC0032] text-white py-3.5 px-6 rounded-xl font-medium text-base 
                hover:bg-[#B80029] focus:outline-none focus:ring-4 focus:ring-red-200 
                transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              J'ai vérifié mon e-mail
            </button>
            
            <p className="mt-6 text-sm text-gray-500">
              Vous n'avez pas reçu l'e-mail ? Vérifiez vos spams ou{' '}
              <button className="text-[#DC0032] hover:text-[#B80029] hover:underline font-semibold transition-colors">
                renvoyer le lien
              </button>
            </p>
          </div>
        );
      case 'personalDetails':
        return (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">Vos informations</h2>
              <p className="text-gray-500 text-base font-light">Dites-nous en plus sur vous</p>
            </div>
            
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={18} />
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      aria-label="Prénom"
                      className={`w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out placeholder-gray-400 ${
                        errors.firstName 
                          ? 'border-red-400 focus:border-red-400' 
                          : ''
                      }`}
                      placeholder="Votre prénom"
                    />
                    {errors.firstName && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-0">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={18} />
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      aria-label="Nom"
                      className={`w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out placeholder-gray-400 ${
                        errors.lastName 
                          ? 'border-red-400 focus:border-red-400' 
                          : ''
                      }`}
                      placeholder="Votre nom"
                    />
                    {errors.lastName && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-0">
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    aria-label="Adresse complète"
                    className={`w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out placeholder-gray-400 ${
                      errors.address 
                        ? 'border-red-400 focus:border-red-400' 
                        : ''
                    }`}
                    placeholder="Rue, numéro, quartier..."
                  />
                  {errors.address && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0">
                    <select 
                      id="wilaya" 
                      name="wilaya" 
                      value={formData.wilaya} 
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      aria-label="Wilaya"
                      className={`w-full px-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out ${
                        errors.wilaya 
                          ? 'border-red-400 focus:border-red-400' 
                          : ''
                      }`}
                    >
                      <option value="">Sélectionner une wilaya...</option>
                      {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  {errors.wilaya && (
                    <p className="text-sm text-red-500 mt-1">{errors.wilaya}</p>
                  )}
                </div>
                <div className="space-y-0">
                    <select 
                      id="commune" 
                      name="commune" 
                      value={formData.commune} 
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      aria-label="Commune"
                      className={`w-full px-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out ${
                        errors.commune 
                          ? 'border-red-400 focus:border-red-400' 
                          : ''
                      }`}
                    >
                      <option value="">Sélectionner une commune...</option>
                      {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  {errors.commune && (
                    <p className="text-sm text-red-500 mt-1">{errors.commune}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-0">
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={18} />
                  <input 
                    type="tel" 
                    id="phoneNumber" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    aria-label="Numéro de téléphone (Algérie)"
                    className={`w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out placeholder-gray-400 ${
                      errors.phoneNumber 
                        ? 'border-red-400 focus:border-red-400' 
                        : ''
                    }`}
                    placeholder="0XXX XX XX XX"
                  />
                  {errors.phoneNumber && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
              </div>
              
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      name="isCompany" 
                      checked={formData.isCompany} 
                      onChange={handleInputChange} 
                      className="sr-only" 
                    />
                    <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                      formData.isCompany 
                        ? 'border-[#DC0032] bg-[#DC0032]' 
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {formData.isCompany && (
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Ce compte est pour une entreprise</span>
                    <p className="text-xs text-gray-500 mt-1">Cochez cette case si vous créez un compte professionnel</p>
                  </div>
                </label>
              </div>
              {formData.isCompany && (
                <div className="space-y-6 pt-6 border-t border-gray-200 mt-6 bg-gray-50 rounded-xl p-6">
                  <h3 className="font-medium text-gray-800 flex items-center text-lg">
                    <Building className="w-5 h-5 mr-2 text-gray-600" /> 
                    Informations sur l'entreprise
                  </h3>
                  
                  <div className="space-y-0">
                      <select 
                        id="companyType" 
                        name="companyType" 
                        value={formData.companyType} 
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        aria-label="Type d'entreprise"
                        className={`w-full px-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out ${
                          errors.companyType 
                            ? 'border-red-400 focus:border-red-400' 
                            : ''
                        }`}
                      >
                        <option value="">Sélectionner le type d'entreprise...</option>
                        {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    {errors.companyType && (
                      <p className="text-sm text-red-500 mt-1">{errors.companyType}</p>
                    )}
                  </div>
                  
                  <div className="space-y-0">
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        id="companyName" 
                        name="companyName" 
                        value={formData.companyName} 
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        aria-label="Nom de l'entreprise"
                        className={`w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out placeholder-gray-400 ${
                          errors.companyName 
                            ? 'border-red-400 focus:border-red-400' 
                            : ''
                        }`}
                        placeholder="Nom de votre entreprise"
                      />
                      {errors.companyName && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                      )}
                    </div>
                    {errors.companyName && (
                      <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-0">
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        id="companyAddress" 
                        name="companyAddress" 
                        value={formData.companyAddress} 
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        aria-label="Adresse complète de l'entreprise"
                        className={`w-full pl-12 pr-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out placeholder-gray-400 ${
                          errors.companyAddress 
                            ? 'border-red-400 focus:border-red-400' 
                            : ''
                        }`}
                        placeholder="Adresse complète de l'entreprise"
                      />
                      {errors.companyAddress && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                      )}
                    </div>
                    {errors.companyAddress && (
                      <p className="text-sm text-red-500 mt-1">{errors.companyAddress}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-0">
                        <select 
                          id="companyWilaya" 
                          name="companyWilaya" 
                          value={formData.companyWilaya} 
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          aria-label="Wilaya de l'entreprise"
                          className={`w-full px-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out ${
                            errors.companyWilaya 
                              ? 'border-red-400 focus:border-red-400' 
                              : ''
                          }`}
                        >
                          <option value="">Sélectionner une wilaya...</option>
                          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      {errors.companyWilaya && (
                        <p className="text-sm text-red-500 mt-1">{errors.companyWilaya}</p>
                      )}
                    </div>
                    <div className="space-y-0">
                        <select 
                          id="companyCommune" 
                          name="companyCommune" 
                          value={formData.companyCommune} 
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          aria-label="Commune de l'entreprise"
                          className={`w-full px-4 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out ${
                            errors.companyCommune 
                              ? 'border-red-400 focus:border-red-400' 
                              : ''
                          }`}
                        >
                          <option value="">Sélectionner une commune...</option>
                          {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      {errors.companyCommune && (
                        <p className="text-sm text-red-500 mt-1">{errors.companyCommune}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'verifyPhone':
        return (
          <div className={`text-center transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight">Vérification du téléphone</h2>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Code envoyé à <span className="font-medium text-gray-800">{formatPhoneNumber(formData.phoneNumber)}</span>
            </p>
            
            <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
              {otp.map((digit, index) => (
                <input 
                  key={index} 
                  ref={el => otpInputs.current[index] = el} 
                  type="text" 
                  inputMode="numeric" 
                  maxLength={1} 
                  value={digit} 
                  onChange={(e) => handleOtpChange(e.target, index)} 
                  onKeyDown={(e) => handleOtpKeyDown(e, index)} 
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-medium border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.otp 
                      ? 'border-red-400 bg-red-50' 
                      : digit 
                      ? 'border-primary-red bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-primary-red'
                  }`} 
                />
              ))}
            </div>
            
            {errors.otp && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errors.otp}
                </p>
              </div>
            )}
            
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-gray-500 text-sm">
                  Renvoyer le code dans <span className="font-semibold text-primary-red">{resendTimer}s</span>
                </p>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={() => handleResendOtp('sms')} 
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors duration-200"
                  >
                    Renvoyer par SMS
                  </button>
                  <button 
                    onClick={() => handleResendOtp('whatsapp')} 
                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <FaWhatsapp className="mr-2" /> 
                    Renvoyer par WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'accountType':
        return (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">Comment utiliserez-vous LINKSY ?</h2>
              <p className="text-gray-500 text-base">Cela nous aide à personnaliser votre expérience</p>
            </div>
            
            <div className="space-y-4">
              <div 
                onClick={() => setFormData(p => ({...p, accountType: 'normal'}))} 
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.accountType === 'normal' 
                    ? 'border-primary-red bg-red-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.accountType === 'normal' 
                      ? 'bg-primary-red text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-lg mb-2">Compte Normal</h3>
                    <p className="text-gray-600 mb-3">Pour une utilisation professionnelle standard, les campagnes et les fonctionnalités générales.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">SMS Marketing</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">E-mail Campaigns</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Analytics</span>
                    </div>
                  </div>
                  {formData.accountType === 'normal' && (
                    <CheckCircle className="w-5 h-5 text-primary-red" />
                  )}
                </div>
              </div>
              
              <div 
                onClick={() => setFormData(p => ({...p, accountType: 'developer'}))} 
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.accountType === 'developer' 
                    ? 'border-primary-red bg-red-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.accountType === 'developer' 
                      ? 'bg-primary-red text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Code className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-lg mb-2">Compte Développeur</h3>
                    <p className="text-gray-600 mb-3">Pour les développeurs individuels et les utilisateurs techniques nécessitant un accès API.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">API Access</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">Webhooks</span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">SDK</span>
                    </div>
                  </div>
                  {formData.accountType === 'developer' && (
                    <CheckCircle className="w-5 h-5 text-primary-red" />
                  )}
                </div>
              </div>
            </div>
            
            {errors.accountType && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errors.accountType}
                </p>
              </div>
            )}
          </div>
        );
      case 'setPassword':
        return (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">Finaliser votre compte</h2>
              <p className="text-gray-500 text-base">Choisissez un mot de passe sécurisé</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-0">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={18} />
                  <input 
                    type={isPasswordVisible ? 'text' : 'password'} 
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    aria-label="Mot de passe"
                    className={`w-full pl-12 pr-12 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out placeholder-gray-400 ${
                      errors.password 
                        ? 'border-red-400 focus:border-red-400' 
                        : ''
                    }`}
                    placeholder="Créez un mot de passe sécurisé"
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                    className="absolute inset-y-0 right-0 px-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {renderPasswordStrengthIndicator()}
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
              
              <div className="space-y-0">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={18} />
                  <input 
                    type={isConfirmPasswordVisible ? 'text' : 'password'} 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    aria-label="Confirmer le mot de passe"
                    className={`w-full pl-12 pr-12 py-4 text-base border-2 rounded-xl bg-gray-50/50 border-gray-200 focus:outline-none focus:ring-0 focus:border-primary-red focus:bg-white transition-all duration-300 ease-out placeholder-gray-400 ${
                      errors.confirmPassword 
                        ? 'border-red-400 focus:border-red-400' 
                        : ''
                    }`}
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} 
                    className="absolute inset-y-0 right-0 px-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isConfirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Sécurité de votre compte</h4>
                    <p className="text-sm text-blue-700">Votre mot de passe est chiffré et protégé. Nous ne pouvons pas le récupérer si vous l'oubliez.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const getStepIndex = () => {
    if (step === 'emailEntry' || step === 'verifyEmail') return 0;
    if (step === 'personalDetails') return 1;
    if (step === 'verifyPhone') return 2;
    if (step === 'accountType') return 3;
    if (step === 'setPassword') return 4;
    return -1;
  };
  const currentStepIndex = getStepIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="w-full min-h-screen md:grid md:grid-cols-2">
        {/* Left Panel - Brand Section */}
        <div className="hidden md:flex flex-col bg-gradient-to-br from-[#DC0032] to-[#B80029] p-12 text-white relative overflow-hidden">
          {/* Elegant Geometric Background */}
          <div className="absolute inset-0">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent"></div>
            
            {/* Minimalist geometric shapes */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full"></div>
            <div className="absolute top-1/3 -left-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full"></div>
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Logo */}
            <div className="mb-8">
              <Logo />
            </div>
            
            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col justify-center max-w-lg">
              <h1 className="text-6xl font-light mb-6 tracking-tight leading-tight">
                Commencez gratuitement
              </h1>
              <p className="text-white/90 text-xl leading-relaxed font-light mb-12">
                Créez votre compte et découvrez une plateforme complète pour gérer vos communications
              </p>
              
              {/* Simple feature tags */}
              <div className="flex flex-wrap gap-3">
                {['SMS & Email', 'Hébergement', 'API', 'Support 24/7'].map((feature, index) => (
                  <span key={index} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-light border border-white/20">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Bottom Quote/Feature */}
            <div className="mt-auto pt-12 border-t border-white/10">
              <p className="text-white/70 text-sm font-light italic">
                "Rejoignez des milliers d'entreprises qui font confiance à LINKSY"
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="flex flex-col min-h-screen md:min-h-0 bg-white">
          {/* Mobile Header with Logo */}
          <div className="md:hidden px-6 py-4 border-b border-gray-100 flex justify-center">
            <Logo variant="light" />
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
            <div className="w-full max-w-md">
            {step !== 'verifyEmail' && (
              <div className="mb-8">
                <div className="flex items-center justify-center">
                  {STEPS_CONFIG.map((s, index) => (
                    <React.Fragment key={s.id}>
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          index <= currentStepIndex 
                            ? 'bg-primary-red border-primary-red text-white shadow-sm' 
                            : 'border-gray-300 text-gray-400 bg-white'
                        }`}>
                          {index < currentStepIndex ? (
                            <Check size={12} className="sm:w-3.5 sm:h-3.5" />
                          ) : (
                            <s.icon size={12} className="sm:w-3.5 sm:h-3.5" />
                          )}
                        </div>
                        <p className={`hidden sm:block text-xs mt-2 font-medium transition-colors duration-300 ${
                          index <= currentStepIndex 
                            ? 'text-primary-red' 
                            : 'text-gray-500'
                        }`}>
                          {s.title}
                        </p>
                      </div>
                      {index < STEPS_CONFIG.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1.5 sm:mx-3 rounded-full transition-all duration-500 ${
                          index < currentStepIndex 
                            ? 'bg-primary-red' 
                            : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            {renderStepContent()}
            {step !== 'verifyEmail' && (
              <div className="pt-4">
                <button 
                  onClick={handleNextStep} 
                  disabled={isLoading || isAnimating || !isStepValid(step)} 
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-base 
                    focus:outline-none focus:ring-4 focus:ring-red-200
                    transition-all duration-200 flex items-center justify-center
                    shadow-sm hover:shadow-md
                    disabled:cursor-not-allowed group
                    ${isLoading || isAnimating || !isStepValid(step)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-[#DC0032] text-white hover:bg-[#B80029] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      {step === 'setPassword' ? 'Terminer l\'inscription' : 'Continuer'}
                      {step !== 'setPassword' && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </>
                  )}
                </button>
              </div>
            )}
            <p className="mt-6 text-center text-base text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login2" className="font-semibold text-[#DC0032] hover:text-[#B80029] transition-colors focus:outline-none focus:underline">Connectez-vous</Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register2;
