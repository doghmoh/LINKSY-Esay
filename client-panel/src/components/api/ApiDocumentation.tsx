import React from 'react';
import { Code, Key, Globe, MessageSquare, Mail, Server, User, Info, Zap, BookOpen, ChevronRight, CheckCircle, Clock } from 'lucide-react';

const ApiDocumentation: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center mb-4">
            <Zap className="w-8 h-8 text-[#DC0032] mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Documentation API LINKSY</h1>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Bienvenue dans la documentation de l'API LINKSY. Cette API vous permet d'intégrer nos services de SMS, d'e-mail marketing, de gestion de contacts et d'autres fonctionnalités directement dans vos applications.
          </p>
        </div>

        {/* Quick Stats & CTAs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* API Status */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut API</p>
              <p className="text-2xl font-semibold text-gray-800">Opérationnel</p>
            </div>
          </div>

          {/* Available Endpoints */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Endpoints</p>
              <p className="text-2xl font-semibold text-gray-800">12+</p>
            </div>
          </div>

          {/* Quick Start CTA */}
          <button
            onClick={() => window.location.hash = '#/api/management'}
            className="group bg-[#DC0032] text-white rounded-lg shadow p-4 md:p-6 hover:bg-[#c40029] transition-colors flex items-center space-x-4 text-left"
          >
            <div className="p-3 rounded-full bg-white/20">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Gérer les Clés API</p>
              <p className="text-sm opacity-90">Créer et configurer</p>
            </div>
          </button>

          {/* View Examples CTA */}
          <button
            onClick={() => window.location.hash = '#/api/examples'}
            className="group bg-white rounded-lg shadow p-4 md:p-6 hover:bg-[#FFF5F7] transition-colors flex items-center space-x-4 text-left"
          >
            <div className="p-3 rounded-full bg-gray-100 group-hover:bg-[#DC0032]/10 transition-colors">
              <Code className="w-6 h-6 text-gray-600 group-hover:text-[#DC0032] transition-colors" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-[#DC0032] transition-colors">Exemples de Code</p>
              <p className="text-sm text-gray-500">Intégrations rapides</p>
            </div>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* API Services Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Services API Disponibles</h2>
            <div className="space-y-4">
              {/* SMS API */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#DC0032] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-[#DC0032] mr-2" />
                    <h3 className="font-semibold text-gray-800">API SMS</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Disponible
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Envoyez des messages SMS à des contacts individuels ou à des groupes.</p>
                <div className="flex items-center text-sm text-[#DC0032] hover:underline cursor-pointer">
                  Voir la documentation
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Email API */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#DC0032] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">API E-mail Marketing</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Disponible
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Gérez vos campagnes d'e-mailing et envoyez des e-mails.</p>
                <div className="flex items-center text-sm text-[#DC0032] hover:underline cursor-pointer">
                  Voir la documentation
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Contacts API */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#DC0032] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">API Contacts</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Disponible
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Gérez vos listes de contacts et importez de nouveaux contacts.</p>
                <div className="flex items-center text-sm text-[#DC0032] hover:underline cursor-pointer">
                  Voir la documentation
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Hosting API */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#DC0032] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Server className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">API Hosting</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Bientôt
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Des fonctionnalités pour gérer vos services d'hébergement seront bientôt disponibles.</p>
                <div className="flex items-center text-sm text-gray-500 cursor-not-allowed">
                  Documentation en préparation
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reference & Support */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col">
            <div>
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-full bg-blue-100 inline-block mr-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Référence Rapide</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Accédez rapidement aux informations essentielles pour commencer avec l'API LINKSY.
              </p>

              {/* Quick Links */}
              <div className="space-y-3 mb-5">
                <a href="#authentication" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Authentification</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </a>
                <a href="#endpoints" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Points d'accès</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </a>
                <a href="#response-codes" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Codes de réponse</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </a>
              </div>
            </div>

            {/* Support Link */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <a
                href="#/helpdesk"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
              >
                Obtenir de l'aide
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Documentation Sections */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Documentation Détaillée</h2>

          {/* Section: Authentification */}
          <div id="authentication" className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Key className="w-5 h-5 text-blue-600 mr-2" /> Authentification
            </h3>
            <p className="text-gray-600 mb-4">
              Toutes les requêtes API nécessitent une authentification via une clé API. Vous pouvez générer et gérer vos clés API depuis la section <span className="font-medium text-[#DC0032]">Gestion des clés</span>.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
              <pre><code>Authorization: Bearer VOTRE_CLE_API</code></pre>
            </div>
            <p className="text-sm text-gray-500 mt-3 flex items-center">
              <Info className="w-4 h-4 mr-1.5 text-blue-500" />
              Assurez-vous de garder votre clé API confidentielle.
            </p>
          </div>

          {/* Section: Points d'accès (Endpoints) */}
          <div id="endpoints" className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Globe className="w-5 h-5 text-green-600 mr-2" /> Points d'accès (Endpoints)
            </h3>
            <p className="text-gray-600 mb-4">
              L'API de LINKSY est basée sur REST. Toutes les requêtes doivent être envoyées à l'URL de base suivante :
            </p>
            <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto mb-6">
              <pre><code>https://api.linksy.tech/v1</code></pre>
            </div>

            {/* Sub-section: SMS API */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 text-[#DC0032] mr-2" /> API SMS
              </h4>
              <p className="text-gray-600 mb-3">
                Envoyez des messages SMS à des contacts individuels ou à des groupes.
              </p>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                <p className="font-bold mb-2 text-white">Envoyer un SMS</p>
                <pre><code>POST /sms/send</code></pre>
                <p className="mt-4 font-bold mb-2 text-white">Exemple de requête:</p>
                <pre><code>{`{
  "to": "+213550123456",
  "senderId": "LINKSY",
  "message": "Bonjour, votre commande est en route !"
}`}</code></pre>
                <p className="mt-4 font-bold mb-2 text-white">Exemple de réponse (succès):</p>
                <pre><code>{`{
  "status": "success",
  "messageId": "sms_123456789",
  "creditsUsed": 1
}`}</code></pre>
              </div>
            </div>

            {/* Sub-section: Email Marketing API */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-2" /> API E-mail Marketing
              </h4>
              <p className="text-gray-600 mb-3">
                Gérez vos campagnes d'e-mailing et envoyez des e-mails.
              </p>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                <p className="font-bold mb-2 text-white">Envoyer un E-mail</p>
                <pre><code>POST /email/send</code></pre>
                <p className="mt-4 font-bold mb-2 text-white">Exemple de requête:</p>
                <pre><code>{`{
  "to": "client@exemple.com",
  "subject": "Votre offre exclusive",
  "body": "Découvrez nos dernières promotions !",
  "html": "&lt;p&gt;Découvrez nos &lt;strong&gt;dernières promotions&lt;/strong&gt; !&lt;/p&gt;"
}`}</code></pre>
              </div>
            </div>

            {/* Sub-section: Contacts API */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <User className="w-5 h-5 text-purple-600 mr-2" /> API Contacts
              </h4>
              <p className="text-gray-600 mb-3">
                Gérez vos listes de contacts et importez de nouveaux contacts.
              </p>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                <p className="font-bold mb-2 text-white">Ajouter un contact</p>
                <pre><code>POST /contacts</code></pre>
                <p className="mt-4 font-bold mb-2 text-white">Exemple de requête:</p>
                <pre><code>{`{
  "name": "Nouveau Client",
  "phone": "+213770123456",
  "group": "Clients VIP"
}`}</code></pre>
              </div>
            </div>
          </div>

          {/* Section: Codes de Réponse */}
          <div id="response-codes" className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Code className="w-5 h-5 text-gray-600 mr-2" /> Codes de Réponse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-mono text-green-600 font-semibold">200 OK</span>
                  <span className="text-sm text-gray-600">La requête a réussi</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-mono text-red-600 font-semibold">400 Bad Request</span>
                  <span className="text-sm text-gray-600">La requête est mal formée</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-mono text-red-600 font-semibold">401 Unauthorized</span>
                  <span className="text-sm text-gray-600">Authentification requise</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-mono text-red-600 font-semibold">403 Forbidden</span>
                  <span className="text-sm text-gray-600">Accès refusé</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-mono text-red-600 font-semibold">404 Not Found</span>
                  <span className="text-sm text-gray-600">Ressource introuvable</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-mono text-red-600 font-semibold">429 Too Many Requests</span>
                  <span className="text-sm text-gray-600">Limite de taux dépassée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;