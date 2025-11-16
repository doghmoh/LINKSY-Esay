import React from 'react';
import { Menu, X, Search, Bell, User, Settings, ChevronLeft } from 'lucide-react';
import Logo from './navigation/Logo';
import NavLinks from './navigation/NavLinks';

interface NavigationProps {
  onBack?: () => void;
  selectedService?: string | null;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showMenu?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  onBack, 
  selectedService,
  activeTab,
  onTabChange,
  showMenu
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#DC0032] sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Logo />
            {selectedService && (
              <button
                onClick={onBack}
                className="hidden md:flex p-2 rounded-lg hover:bg-[#c40029] transition-colors"
                aria-label="Back"
              >
                <ChevronLeft className="text-white w-6 h-6" />
              </button>
            )}
          </div>

          {/* App Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {showMenu && onTabChange && activeTab && (
              <NavLinks 
                activeTab={activeTab} 
                onTabChange={onTabChange} 
                selectedService={selectedService}
              />
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                className="p-2 rounded-lg hover:bg-[#c40029] transition-colors"
                aria-label="Search"
              >
                <Search className="text-white w-6 h-6" />
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-[#c40029] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="text-white w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-white text-[#DC0032] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  11
                </span>
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-[#c40029] transition-colors"
                aria-label="User Profile"
              >
                <User className="text-white w-6 h-6" />
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-[#c40029] transition-colors"
                aria-label="Settings"
              >
                <Settings className="text-white w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#c40029] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="text-white w-6 h-6" />
              ) : (
                <Menu className="text-white w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="pt-4 border-t border-[#c40029]">
              {showMenu && onTabChange && activeTab ? (
                <NavLinks 
                  activeTab={activeTab} 
                  onTabChange={(tab) => {
                    onTabChange(tab);
                    setMobileMenuOpen(false);
                  }} 
                  selectedService={selectedService}
                  mobile
                />
              ) : (
                <div className="flex flex-col space-y-2">
                  <button 
                    className="flex items-center px-4 py-2 text-white hover:bg-[#c40029]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="w-6 h-6 mr-2" />
                    Search
                  </button>
                  <button 
                    className="flex items-center px-4 py-2 text-white hover:bg-[#c40029] relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell className="w-6 h-6 mr-2" />
                    Notifications
                    <span className="ml-2 bg-white text-[#DC0032] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      11
                    </span>
                  </button>
                  <button 
                    className="flex items-center px-4 py-2 text-white hover:bg-[#c40029]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-6 h-6 mr-2" />
                    Profile
                  </button>
                  <button 
                    className="flex items-center px-4 py-2 text-white hover:bg-[#c40029]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-6 h-6 mr-2" />
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
