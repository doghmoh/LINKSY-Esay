import React from 'react';

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
  expirationTime?: string; // e.g., "1 heure"
}

/**
 * Template d'email pour la réinitialisation de mot de passe
 * Ce composant génère le HTML de l'email à envoyer à l'utilisateur
 */
const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  userName,
  resetLink,
  expirationTime = "1 heure"
}) => {
  // Fonction pour générer le HTML de l'email
  const generateEmailHTML = () => {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de votre mot de passe</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #DC0032 0%, #B80029 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: 300;
            letter-spacing: -0.5px;
            margin: 0;
        }
        .content {
            padding: 50px 30px;
        }
        .greeting {
            font-size: 24px;
            font-weight: 300;
            color: #1a1a1a;
            margin: 0 0 20px 0;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4a4a4a;
            margin: 0 0 30px 0;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .reset-button {
            display: inline-block;
            padding: 16px 40px;
            background-color: #DC0032;
            color: #ffffff;
            text-decoration: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .reset-button:hover {
            background-color: #B80029;
        }
        .divider {
            margin: 40px 0;
            border: 0;
            border-top: 1px solid #e5e5e5;
        }
        .alternative-text {
            font-size: 14px;
            color: #6b6b6b;
            margin: 20px 0 10px 0;
        }
        .link-box {
            background-color: #f8f9fa;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 15px;
            word-break: break-all;
            font-size: 13px;
            color: #DC0032;
            font-family: monospace;
        }
        .info-box {
            background-color: #fff3f3;
            border-left: 4px solid #DC0032;
            padding: 15px 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.5;
        }
        .info-box strong {
            color: #DC0032;
        }
        .warning-box {
            background-color: #fff8e6;
            border-left: 4px solid #ffa500;
            padding: 15px 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .warning-box p {
            margin: 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.5;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e5e5;
        }
        .footer-text {
            font-size: 13px;
            color: #6b6b6b;
            margin: 5px 0;
            line-height: 1.5;
        }
        .footer-links {
            margin: 20px 0 10px 0;
        }
        .footer-link {
            color: #DC0032;
            text-decoration: none;
            margin: 0 10px;
            font-size: 13px;
        }
        .footer-link:hover {
            text-decoration: underline;
        }
        .security-notice {
            font-size: 12px;
            color: #888888;
            margin: 20px 0 0 0;
            padding: 15px;
            background-color: #ffffff;
            border-radius: 8px;
            line-height: 1.5;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .greeting {
                font-size: 20px;
            }
            .message {
                font-size: 15px;
            }
            .reset-button {
                padding: 14px 30px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">Votre Logo</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="greeting">Bonjour ${userName},</h2>
            
            <p class="message">
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. 
                Si vous êtes à l'origine de cette demande, cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
            </p>

            <!-- Call to Action Button -->
            <div class="button-container">
                <a href="${resetLink}" class="reset-button">
                    Réinitialiser mon mot de passe
                </a>
            </div>

            <!-- Important Information Box -->
            <div class="info-box">
                <p>
                    <strong>⏱️ Important :</strong> Ce lien de réinitialisation est valable pendant ${expirationTime}. 
                    Passé ce délai, vous devrez faire une nouvelle demande de réinitialisation.
                </p>
            </div>

            <!-- Warning Box -->
            <div class="warning-box">
                <p>
                    <strong>⚠️ Attention :</strong> Si vous n'avez pas demandé cette réinitialisation, 
                    veuillez ignorer cet e-mail. Votre mot de passe actuel restera inchangé et votre compte est en sécurité.
                </p>
            </div>

            <hr class="divider">

            <!-- Alternative Link Section -->
            <p class="alternative-text">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            <div class="link-box">
                ${resetLink}
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
                <strong>🔒 Conseils de sécurité :</strong><br>
                • Ne partagez jamais votre mot de passe avec qui que ce soit<br>
                • Utilisez un mot de passe unique et complexe<br>
                • Activez l'authentification à deux facteurs si disponible<br>
                • Si vous pensez que votre compte est compromis, contactez-nous immédiatement
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="#" class="footer-link">Centre d'aide</a>
                <span style="color: #d0d0d0;">|</span>
                <a href="#" class="footer-link">Contactez-nous</a>
                <span style="color: #d0d0d0;">|</span>
                <a href="#" class="footer-link">Sécurité du compte</a>
            </div>
            
            <p class="footer-text">
                © ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
            </p>
            <p class="footer-text">
                Vous recevez cet e-mail car une demande de réinitialisation de mot de passe a été effectuée pour votre compte.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  };

  return (
    <div dangerouslySetInnerHTML={{ __html: generateEmailHTML() }} />
  );
};

// Fonction utilitaire pour générer uniquement le HTML (pour l'envoi par backend)
export const generatePasswordResetEmailHTML = (
  userName: string,
  resetLink: string,
  expirationTime: string = "1 heure"
): string => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de votre mot de passe</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #DC0032 0%, #B80029 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: 300;
            letter-spacing: -0.5px;
            margin: 0;
        }
        .content {
            padding: 50px 30px;
        }
        .greeting {
            font-size: 24px;
            font-weight: 300;
            color: #1a1a1a;
            margin: 0 0 20px 0;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4a4a4a;
            margin: 0 0 30px 0;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .reset-button {
            display: inline-block;
            padding: 16px 40px;
            background-color: #DC0032;
            color: #ffffff;
            text-decoration: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .reset-button:hover {
            background-color: #B80029;
        }
        .divider {
            margin: 40px 0;
            border: 0;
            border-top: 1px solid #e5e5e5;
        }
        .alternative-text {
            font-size: 14px;
            color: #6b6b6b;
            margin: 20px 0 10px 0;
        }
        .link-box {
            background-color: #f8f9fa;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 15px;
            word-break: break-all;
            font-size: 13px;
            color: #DC0032;
            font-family: monospace;
        }
        .info-box {
            background-color: #fff3f3;
            border-left: 4px solid #DC0032;
            padding: 15px 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.5;
        }
        .info-box strong {
            color: #DC0032;
        }
        .warning-box {
            background-color: #fff8e6;
            border-left: 4px solid #ffa500;
            padding: 15px 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .warning-box p {
            margin: 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.5;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e5e5;
        }
        .footer-text {
            font-size: 13px;
            color: #6b6b6b;
            margin: 5px 0;
            line-height: 1.5;
        }
        .footer-links {
            margin: 20px 0 10px 0;
        }
        .footer-link {
            color: #DC0032;
            text-decoration: none;
            margin: 0 10px;
            font-size: 13px;
        }
        .footer-link:hover {
            text-decoration: underline;
        }
        .security-notice {
            font-size: 12px;
            color: #888888;
            margin: 20px 0 0 0;
            padding: 15px;
            background-color: #ffffff;
            border-radius: 8px;
            line-height: 1.5;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .greeting {
                font-size: 20px;
            }
            .message {
                font-size: 15px;
            }
            .reset-button {
                padding: 14px 30px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">Votre Logo</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="greeting">Bonjour ${userName},</h2>
            
            <p class="message">
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. 
                Si vous êtes à l'origine de cette demande, cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
            </p>

            <!-- Call to Action Button -->
            <div class="button-container">
                <a href="${resetLink}" class="reset-button">
                    Réinitialiser mon mot de passe
                </a>
            </div>

            <!-- Important Information Box -->
            <div class="info-box">
                <p>
                    <strong>⏱️ Important :</strong> Ce lien de réinitialisation est valable pendant ${expirationTime}. 
                    Passé ce délai, vous devrez faire une nouvelle demande de réinitialisation.
                </p>
            </div>

            <!-- Warning Box -->
            <div class="warning-box">
                <p>
                    <strong>⚠️ Attention :</strong> Si vous n'avez pas demandé cette réinitialisation, 
                    veuillez ignorer cet e-mail. Votre mot de passe actuel restera inchangé et votre compte est en sécurité.
                </p>
            </div>

            <hr class="divider">

            <!-- Alternative Link Section -->
            <p class="alternative-text">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            <div class="link-box">
                ${resetLink}
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
                <strong>🔒 Conseils de sécurité :</strong><br>
                • Ne partagez jamais votre mot de passe avec qui que ce soit<br>
                • Utilisez un mot de passe unique et complexe<br>
                • Activez l'authentification à deux facteurs si disponible<br>
                • Si vous pensez que votre compte est compromis, contactez-nous immédiatement
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="#" class="footer-link">Centre d'aide</a>
                <span style="color: #d0d0d0;">|</span>
                <a href="#" class="footer-link">Contactez-nous</a>
                <span style="color: #d0d0d0;">|</span>
                <a href="#" class="footer-link">Sécurité du compte</a>
            </div>
            
            <p class="footer-text">
                © ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
            </p>
            <p class="footer-text">
                Vous recevez cet e-mail car une demande de réinitialisation de mot de passe a été effectuée pour votre compte.
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
};

export default PasswordResetEmail;
