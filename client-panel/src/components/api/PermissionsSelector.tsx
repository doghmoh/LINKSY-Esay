import React from 'react';
import { MessageSquare, User, Server } from 'lucide-react';

export const AVAILABLE_SERVICES = [
  { id: 'sms', name: 'SMS', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
  { id: 'contacts', name: 'Contacts', icon: <User className="w-4 h-4 mr-2" /> },
  { id: 'hosting', name: 'Hosting', icon: <Server className="w-4 h-4 mr-2" /> },
];

export type Permissions = {
  [serviceId: string]: ('read' | 'write')[];
};

interface PermissionsSelectorProps {
  value: Permissions;
  onChange: (newPermissions: Permissions) => void;
}

const PermissionsSelector: React.FC<PermissionsSelectorProps> = ({ value, onChange }) => {
  const handlePermissionChange = (serviceId: string, permission: 'read' | 'write', checked: boolean) => {
    const currentServicePermissions = value[serviceId] || [];
    let newServicePermissions: ('read' | 'write')[];

    if (checked) {
      newServicePermissions = [...currentServicePermissions, permission];
    } else {
      newServicePermissions = currentServicePermissions.filter(p => p !== permission);
    }

    const updatedPermissions = {
      ...value,
      [serviceId]: [...new Set(newServicePermissions)],
    };

    if (updatedPermissions[serviceId].length === 0) {
      delete updatedPermissions[serviceId];
    }

    onChange(updatedPermissions);
  };

  return (
    <div className="space-y-4">
      {AVAILABLE_SERVICES.map(service => (
        <div key={service.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center font-medium text-gray-800 mb-3">
            {service.icon}
            {service.name}
          </div>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-[#DC0032] rounded focus:ring-[#DC0032]"
                checked={value[service.id]?.includes('read') || false}
                onChange={(e) => handlePermissionChange(service.id, 'read', e.target.checked)}
              />
              <span className="text-sm text-gray-700">Lecture (Read)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-[#DC0032] rounded focus:ring-[#DC0032]"
                checked={value[service.id]?.includes('write') || false}
                onChange={(e) => handlePermissionChange(service.id, 'write', e.target.checked)}
              />
              <span className="text-sm text-gray-700">Écriture (Write)</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionsSelector;