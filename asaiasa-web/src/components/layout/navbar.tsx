import React, { useState } from 'react';
import { Link } from 'react-router';
import { useTranslations } from 'next-intl';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/base/buttons/button';
import LangSwitcher from '@/components/common/lang-switcher';
import { useAuth } from '@/contexts/auth-context';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuth, userProfile, removeAuthState, loading } = useAuth();
  const t = useTranslations('Common.navigation');
  const authT = useTranslations('Common.buttons');
  const userMenuT = useTranslations('Common.userMenu');

  const menuItems = [
    { label: t('events'), href: '/events' },
    // { label: t('jobs'), href: '/jobs' },
    { label: t('organizations'), href: '/organizations' },
    // { label: t('map'), href: '/map' },
    { label: t('about'), href: '/about' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await removeAuthState();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="fixed bg-white shadow-md font-sans top-0 z-50 w-full">
      <div className="max-w-[1170px] mx-auto px-6">
        <div className="flex justify-between items-center h-[65px]">
          {/* Logo and Menu */}
          <div className="flex gap-[30px] lg:gap-[42px]">
            {/* Logo */}
            <div className="flex-shrink-0 flex justify-center items-center">
              <Link to="/home">
                <img src="/logo-2.png" alt="ASAiASA Logo" className="h-12 w-auto" />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-[25px] lg:space-x-[38px] items-center">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Language Switcher and Auth */}
          <div className="flex items-center gap-3">
            <LangSwitcher />
            
            {/* Desktop Auth Section */}
            <div className="hidden md:flex md:items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
              ) : isAuth && userProfile ? (
                <div className="relative">
                  <Button
                    color="tertiary"
                    size="sm"
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 hover:bg-gray-100"
                  >
                    {userProfile.picUrl ? (
                      <img 
                        src={userProfile.picUrl} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="font-medium">{userProfile.firstName}</span>
                  </Button>
                  
                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile.firstName} {userProfile.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {userMenuT('profile')}
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {userMenuT('dashboard')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {userMenuT('logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button color="tertiary" size="sm">
                      {authT('login')}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      {authT('signup')}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button
                color="tertiary"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-700"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="block text-gray-700 hover:text-orange-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
                </div>
              ) : isAuth && userProfile ? (
                <>
                  <div className="px-2 py-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      {userProfile.picUrl ? (
                        <img 
                          src={userProfile.picUrl} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile.firstName} {userProfile.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button color="tertiary" size="sm" className="w-full justify-start">
                      {userMenuT('profile')}
                    </Button>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button color="tertiary" size="sm" className="w-full justify-start">
                      {userMenuT('dashboard')}
                    </Button>
                  </Link>
                  <Button
                    color="tertiary"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {userMenuT('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button color="tertiary" size="sm" className="w-full justify-start">
                      {authT('login')}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                      {authT('signup')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
