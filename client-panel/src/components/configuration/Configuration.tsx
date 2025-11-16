import React from 'react';
import { Save } from 'lucide-react';

const Configuration = () => {
  return (
    <div className="p-6">
      {/* Apply max-width and centering here */}
      <div className="max-w-[72rem] mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium mb-6">Paramètres SMS</h2>

          <div className="space-y-6">
            {/* Default Sender ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expéditeur par défaut
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#DC0032] focus:border-[#DC0032]"
                placeholder="LINKSY"
              />
            </div>

            {/* Character Encoding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encodage des caractères
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#DC0032] focus:border-[#DC0032]">
                <option>GSM 7-bit</option>
                <option>Unicode (UTF-8)</option>
              </select>
            </div>

            {/* Delivery Reports */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rapports de livraison
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-[#DC0032]" />
                  <span className="ml-2">Activer les rapports détaillés</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-[#DC0032]" />
                  <span className="ml-2">Notifications par email</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 bg-[#DC0032] text-white rounded-md hover:bg-[#c40029]">
                <Save size={18} className="mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
