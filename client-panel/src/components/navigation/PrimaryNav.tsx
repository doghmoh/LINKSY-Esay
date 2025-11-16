import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';

interface PrimaryNavProps {
  notifications?: number;
  userName?: string;
  userImage?: string;
  mobile?: boolean;
}

const PrimaryNav: React.FC<PrimaryNavProps> = ({
  notifications = 11,
  userName = "Ahmed S.",
  userImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces",
  mobile = false
}) => {
  return (
    <div className={`flex ${mobile ? 'flex-col space-y-4' : 'items-center space-x-4'}`}>
      <button className="p-2 rounded-lg hover:bg-[#c40029] transition-colors flex items-center">
        <Search className="text-white w-6 h-6" />
        {mobile && <span className="ml-2 text-white">Rechercher</span>}
      </button>
      
      <button className="p-2 rounded-lg hover:bg-[#c40029] transition-colors relative flex items-center">
        <Bell className="text-white w-6 h-6" />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#DC0032] text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications}
          </span>
        )}
        {mobile && <span className="ml-2 text-white">Notifications</span>}
      </button>

      <div className="flex items-center">
        <img
          src={userImage}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        {mobile && <span className="ml-2 text-white">{userName}</span>}
      </div>

      <button className="p-2 rounded-lg hover:bg-[#c40029] transition-colors flex items-center">
        <Settings className="text-white w-6 h-6" />
        {mobile && <span className="ml-2 text-white">Paramètres</span>}
      </button>
    </div>
  );
};

export default PrimaryNav;
