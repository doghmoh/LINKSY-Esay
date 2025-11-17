import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, Check, Loader2, Eye, EyeOff } from "lucide-react";
import Logo from "../../../shared/components/navigation/Logo";

const ResetPasswordConfirm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the token from URL parameters (e.g., /reset?token=xyz)
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setErrors({
        general:
          "Lien invalide ou expiré. Veuillez demander un nouveau lien de réinitialisation.",
      });
    }
    setToken(tokenParam);
  }, [searchParams]);

  const validatePassword = (passwordValue: string) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const minLength = passwordValue.length >= 8;
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);

    return minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const validate = () => {
    const newErrors: {
      password?: string;
      confirmPassword?: string;
      general?: string;
    } = {};

    if (!password) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      setErrors({ general: "Lien invalide ou expiré." });
      return;
    }

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call to reset password
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login2");
      }, 2000);
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigate("/login2");
  };

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="w-full min-h-screen md:grid md:grid-cols-2">
          {/* Left Panel - Brand Section */}
          <div className="hidden md:flex flex-col bg-gradient-to-br from-[#DC0032] to-[#B80029] p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent"></div>
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full"></div>
              <div className="absolute top-1/3 -left-20 w-64 h-64 bg-white/5 rounded-full"></div>
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-8">
                <Logo />
              </div>

              <div className="flex-1 flex flex-col justify-center max-w-lg">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Check className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h1 className="text-6xl font-light mb-6 tracking-tight leading-tight">
                  Mot de passe modifié
                </h1>
                <p className="text-white/90 text-xl leading-relaxed font-light">
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez
                  maintenant vous connecter.
                </p>
              </div>

              <div className="mt-auto pt-12 border-t border-white/10">
                <p className="text-white/70 text-sm font-light">
                  Redirection en cours...
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Success Message */}
          <div className="flex flex-col min-h-screen md:min-h-0 bg-white">
            <div className="md:hidden px-6 py-4 border-b border-gray-100 flex justify-center">
              <Logo variant="light" />
            </div>

            <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
              <div className="w-full max-w-md">
                <div className="text-center mb-10">
                  <div className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <Check
                        className="w-10 h-10 text-green-600"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                  <h2 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
                    Succès !
                  </h2>
                  <p className="text-gray-600 text-base">
                    Votre mot de passe a été réinitialisé avec succès.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <p className="text-sm text-green-800">
                      Vous allez être redirigé vers la page de connexion dans
                      quelques instants...
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleBackToLogin}
                      className="w-full py-3.5 px-6 rounded-xl font-medium text-base bg-[#DC0032] text-white hover:bg-[#B80029] 
                        focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 flex items-center justify-center 
                        shadow-sm hover:shadow-md active:scale-[0.98] group"
                    >
                      Se connecter maintenant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset Password Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="w-full min-h-screen md:grid md:grid-cols-2">
        {/* Left Panel - Brand Section */}
        <div className="hidden md:flex flex-col bg-gradient-to-br from-[#DC0032] to-[#B80029] p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full"></div>
            <div className="absolute top-1/3 -left-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="mb-8">
              <Logo />
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-lg">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Lock className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-6xl font-light mb-6 tracking-tight leading-tight">
                Nouveau mot de passe
              </h1>
              <p className="text-white/90 text-xl leading-relaxed font-light">
                Choisissez un mot de passe fort et unique pour sécuriser votre
                compte.
              </p>
            </div>

            <div className="mt-auto pt-12 border-t border-white/10">
              <p className="text-white/70 text-sm font-light italic">
                "Votre sécurité est notre priorité"
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="flex flex-col min-h-screen md:min-h-0 bg-white">
          <div className="md:hidden px-6 py-4 border-b border-gray-100 flex justify-center">
            <Logo color="#DC0032" />
          </div>

          <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
            <div className="w-full max-w-md">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
                  Créer un nouveau mot de passe
                </h2>
                <p className="text-gray-500 text-base font-light">
                  Entrez votre nouveau mot de passe ci-dessous
                </p>
              </div>

              {/* Error for invalid token */}
              {errors.general && !token && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-red-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">
                      {errors.general}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/reset-password"
                      className="text-sm text-red-700 hover:text-red-800 underline font-medium"
                    >
                      Demander un nouveau lien
                    </Link>
                  </div>
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nouveau mot de passe
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${
                        errors.password
                          ? "text-red-500"
                          : "text-gray-400 group-focus-within:text-[#DC0032]"
                      }`}
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-label="Nouveau mot de passe"
                      aria-invalid={!!errors.password}
                      className={`w-full pl-12 pr-12 py-3.5 text-base border-2 rounded-xl transition-all duration-200 ease-out placeholder-gray-400
                        ${
                          errors.password
                            ? "border-red-500 bg-red-50/50 focus:border-red-600 focus:bg-red-50 focus:ring-4 focus:ring-red-100"
                            : "bg-white border-gray-200 hover:border-gray-300 focus:border-[#DC0032] focus:shadow-sm"
                        } focus:outline-none`}
                      placeholder="••••••••"
                      disabled={!token}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 ml-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.password}
                    </p>
                  )}
                  {/* Password Strength Indicators */}
                  {password && (
                    <div className="ml-1 space-y-1">
                      <p className="text-xs text-gray-600 font-medium">
                        Votre mot de passe doit contenir :
                      </p>
                      <ul className="text-xs space-y-0.5">
                        <li
                          className={`flex items-center gap-1 ${
                            password.length >= 8
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <Check size={14} strokeWidth={2.5} />
                          Au moins 8 caractères
                        </li>
                        <li
                          className={`flex items-center gap-1 ${
                            /[A-Z]/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <Check size={14} strokeWidth={2.5} />
                          Une lettre majuscule
                        </li>
                        <li
                          className={`flex items-center gap-1 ${
                            /[a-z]/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <Check size={14} strokeWidth={2.5} />
                          Une lettre minuscule
                        </li>
                        <li
                          className={`flex items-center gap-1 ${
                            /[0-9]/.test(password)
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          <Check size={14} strokeWidth={2.5} />
                          Un chiffre
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${
                        errors.confirmPassword
                          ? "text-red-500"
                          : "text-gray-400 group-focus-within:text-[#DC0032]"
                      }`}
                      size={20}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      aria-label="Confirmer le mot de passe"
                      aria-invalid={!!errors.confirmPassword}
                      className={`w-full pl-12 pr-12 py-3.5 text-base border-2 rounded-xl transition-all duration-200 ease-out placeholder-gray-400
                        ${
                          errors.confirmPassword
                            ? "border-red-500 bg-red-50/50 focus:border-red-600 focus:bg-red-50 focus:ring-4 focus:ring-red-100"
                            : "bg-white border-gray-200 hover:border-gray-300 focus:border-[#DC0032] focus:shadow-sm"
                        } focus:outline-none`}
                      placeholder="••••••••"
                      disabled={!token}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                    {confirmPassword &&
                      password === confirmPassword &&
                      !errors.confirmPassword && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in">
                          <Check size={20} strokeWidth={2.5} />
                        </div>
                      )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 ml-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* General Error Message */}
                {errors.general && token && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in-up">
                    <div className="flex items-center gap-2 justify-center">
                      <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <p className="text-sm text-red-700 font-medium">
                        {errors.general}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !password.trim() ||
                      !confirmPassword.trim() ||
                      !token
                    }
                    className={`w-full py-3.5 px-6 rounded-xl font-medium text-base 
                      focus:outline-none focus:ring-4 focus:ring-red-200
                      transition-all duration-200 flex items-center justify-center
                      shadow-sm hover:shadow-md
                      disabled:cursor-not-allowed group
                      ${
                        !password.trim() ||
                        !confirmPassword.trim() ||
                        isLoading ||
                        !token
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                          : "bg-[#DC0032] text-white hover:bg-[#B80029] active:scale-[0.98]"
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Réinitialisation...
                      </>
                    ) : (
                      <>
                        Réinitialiser le mot de passe
                        <Check className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Back to Login Link */}
              <div className="mt-8 text-center">
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

export default ResetPasswordConfirm;
