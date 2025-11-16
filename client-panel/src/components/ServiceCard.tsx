import React from "react";

interface ServiceCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description?: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  isActive = true,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`group bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div
        className={`mb-4 ${
          isActive ? "text-[#DC0032]" : "text-gray-400"
        } group-hover:text-[#B80029] transition-colors duration-300`}
      >
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-md font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
};

export default ServiceCard;
