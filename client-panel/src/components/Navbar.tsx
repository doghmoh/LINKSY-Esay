import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[#DC0032] text-white px-4 py-2 flex items-center justify-between">
      <div className="text-2xl font-bold">LINKSY</div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-[#c40029] rounded-full">
          <Search size={20} />
        </button>
        <button className="p-2 hover:bg-[#c40029] rounded-full relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-white text-[#DC0032] text-xs rounded-full w-5 h-5 flex items-center justify-center">
            11
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span>Ahmed S.</span>
        </div>
        <button className="p-2 hover:bg-[#c40029] rounded-full">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
