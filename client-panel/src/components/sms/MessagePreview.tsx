import React from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';
import type { MessageStats } from './utils/messageUtils';

interface MessagePreviewProps {
  message: string;
  sender: string;
  messageStats: MessageStats;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  message,
  sender,
  messageStats
}) => {
  const currentTime = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu</h3>
      
      <div className="max-w-[320px] mx-auto h-[calc(100%-2rem)]">
        <div className="relative h-[calc(100%-80px)]">
          {/* Phone Frame */}
          <div className="border-[3px] border-gray-800 rounded-t-[2rem] overflow-hidden h-full">
            {/* Status Bar */}
            <div className="bg-gray-800 text-white px-4 py-1.5">
              <div className="flex justify-between items-center text-xs">
                <span>{currentTime}</span>
                <div className="flex items-center space-x-2">
                  <Signal size={12} />
                  <Wifi size={12} />
                  <Battery size={12} />
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="bg-gray-100 p-3 h-[calc(100%-2rem)]">
              <div className="text-[10px] text-gray-500 text-center mb-2">
                Aujourd'hui {currentTime}
              </div>
              
              <div className="space-y-2">
                {message && (
                  <div className="bg-white rounded-lg p-3 max-w-[85%] shadow-sm">
                    <div className="text-xs font-medium text-[#DC0032] mb-1">{sender}</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                      {message}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-gray-400">{currentTime}</span>
                      <svg className="w-3 h-3 text-blue-500 fill-current" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Gradient Fade Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-gray-100 pointer-events-none"></div>
        </div>

        {/* Message Stats */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{messageStats.encoding}</span>
            <span>{messageStats.parts > 1 ? `${messageStats.parts} messages` : '1 message'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;
