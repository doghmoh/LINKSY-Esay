import React from 'react';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 
        rounded-lg
        transition-colors
        text-sm font-medium
        w-full lg:w-auto
        text-left lg:text-center
        ${
          active
            ? 'bg-white text-[#DC0032]'
            : 'text-white hover:bg-[#c40029]'
        }
      `}
    >
      {children}
    </button>
  );
};

export default NavButton;
