import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { AlertCircle } from 'lucide-react'; // Import icon for errors

// Helper component for inline errors (similar to Register page)
const InputError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-600 flex items-center">
      <AlertCircle className="w-4 h-4 mr-1" />
      {message}
    </p>
  );
};


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for login errors
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      // setError('Please enter both email and password.');
      setError("Veuillez saisir l'adresse e-mail et le mot de passe.");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt with:', { email }); // Don't log password
      // Simulate success/failure
      if (email === "user@example.com" && password === "password123") { // Example credentials
        console.log('Login successful!');
        // alert('Login successful!'); // Replace alert
        navigate('/'); // Redirect to dashboard on success
      } else {
        // setError('Invalid email or password.');
        setError("Adresse e-mail ou mot de passe invalide.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setError('');
    setIsLoading(true);
    console.log('Google login initiated');
    // Simulate Google Login API call
    setTimeout(() => {
        // Simulate success
        console.log('Google login successful!');
        // alert('Google login successful!'); // Replace alert
        navigate('/'); // Redirect on success
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
       {/* Optional: Add Logo or App Name Here */}
       {/* <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
         <img className="mx-auto h-12 w-auto" src="/path-to-your-logo.svg" alt="LINKSY" />
       </div> */}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
           <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            {/* Log in to your account */}
            Connectez-vous à votre compte
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {/* Email address */}
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }} // Clear error on change
                className={`w-full input-field ${error ? 'border-red-500' : 'border-gray-300'}`}
                required
                aria-invalid={!!error}
                aria-describedby="login-error"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {/* Password */}
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }} // Clear error on change
                className={`w-full input-field ${error ? 'border-red-500' : 'border-gray-300'}`}
                required
                aria-invalid={!!error}
                aria-describedby="login-error"
              />
            </div>

            {/* Display Login Error */}
            <InputError message={error} />


            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#DC0032] focus:ring-[#DC0032] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {/* Remember me */}
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#DC0032] hover:text-[#c40029] hover:underline">
                  {/* Forgot your password? */}
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#DC0032] hover:bg-[#c40029] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC0032] transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {/* {isLoading ? 'Logging in...' : 'Log in'} */}
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {/* Or continue with */}
                  Ou continuer avec
                  </span>
              </div>
            </div>

            <div className="mt-6">
               <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC0032] transition-colors disabled:opacity-50"
              >
                {/* <span className="sr-only">Sign in with Google</span> */}
                <span className="sr-only">Se connecter avec Google</span>
                 <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google logo"
                  className="w-5 h-5 mr-2" // Added margin
                />
                {/* Sign in with Gmail */}
                Se connecter avec Gmail
              </button>
            </div>
          </div>

           {/* Link to Register Page */}
           <p className="mt-8 text-center text-sm text-gray-600">
            {/* Don't have an account?{' '} */}
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="font-medium text-[#DC0032] hover:text-[#c40029] hover:underline">
              {/* Sign up */}
              S'inscrire
            </Link>
          </p>

        </div>
      </div>
       {/* Simple CSS for input fields (consistent with Register) */}
      <style jsx>{`
        .input-field {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          appearance: none; /* Fix potential iOS styling issues */
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
      `}</style>
    </div>
  );
};

export default Login;
