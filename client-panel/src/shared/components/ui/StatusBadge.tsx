import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Power, WifiOff } from 'lucide-react';

type StatusType = 'active' | 'inactive' | 'suspended' | 'expired' | 'closed' | 'pending' | 'disabled';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true 
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'active':
        return {
          label: 'Actif',
          icon: <Power className="w-3 h-3" />,
          className: 'bg-green-100 text-green-800 border-green-200',
        };
      case 'inactive':
        return {
          label: 'Inactif',
          icon: <XCircle className="w-3 h-3" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
      case 'suspended':
        return {
          label: 'Suspendu',
          icon: <AlertTriangle className="w-3 h-3" />,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
      case 'expired':
        return {
          label: 'Expiré',
          icon: <XCircle className="w-3 h-3" />,
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      case 'closed':
        return {
          label: 'Fermé',
          icon: <XCircle className="w-3 h-3" />,
          className: 'bg-gray-100 text-gray-600 border-gray-200',
        };
      case 'pending':
        return {
          label: 'En attente',
          icon: <Clock className="w-3 h-3" />,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'disabled':
        return {
          label: 'Désactivé',
          icon: <WifiOff className="w-3 h-3" />,
          className: 'bg-red-100 text-red-800 border-red-200',
        };
      default:
        return {
          label: status,
          icon: <CheckCircle className="w-3 h-3" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${config.className} ${sizeClasses[size]}`}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
};

export default StatusBadge;