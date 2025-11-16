import React from 'react';
import LogoSvg from '../../Logo.svg';
import LogoDarkSvg from '../../Logo_Dark.svg';

interface LogoProps {
  variant?: 'light' | 'dark'; // 'light' = red logo on white bg, 'dark' = white logo on red bg
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark' }) => {
  // Use red logo for light backgrounds, white logo for dark/red backgrounds
  const logoSrc = variant === 'light' ? LogoSvg : LogoDarkSvg;
  
  return (
    <div className="flex items-center max-w-[125px]">
      <img 
        src={logoSrc} 
        alt="LINKSY" 
        className="w-full h-auto"
      />
    </div>
  );
};

export default Logo;
