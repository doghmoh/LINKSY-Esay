import React from "react";

interface LogoProps {
  variant?: "light" | "dark"; // 'light' = red logo on white bg, 'dark' = white logo on red bg
}

const Logo: React.FC<LogoProps> = ({ variant = "dark" }) => {
  // Use red logo for light backgrounds, white logo for dark/red backgrounds
  const logoSrc = variant === "light" ? "/Logo.svg" : "/Logo_Dark.svg";

  return (
    <div className="flex items-center max-w-[125px]">
      <img src={logoSrc} alt="LINKSY" className="w-full h-auto" />
    </div>
  );
};

export default Logo;
