import React, { useState } from 'react';
import { 
  generateAccountConfirmationEmailHTML,
  generatePasswordResetEmailHTML,
  generateAccountLockedEmailHTML 
} from '../templates/emails';

type TemplateType = 'confirmation' | 'reset' | 'locked';

const EmailTemplatesPreview: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('confirmation');
  const [formData, setFormData] = useState({
    userName: 'Jean Dupont',
    confirmationLink: 'https://votresite.com/confirm?token=abc123xyz789',
    resetLink: 'https://votresite.com/reset?token=xyz789abc123',
    unlockLink: 'https://votresite.com/unlock?token=def456ghi789',
    expirationTime: '24 heures',
    resetExpirationTime: '1 heure',
    attemptCount: 3,
    lockDuration: '30 minutes',
    ipAddress: '192.168.1.1',
    attemptTime: new Date().toLocaleString('fr-FR')
  });

  const getEmailHTML = () => {
    switch (selectedTemplate) {
      case 'confirmation':
        return generateAccountConfirmationEmailHTML(
          formData.userName,
          formData.confirmationLink,
          formData.expirationTime
        );
      case 'reset':
        return generatePasswordResetEmailHTML(
          formData.userName,
          formData.resetLink,
          formData.resetExpirationTime
        );
      case 'locked':
        return generateAccountLockedEmailHTML(
          formData.userName,
          formData.unlockLink,
          formData.attemptCount,
          formData.lockDuration,
          formData.ipAddress,
          formData.attemptTime
        );
      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    const html = getEmailHTML();
    navigator.clipboard.writeText(html);
    alert('HTML copié dans le presse-papier !');
  };

  const downloadHTML = () => {
    const html = getEmailHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-template-${selectedTemplate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            Aperçu des Templates d'E-mails
          </h1>
          <p className="text-gray-600">
            Visualisez et testez tous les templates d'e-mails disponibles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Template Selector Cards */}
          <div
            onClick={() => setSelectedTemplate('confirmation')}
            className={`p-6 rounded-xl cursor-pointer transition-all ${
              selectedTemplate === 'confirmation'
                ? 'bg-[#DC0032] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-2">✉️</div>
            <h3 className="text-lg font-semibold mb-1">Confirmation de compte</h3>
            <p className={`text-sm ${selectedTemplate === 'confirmation' ? 'text-white/80' : 'text-gray-500'}`}>
              Email envoyé lors de la création d'un compte
            </p>
          </div>

          <div
            onClick={() => setSelectedTemplate('reset')}
            className={`p-6 rounded-xl cursor-pointer transition-all ${
              selectedTemplate === 'reset'
                ? 'bg-[#DC0032] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="text-lg font-semibold mb-1">Réinitialisation</h3>
            <p className={`text-sm ${selectedTemplate === 'reset' ? 'text-white/80' : 'text-gray-500'}`}>
              Email pour réinitialiser le mot de passe
            </p>
          </div>

          <div
            onClick={() => setSelectedTemplate('locked')}
            className={`p-6 rounded-xl cursor-pointer transition-all ${
              selectedTemplate === 'locked'
                ? 'bg-[#DC0032] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold mb-1">Compte verrouillé</h3>
            <p className={`text-sm ${selectedTemplate === 'locked' ? 'text-white/80' : 'text-gray-500'}`}>
              Email après 3 tentatives de connexion
            </p>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'utilisateur
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
              />
            </div>

            {selectedTemplate === 'confirmation' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien de confirmation
                  </label>
                  <input
                    type="text"
                    value={formData.confirmationLink}
                    onChange={(e) => setFormData({ ...formData, confirmationLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée de validité
                  </label>
                  <input
                    type="text"
                    value={formData.expirationTime}
                    onChange={(e) => setFormData({ ...formData, expirationTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
                  />
                </div>
              </>
            )}

            {selectedTemplate === 'reset' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien de réinitialisation
                  </label>
                  <input
                    type="text"
                    value={formData.resetLink}
                    onChange={(e) => setFormData({ ...formData, resetLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée de validité
                  </label>
                  <input
                    type="text"
                    value={formData.resetExpirationTime}
                    onChange={(e) => setFormData({ ...formData, resetExpirationTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
                  />
                </div>
              </>
            )}

            {selectedTemplate === 'locked' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien de déverrouillage
                  </label>
                  <input
                    type="text"
                    value={formData.unlockLink}
                    onChange={(e) => setFormData({ ...formData, unlockLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de tentatives
                  </label>
                  <input
                    type="number"
                    value={formData.attemptCount}
                    onChange={(e) => setFormData({ ...formData, attemptCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée du verrouillage
                  </label>
                  <input
                    type="text"
                    value={formData.lockDuration}
                    onChange={(e) => setFormData({ ...formData, lockDuration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse IP
                  </label>
                  <input
                    type="text"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC0032]"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={copyToClipboard}
              className="px-6 py-2.5 bg-[#DC0032] text-white rounded-lg hover:bg-[#B80029] transition-colors font-medium"
            >
              📋 Copier le HTML
            </button>
            <button
              onClick={downloadHTML}
              className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              💾 Télécharger
            </button>
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <iframe
              srcDoc={getEmailHTML()}
              className="w-full h-[800px] bg-white"
              title="Email Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatesPreview;
