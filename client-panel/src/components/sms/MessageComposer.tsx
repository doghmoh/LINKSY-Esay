import React from 'react';
import { Users, UserPlus } from 'lucide-react';

interface MessageComposerProps {
  message: string;
  onMessageChange: (message: string) => void;
  sender: string;
  onSenderChange: (sender: string) => void;
  onGroupSelect: () => void;
  onContactSelect: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  message,
  onMessageChange,
  sender,
  onSenderChange,
  onGroupSelect,
  onContactSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Expéditeur
          </label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#DC0032] focus:border-[#DC0032]"
            value={sender}
            onChange={(e) => onSenderChange(e.target.value)}
          >
            <option value="">Sélectionner l'expéditeur</option>
            <option value="LINKSY">LINKSY</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Destinataires
          </label>
          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={onGroupSelect}
            >
              <Users size={18} />
              <span className="text-sm">Groupe</span>
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={onContactSelect}
            >
              <UserPlus size={18} />
              <span className="text-sm">Contact</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Message
        </label>
        <textarea
          rows={6}
          placeholder="Tapez votre message..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#DC0032] focus:border-[#DC0032] resize-none"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MessageComposer;
