import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Check, Loader2, ArrowRight, Lock } from 'lucide-react';
import Logo from '../components/navigation/Logo';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (emailValue: string) => {
    return /\S+@\S+\.\S+/.test(emailValue);
  };

  const validate = () => {
    const newErrors: { email?: string; general?: string } = {};
    if (!email) {
      newErrors.email = "L'adresse e-mail est requise.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Le format de l'adresse e-mail est invalide.";
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
      setIsEmailSent(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigate('/login2');
  };

  if (isEmailSent) {
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
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Check className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h1 className="text-6xl font-light mb-6 tracking-tight leading-tight">
                  Vérifiez votre e-mail
                </h1>
                <p className="text-white/90 text-xl leading-relaxed font-light">
                  Nous vous avons envoyé un lien de réinitialisation. Consultez votre boîte de réception.
                </p>
              </div>
              
              {/* Bottom Quote/Feature */}
              <div className="mt-auto pt-12 border-t border-white/10">
                <p className="text-white/70 text-sm font-light">
                  Le lien expire dans <span className="font-medium text-white">24 heures</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Success Message */}
          <div className="flex flex-col min-h-screen md:min-h-0 bg-white">
            {/* Mobile Header with Logo */}
            <div className="md:hidden px-6 py-4 border-b border-gray-100 flex justify-center">
              <Logo variant="light" />
            </div>
            
            <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
              <div className="w-full max-w-md">

              {/* Success Icon */}
              <div className="text-center mb-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-600" strokeWidth={2.5} />
                  </div>
                </div>
                <h2 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
                  E-mail envoyé
                </h2>
                <p className="text-gray-600 text-base">
                  Nous avons envoyé un lien de réinitialisation à{' '}
                  <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </div>
              
              {/* Next Steps */}
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-blue-900 mb-4">Prochaines étapes :</h3>
                  <ol className="text-sm text-blue-800 space-y-3">
                    {[
                      'Vérifiez votre boîte de réception',
                      'Cliquez sur le lien de réinitialisation',
                      'Créez votre nouveau mot de passe'
                    ].map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 font-semibold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Back to Login Button */}
                <div className="pt-2">
                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-3.5 px-6 rounded-xl font-medium text-base bg-[#DC0032] text-white hover:bg-[#B80029] 
                      focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 flex items-center justify-center 
                      shadow-sm hover:shadow-md active:scale-[0.98] group"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                    Retour à la connexion
                  </button>
                </div>

                {/* Resend Link */}
                <div className="text-center">
                  <p className="text-gray-600 text-base">
                    Vous n'avez pas reçu l'e-mail ?{' '}
                    <button 
                      onClick={() => setIsEmailSent(false)}
                      className="font-semibold text-[#DC0032] hover:text-[#B80029] transition-colors focus:outline-none focus:underline"
                    >
                      Renvoyer
                    </button>
                  </p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Lock className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-6xl font-light mb-6 tracking-tight leading-tight">
                Réinitialisez votre mot de passe
              </h1>
              <p className="text-white/90 text-xl leading-relaxed font-light">
                Pas d'inquiétude, cela arrive. Nous allons vous aider à retrouver l'accès à votre compte.
              </p>
            </div>
            
            {/* Bottom Quote/Feature */}
            <div className="mt-auto pt-12 border-t border-white/10">
              <p className="text-white/70 text-sm font-light italic">
                "Votre sécurité est notre priorité"
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="flex flex-col min-h-screen md:min-h-0 bg-white">
          {/* Mobile Header with Logo */}
          <div className="md:hidden px-6 py-4 border-b border-gray-100 flex justify-center">
            <Logo color="#DC0032" />
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
            <div className="w-full max-w-md">

            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
                Réinitialiser le mot de passe
              </h2>
              <p className="text-gray-500 text-base font-light">
                Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
              </p>
            </div>
            
            {/* Reset Form */}
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
                    onChange={(e) => setEmail(e.target.value)} 
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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-base 
                    focus:outline-none focus:ring-4 focus:ring-red-200
                    transition-all duration-200 flex items-center justify-center
                    shadow-sm hover:shadow-md
                    disabled:cursor-not-allowed group
                    ${!email.trim() || isLoading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-[#DC0032] text-white hover:bg-[#B80029] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le lien
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-base">
                Vous vous souvenez de votre mot de passe ?{' '}
                <Link 
                  to="/login2" 
                  className="font-semibold text-[#DC0032] hover:text-[#B80029] transition-colors focus:outline-none focus:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleBackToLogin}
                className="flex items-center justify-center mx-auto text-gray-500 hover:text-gray-700 transition-colors group focus:outline-none"
              >
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm">Retour à la connexion</span>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
