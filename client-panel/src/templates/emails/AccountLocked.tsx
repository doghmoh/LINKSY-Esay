import React from 'react';

interface AccountLockedEmailProps {
  userName: string;
  unlockLink: string;
  attemptCount?: number; // Nombre de tentatives effectuées
  lockDuration?: string; // e.g., "30 minutes"
  ipAddress?: string; // Adresse IP de la tentative
  attemptTime?: string; // Heure de la tentative
}

/**
 * Template d'email pour le verrouillage de compte après plusieurs tentatives de connexion
 * Ce composant génère le HTML de l'email à envoyer à l'utilisateur
 */
const AccountLockedEmail: React.FC<AccountLockedEmailProps> = ({
  userName,
  unlockLink,
  attemptCount = 3,
  lockDuration = "30 minutes",
  ipAddress,
  attemptTime
}) => {
  // Fonction pour générer le HTML de l'email
  const generateEmailHTML = () => {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compte temporairement verrouillé</title>
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
        .alert-badge {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-top: 15px;
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
        .unlock-button {
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
        .unlock-button:hover {
            background-color: #B80029;
        }
        .divider {
            margin: 40px 0;
            border: 0;
            border-top: 1px solid #e5e5e5;
        }
        .alert-box {
            background-color: #fff3f3;
            border-left: 4px solid #DC0032;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .alert-box p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.5;
        }
        .alert-box p:last-child {
            margin-bottom: 0;
        }
        .alert-box strong {
            color: #DC0032;
        }
        .info-table {
            width: 100%;
            background-color: #f8f9fa;
            border-radius: 8px;
            overflow: hidden;
            margin: 20px 0;
        }
        .info-row {
            display: flex;
            padding: 12px 20px;
            border-bottom: 1px solid #e5e5e5;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            flex: 0 0 40%;
            font-weight: 600;
            color: #6b6b6b;
            font-size: 14px;
        }
        .info-value {
            flex: 1;
            color: #1a1a1a;
            font-size: 14px;
        }
        .warning-box {
            background-color: #fff8e6;
            border-left: 4px solid #ffa500;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .warning-box p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.5;
        }
        .warning-box p:last-child {
            margin-bottom: 0;
        }
        .warning-box strong {
            color: #cc8800;
        }
        .steps-list {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px 20px 20px 45px;
            margin: 20px 0;
        }
        .steps-list li {
            margin: 12px 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.6;
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
            .unlock-button {
                padding: 14px 30px;
                font-size: 15px;
            }
            .info-row {
                flex-direction: column;
                padding: 10px 15px;
            }
            .info-label {
                margin-bottom: 5px;
            }
            .steps-list {
                padding: 15px 15px 15px 35px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">Votre Logo</h1>
            <div class="alert-badge">⚠️ Alerte de sécurité</div>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="greeting">Bonjour ${userName},</h2>
            
            <p class="message">
                Votre compte a été temporairement verrouillé en raison de plusieurs tentatives de connexion infructueuses. 
                Cette mesure de sécurité protège votre compte contre tout accès non autorisé.
            </p>

            <!-- Alert Information Box -->
            <div class="alert-box">
                <p>
                    <strong>🔒 Compte verrouillé</strong>
                </p>
                <p>
                    Nous avons détecté ${attemptCount} tentatives de connexion échouées consécutives. 
                    Par mesure de sécurité, votre compte a été verrouillé temporairement pendant ${lockDuration}.
                </p>
            </div>

            <!-- Attempt Details -->
            <div class="info-table">
                <div class="info-row">
                    <div class="info-label">Nombre de tentatives :</div>
                    <div class="info-value">${attemptCount} tentatives échouées</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Durée du verrouillage :</div>
                    <div class="info-value">${lockDuration}</div>
                </div>
                ${ipAddress ? `
                <div class="info-row">
                    <div class="info-label">Adresse IP :</div>
                    <div class="info-value">${ipAddress}</div>
                </div>
                ` : ''}
                ${attemptTime ? `
                <div class="info-row">
                    <div class="info-label">Date et heure :</div>
                    <div class="info-value">${attemptTime}</div>
                </div>
                ` : ''}
            </div>

            <p class="message">
                <strong>Que faire maintenant ?</strong>
            </p>

            <!-- Action Steps -->
            <ol class="steps-list">
                <li>
                    <strong>Si c'était vous :</strong> Attendez ${lockDuration} pour réessayer automatiquement, 
                    ou cliquez sur le bouton ci-dessous pour déverrouiller immédiatement votre compte.
                </li>
                <li>
                    <strong>Si ce n'était pas vous :</strong> Quelqu'un pourrait tenter d'accéder à votre compte. 
                    Nous vous recommandons de changer votre mot de passe immédiatement après le déverrouillage.
                </li>
            </ol>

            <!-- Call to Action Button -->
            <div class="button-container">
                <a href="${unlockLink}" class="unlock-button">
                    Déverrouiller mon compte maintenant
                </a>
            </div>

            <hr class="divider">

            <!-- Warning Box -->
            <div class="warning-box">
                <p>
                    <strong>⚠️ Ce n'était pas vous ?</strong>
                </p>
                <p>
                    Si vous ne reconnaissez pas ces tentatives de connexion, votre compte pourrait être menacé. 
                    Veuillez prendre les mesures suivantes :
                </p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li style="margin: 5px 0;">Changez immédiatement votre mot de passe</li>
                    <li style="margin: 5px 0;">Vérifiez les activités récentes de votre compte</li>
                    <li style="margin: 5px 0;">Contactez notre support si nécessaire</li>
                </ul>
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
                <strong>🔒 Conseils de sécurité :</strong><br>
                • Utilisez un mot de passe fort et unique pour chaque service<br>
                • N'utilisez jamais le même mot de passe sur plusieurs sites<br>
                • Activez l'authentification à deux facteurs si disponible<br>
                • Ne partagez jamais vos identifiants avec qui que ce soit<br>
                • Méfiez-vous des e-mails de phishing demandant vos informations personnelles
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="#" class="footer-link">Centre d'aide</a>
                <span style="color: #d0d0d0;">|</span>
                <a href="#" class="footer-link">Support de sécurité</a>
                <span style="color: #d0d0d0;">|</span>
                <a href="#" class="footer-link">Signaler un problème</a>
            </div>
            
            <p class="footer-text">
                © ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
            </p>
            <p class="footer-text">
                Cet e-mail a été envoyé automatiquement pour des raisons de sécurité.
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
export const generateAccountLockedEmailHTML = (
  userName: string,
  unlockLink: string,
  attemptCount: number = 3,
  lockDuration: string = "30 minutes",
  ipAddress?: string,
  attemptTime?: string
): string => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compte temporairement verrouillé</title>
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
        .alert-badge {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-top: 15px;
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
        .unlock-button {
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
        .unlock-button:hover {
            background-color: #B80029;
        }
        .divider {
            margin: 40px 0;
            border: 0;
            border-top: 1px solid #e5e5e5;
        }
        .alert-box {
            background-color: #fff3f3;
            border-left: 4px solid #DC0032;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .alert-box p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.5;
        }
        .alert-box p:last-child {
            margin-bottom: 0;
        }
        .alert-box strong {
            color: #DC0032;
        }
        .info-table {
            width: 100%;
            background-color: #f8f9fa;
            border-radius: 8px;
            overflow: hidden;
            margin: 20px 0;
        }
        .info-row {
            display: flex;
            padding: 12px 20px;
            border-bottom: 1px solid #e5e5e5;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            flex: 0 0 40%;
            font-weight: 600;
            color: #6b6b6b;
            font-size: 14px;
        }
        .info-value {
            flex: 1;
            color: #1a1a1a;
            font-size: 14px;
        }
        .warning-box {
            background-color: #fff8e6;
            border-left: 4px solid #ffa500;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .warning-box p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.5;
        }
        .warning-box p:last-child {
            margin-bottom: 0;
        }
        .warning-box strong {
            color: #cc8800;
        }
        .steps-list {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px 20px 20px 45px;
            margin: 20px 0;
        }
        .steps-list li {
            margin: 12px 0;
            font-size: 14px;
            color: #4a4a4a;
            line-height: 1.6;
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
            .unlock-button {
                padding: 14px 30px;
                font-size: 15px;
            }
            .info-row {
                flex-direction: column;
                padding: 10px 15px;
            }
            .info-label {
                margin-bottom: 5px;
            }
            .steps-list {
                padding: 15px 15px 15px 35px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">Votre Logo</h1>
            <div class="alert-badge">⚠️ Alerte de sécurité</div>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="greeting">Bonjour ${userName},</h2>
            
            <p class="message">
                Votre compte a été temporairement verrouillé en raison de plusieurs tentatives de connexion infructueuses. 
                Cette mesure de sécurité protège votre compte contre tout accès non autorisé.
            </p>

            <!-- Alert Information Box -->
            <div class="alert-box">
                <p>
                    <strong>🔒 Compte verrouillé</strong>
                </p>
                <p>
                    Nous avons détecté ${attemptCount} tentatives de connexion échouées consécutives. 
                    Par mesure de sécurité, votre compte a été verrouillé temporairement pendant ${lockDuration}.
                </p>
            </div>

            <!-- Attempt Details -->
            <div class="info-table">
                <div class="info-row">
                    <div class="info-label">Nombre de tentatives :</div>
                    <div class="info-value">${attemptCount} tentatives échouées</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Durée du verrouillage :</div>
                    <div class="info-value">${lockDuration}</div>
                </div>
                ${ipAddress ? `
                <div class="info-row">
                    <div class="info-label">Adresse IP :</div>
                    <div class="info-value">${ipAddress}</div>
                </div>
                ` : ''}
                ${attemptTime ? `
                <div class="info-row">
                    <div class="info-label">Date et heure :</div>
                    <div class="info-value">${attemptTime}</div>
                </div>
                ` : ''}
            </div>

            <p class="message">
                <strong>Que faire maintenant ?</strong>
            </p>

            <!-- Action Steps -->
            <ol class="steps-list">
                <li>
                    <strong>Si c'était vous :</strong> Attendez ${lockDuration} pour réessayer automatiquement, 
                    ou cliquez sur le bouton ci-dessous pour déverrouiller immédiatement votre compte.
                </li>
                <li>
                    <strong>Si ce n'était pas vous :</strong> Quelqu'un pourrait tenter d'accéder à votre compte. 
                    Nous vous recommandons de changer votre mot de passe immédiatement après le déverrouillage.
                </li>
            </ol>

            <!-- Call to Action Button -->
            <div class="button-container">
                <a href="${unlockLink}" class="unlock-button">
                    Déverrouiller mon compte maintenant
                </a>
            </div>

            <hr class="divider">

            <!-- Warning Box -->
            <div class="warning-box">
                <p>
                    <strong>⚠️ Ce n'était pas vous ?</strong>
                </p>
                <p>
                    Si vous ne reconnaissez pas ces tentatives de connexion, votre compte pourrait être menacé. 
                    Veuillez prendre les mesures suivantes :
                </p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li style="margin: 5px 0;">Changez immédiatement votre mot de passe</li>
                    <li style="margin: 5px 0;">Vérifiez les activités récentes de votre compte</li>
                    <li style="margin: 5px 0;">Contactez notre support si nécessaire</li>
                </ul>
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
                <strong>🔒 Conseils de sécurité :</strong><br>
                • Utilisez un mot de passe fort et unique pour chaque service<br>
                • N'utilisez jamais le même mot de passe sur plusieurs sites<br>
                • Activez l'authentification à deux facteurs si disponible<br>
                • Ne partagez jamais vos identifiants avec qui que ce soit<br>
                • Méfiez-vous des e-mails de phishing demandant vos informations personnelles
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="#" class="footer-link">Centre d'aide</a>
                <span style="color: #d0d0d0;">|</span>
                <a href="#" class="footer-link">Support de sécurité</a>
                <span style="color: #d0d0d0;">|</span>
                <a href="#" class="footer-link">Signaler un problème</a>
            </div>
            
            <p class="footer-text">
                © ${new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
            </p>
            <p class="footer-text">
                Cet e-mail a été envoyé automatiquement pour des raisons de sécurité.
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
};

export default AccountLockedEmail;
