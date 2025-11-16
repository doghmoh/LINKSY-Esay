import React, { useState } from 'react';
import { Key, PlusCircle, Trash2, Copy, Check, Info, X, Edit } from 'lucide-react';
import LoadingButton from '../ui/LoadingButton';
import PermissionsSelector, { Permissions } from './PermissionsSelector';

interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
  permissions: Permissions;
}

const mockApiKeys: ApiKey[] = [
  {
    id: 'api_abc123def456',
    key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    name: 'Default Key',
    createdAt: '2023-01-15',
    lastUsed: '2024-07-20',
    status: 'active',
    permissions: {
      sms: ['read', 'write'],
      contacts: ['read'],
    },
  },
  {
    id: 'api_ghi789jkl012',
    key: 'sk-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
    name: 'Mobile App Key',
    createdAt: '2023-03-10',
    lastUsed: '2024-07-22',
    status: 'active',
    permissions: {
      sms: ['read', 'write'],
      contacts: ['read', 'write'],
      hosting: ['read'],
    },
  },
  {
    id: 'api_mno345pqr678',
    key: 'sk-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
    name: 'Old Integration Key',
    createdAt: '2022-05-01',
    lastUsed: '2023-01-01',
    status: 'revoked',
    permissions: {
      sms: ['read'],
    },
  },
];

const ApiManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<Permissions>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState<ApiKey | null>(null);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);

  const generateNewKey = () => {
    if (!newKeyName.trim()) {
      alert('Veuillez donner un nom à votre nouvelle clé API.');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const newKey: ApiKey = {
        id: `api_${Math.random().toString(36).substring(2, 15)}`,
        key: `sk-${Array(40).fill('x').map(() => Math.random().toString(36)[2] || '0').join('')}`,
        name: newKeyName.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
        lastUsed: null,
        status: 'active',
        permissions: newKeyPermissions,
      };
      setApiKeys((prev) => [...prev, newKey]);
      setNewKeyName('');
      setNewKeyPermissions({});
      setIsGenerating(false);
      alert('Nouvelle clé API générée avec succès!');
    }, 1000);
  };

  const handleRevokeKey = (keyToRevoke: ApiKey) => {
    setShowRevokeConfirm(keyToRevoke);
  };

  const confirmRevokeKey = () => {
    if (!showRevokeConfirm) return;
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === showRevokeConfirm.id ? { ...key, status: 'revoked' } : key
      )
    );
    alert(`Clé API "${showRevokeConfirm.name}" révoquée.`);
    setShowRevokeConfirm(null);
  };

  const handleEditPermissions = (key: ApiKey) => {
    setEditingKey(key);
  };

  const handleSavePermissions = (updatedPermissions: Permissions) => {
    if (!editingKey) return;
    setApiKeys(prev =>
      prev.map(key =>
        key.id === editingKey.id ? { ...key, permissions: updatedPermissions } : key
      )
    );
    setEditingKey(null);
    alert('Permissions mises à jour avec succès.');
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Erreur lors de la copie de la clé.');
    });
  };

  const getStatusBadge = (status: 'active' | 'revoked') => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset bg-green-100 text-green-700 ring-green-600/10">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset bg-red-100 text-red-700 ring-red-600/10">
        Révoquée
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center mb-4">
            <Key className="w-8 h-8 text-[#DC0032] mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Clés API</h1>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Générez, visualisez et révoquez vos clés API pour sécuriser l'accès à vos services LINKSY.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Active Keys */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100">
              <Key className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Clés Actives</p>
              <p className="text-2xl font-semibold text-gray-800">{apiKeys.filter(key => key.status === 'active').length}</p>
            </div>
          </div>

          {/* Total Keys */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clés</p>
              <p className="text-2xl font-semibold text-gray-800">{apiKeys.length}</p>
            </div>
          </div>

          {/* Revoked Keys */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-red-100">
              <Key className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Clés Révoquées</p>
              <p className="text-2xl font-semibold text-gray-800">{apiKeys.filter(key => key.status === 'revoked').length}</p>
            </div>
          </div>

          {/* Create New Key CTA */}
          <button
            onClick={() => document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group bg-[#DC0032] text-white rounded-lg shadow p-4 md:p-6 hover:bg-[#c40029] transition-colors flex items-center space-x-4 text-left"
          >
            <div className="p-3 rounded-full bg-white/20">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Nouvelle Clé</p>
              <p className="text-sm opacity-90">Générer une clé API</p>
            </div>
          </button>
        </div>

        {/* Generate New Key Section */}
        <div id="generate-section" className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <PlusCircle className="w-5 h-5 text-[#DC0032] mr-2" /> Générer une nouvelle clé API
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la clé</label>
              <input
                type="text"
                placeholder="Ex: 'Clé pour mon site web'"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC0032] focus:border-transparent"
                disabled={isGenerating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <PermissionsSelector value={newKeyPermissions} onChange={setNewKeyPermissions} />
            </div>
            <LoadingButton
              onClick={generateNewKey}
              loading={isGenerating}
              loadingText="Génération..."
              disabled={!newKeyName.trim()}
              variant="primary"
            >
              Générer la clé
            </LoadingButton>
          </div>
          <p className="text-sm text-gray-500 mt-3 flex items-center">
            <Info className="w-4 h-4 mr-1.5 text-blue-500" />
            Une fois générée, la clé complète ne sera affichée qu'une seule fois.
          </p>
        </div>

        {/* Existing API Keys Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Key className="w-5 h-5 text-gray-600 mr-2" /> Vos clés API existantes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Clé API</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Créée le</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{apiKey.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono flex items-center">
                      <span className="truncate max-w-[150px]">
                        {apiKey.key.substring(0, 6)}...{apiKey.key.substring(apiKey.key.length - 4)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="ml-2 p-1.5 rounded-md border border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        title={copiedKeyId === apiKey.id ? "Copié!" : "Copier la clé"}
                      >
                        {copiedKeyId === apiKey.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{apiKey.createdAt}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(apiKey.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {apiKey.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleEditPermissions(apiKey)}
                              className="p-1.5 rounded-md border border-transparent text-gray-600 hover:text-[#DC0032] hover:bg-gray-100"
                              title="Modifier les permissions"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleRevokeKey(apiKey)}
                              className="p-1.5 rounded-md border border-transparent text-gray-600 hover:text-red-600 hover:bg-red-50"
                              title="Révoquer la clé"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      {showRevokeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Confirmer la révocation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Voulez-vous vraiment révoquer la clé "{showRevokeConfirm.name}"? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowRevokeConfirm(null)} className="btn-secondary">Annuler</button>
              <button onClick={confirmRevokeKey} className="btn-danger">Révoquer</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {editingKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Modifier les permissions pour "{editingKey.name}"
              </h3>
              <button onClick={() => setEditingKey(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <PermissionsSelector
                value={editingKey.permissions}
                onChange={(newPermissions) =>
                  setEditingKey({ ...editingKey, permissions: newPermissions })
                }
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button onClick={() => setEditingKey(null)} className="btn-secondary">Annuler</button>
              <button onClick={() => handleSavePermissions(editingKey.permissions)} className="btn-primary">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiManagement;