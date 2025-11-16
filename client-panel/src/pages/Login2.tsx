import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Check, Eye, EyeOff, Loader2, Github } from 'lucide-react';
import Logo from '../components/navigation/Logo';

const Login2: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (emailValue: string) => {
    return /\S+@\S+\.\S+/.test(emailValue);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    const isValid = validateEmail(emailValue);
    
    if (isValid) {
      // Add a small delay for smoother transition
      setTimeout(() => {
        setShowPasswordField(true);
      }, 150);
      setErrors(prev => ({ ...prev, email: undefined }));
    } else {
      setShowPasswordField(false);
      setPassword(''); // Clear password when email becomes invalid
    }
  };

  const validate = () => {
    const newErrors: { email?: string; general?: string } = {};
    if (!email) {
      newErrors.email = "L'adresse e-mail est requise.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Le format de l'adresse e-mail est invalide.";
    }
    if (showPasswordField && !password) {
      newErrors.general = "Le mot de passe est requis.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === "user@example.com" && password === "password123") {
        navigate('/');
      } else {
        setErrors({ general: "Adresse e-mail ou mot de passe invalide." });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

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
                Bienvenue
              </h1>
              <p className="text-white/90 text-xl leading-relaxed font-light">
                Connectez-vous pour accéder à votre plateforme de communication unifiée
              </p>
            </div>
            
            {/* Bottom Quote/Feature */}
            <div className="mt-auto pt-12 border-t border-white/10">
              <p className="text-white/70 text-sm font-light italic">
                "Simplifiez votre communication digitale avec LINKSY"
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="flex flex-col min-h-screen md:min-h-0 bg-white">
          {/* Mobile Header with Logo */}
          <div className="md:hidden px-6 py-4 border-b border-gray-100 flex justify-center">
            <Logo variant="light" />
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
            <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
                Se connecter
              </h2>
              <p className="text-gray-500 text-base font-light">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative group">
                  <Mail 
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${
                      errors.email 
                        ? 'text-red-500' 
                        : 'text-gray-400 group-focus-within:text-[#DC0032]'
                    }`}
                    size={20} 
                  />
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={email} 
                    onChange={handleEmailChange} 
                    aria-label="Adresse e-mail"
                    aria-invalid={!!errors.email}
                    className={`w-full pl-12 pr-12 py-3.5 text-base border-2 rounded-xl transition-all duration-200 ease-out placeholder-gray-400
                      ${errors.email 
                        ? 'border-red-500 bg-red-50/50 focus:border-red-600 focus:bg-red-50 focus:ring-4 focus:ring-red-100' 
                        : 'bg-white border-gray-200 hover:border-gray-300 focus:border-[#DC0032] focus:shadow-sm'
                      } focus:outline-none`} 
                    placeholder="votre@email.com" 
                  />
                  {errors.email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-fade-in">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  )}
                  {validateEmail(email) && !errors.email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in">
                      <Check size={20} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 ml-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Password Field with Smooth Transition */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  showPasswordField 
                    ? 'max-h-32 opacity-100 translate-y-0' 
                    : 'max-h-0 opacity-0 -translate-y-2'
                }`}
                style={{
                  transitionProperty: 'max-height, opacity, transform',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="space-y-2">
                  <div className="relative group">
                    <Lock 
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${
                        errors.general 
                          ? 'text-red-500' 
                          : 'text-gray-400 group-focus-within:text-[#DC0032]'
                      }`}
                      size={20} 
                    />
                    <input 
                      type={isPasswordVisible ? 'text' : 'password'} 
                      id="password" 
                      name="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      aria-label="Mot de passe"
                      aria-invalid={!!errors.general}
                      className={`w-full pl-12 pr-12 py-3.5 text-base border-2 rounded-xl transition-all duration-200 placeholder-gray-400
                        ${errors.general 
                          ? 'border-red-500 bg-red-50/50 focus:border-red-600 focus:bg-red-50 focus:ring-4 focus:ring-red-100' 
                          : 'bg-white border-gray-200 hover:border-gray-300 focus:border-[#DC0032] focus:shadow-sm'
                        } focus:outline-none`} 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                      className={`absolute inset-y-0 right-0 px-4 transition-colors z-10 focus:outline-none ${
                        errors.general ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      aria-label={isPasswordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in-up">
                  <div className="flex items-center gap-2 justify-center">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only" 
                    />
                    <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                      rememberMe 
                        ? 'border-[#DC0032] bg-[#DC0032]' 
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {rememberMe && (
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors select-none">
                    Se souvenir de moi
                  </span>
                </label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword} 
                  className="text-[#DC0032] hover:text-[#B80029] transition-colors font-medium focus:outline-none focus:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || (showPasswordField && !password.trim())}
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-base 
                    focus:outline-none focus:ring-4 focus:ring-red-200
                    transition-all duration-200 flex items-center justify-center
                    shadow-sm hover:shadow-md
                    disabled:cursor-not-allowed group
                    ${!email.trim() || (showPasswordField && !password.trim()) || isLoading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-[#DC0032] text-white hover:bg-[#B80029] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      {showPasswordField ? 'Se connecter' : 'Continuer'}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Ou continuer avec
                  </span>
                </div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  className="flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 
                    hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm
                    focus:outline-none focus:ring-4 focus:ring-gray-100 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    active:scale-95"
                  aria-label="Se connecter avec Google"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                    alt="" 
                    className="w-5 h-5" 
                  />
                  <span className="ml-2">Google</span>
                </button>
                
                <button
                  type="button"
                  disabled={isLoading}
                  className="flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 
                    hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm
                    focus:outline-none focus:ring-4 focus:ring-gray-100 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    active:scale-95"
                  aria-label="Se connecter avec GitHub"
                >
                  <Github className="w-5 h-5" />
                  <span className="ml-2">GitHub</span>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-base">
                Vous n'avez pas de compte ?{' '}
                <Link 
                  to="/register2" 
                  className="font-semibold text-[#DC0032] hover:text-[#B80029] transition-colors focus:outline-none focus:underline"
                >
                  Inscrivez-vous
                </Link>
              </p>
            </div>

            {/* Terms & Privacy */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                En vous connectant, vous acceptez nos{' '}
                <a href="#" className="text-[#DC0032] hover:underline">Conditions d'utilisation</a>
                {' '}et notre{' '}
                <a href="#" className="text-[#DC0032] hover:underline">Politique de confidentialité</a>
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login2;
