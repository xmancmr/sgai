import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Map,
  Sprout, 
  Package, 
  Wallet, 
  BarChart2, 
  Menu, 
  X,
  ChevronRight,
  Settings,
  Lightbulb
} from 'lucide-react';
import agriDomLogo from '@/assets/agri-dom-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDesktopSidebar = () => setIsDesktopCollapsed(!isDesktopCollapsed);

  const navItems = [
    { title: 'Tableau de bord', path: '/', icon: Home },
    { title: 'Parcelles', path: '/parcelles', icon: Map },
    { title: 'Cultures', path: '/cultures', icon: Sprout },
    { title: 'Inventaire', path: '/inventaire', icon: Package },
    { title: 'Finances', path: '/finances', icon: Wallet },
    { title: 'Statistiques', path: '/statistiques', icon: BarChart2 },
    { title: 'Conseils', path: '/rapports', icon: Lightbulb },
    { title: 'Paramètres', path: '/parametres', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Hamburger Menu for all screens */}
      <div className="fixed top-4 left-4 z-50">
        <motion.button 
          onClick={window.innerWidth < 768 ? toggleSidebar : toggleDesktopSidebar} 
          className="relative w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all active:scale-95 border border-border flex flex-col items-center justify-center space-y-1"
          aria-label="Toggle navigation"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="w-5 h-0.5 bg-foreground rounded-full"
            animate={window.innerWidth < 768 ? (isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }) : (isDesktopCollapsed ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 })}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.div 
            className="w-5 h-0.5 bg-foreground rounded-full"
            animate={window.innerWidth < 768 ? (isOpen ? { opacity: 0 } : { opacity: 1 }) : (isDesktopCollapsed ? { opacity: 0 } : { opacity: 1 })}
            transition={{ duration: 0.2 }}
          />
          <motion.div 
            className="w-5 h-0.5 bg-foreground rounded-full"
            animate={window.innerWidth < 768 ? (isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }) : (isDesktopCollapsed ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 })}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </motion.button>
      </div>

      {/* Desktop Sidebar - Collapsible */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isDesktopCollapsed ? 0 : window.innerWidth >= 768 ? 288 : 0,
          opacity: isDesktopCollapsed ? 0 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex md:relative md:translate-x-0 bg-white border-r border-border shadow-lg flex-col h-full overflow-hidden"
      >
        <div className="p-3 sm:p-4 border-b border-border flex items-center justify-center">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img src={agriDomLogo} alt="Agri Dom" className="h-6 sm:h-8 w-auto" />
            <span className="text-lg sm:text-xl font-bold text-primary">Agri Dom</span>
          </Link>
        </div>

        <nav className="flex-1 py-2 sm:py-4 px-2 sm:px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link flex items-center space-x-2 sm:space-x-3 py-3 sm:py-4 px-4 sm:px-5 rounded-xl transition-all duration-300 ${
                isActive(item.path) 
                  ? 'bg-primary/10 text-primary font-medium shadow-md transform scale-105' 
                  : 'hover:bg-gray-100 text-foreground hover:shadow-md hover:transform hover:scale-102'
              }`}
            >
              <item.icon className={`h-5 sm:h-6 w-5 sm:w-6 ${isActive(item.path) ? 'text-primary' : ''}`} />
              <span className="text-base sm:text-lg font-medium">{item.title}</span>
              
              {isActive(item.path) && (
                <div className="ml-auto flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5 text-primary ml-2" />
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-3 sm:p-4 border-t border-border">
          <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2">
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-medium text-primary">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium truncate">Utilisateur</p>
              <p className="text-xs text-muted-foreground truncate">agriculteur@example.com</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar - Animated */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-40 w-64 sm:w-72 bg-white border-r border-border shadow-2xl md:hidden flex flex-col h-full overflow-y-auto"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-3 sm:p-4 border-b border-border flex items-center justify-center"
              >
                <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                  <img src={agriDomLogo} alt="Agri Dom" className="h-6 sm:h-8 w-auto" />
                  <span className="text-lg sm:text-xl font-bold text-primary">Agri Dom</span>
                </Link>
              </motion.div>

              <nav className="flex-1 py-2 sm:py-4 px-2 sm:px-3 space-y-1 overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-link flex items-center space-x-2 sm:space-x-3 py-3 sm:py-4 px-4 sm:px-5 rounded-xl transition-all duration-300 ${
                        isActive(item.path) 
                          ? 'bg-primary/10 text-primary font-medium shadow-md transform scale-105' 
                          : 'hover:bg-gray-100 text-foreground hover:shadow-md hover:transform hover:scale-102'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className={`h-5 sm:h-6 w-5 sm:w-6 ${isActive(item.path) ? 'text-primary' : ''}`} />
                      <span className="text-base sm:text-lg font-medium">{item.title}</span>
                      
                      {isActive(item.path) && (
                        <div className="ml-auto flex items-center">
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                          <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5 text-primary ml-2" />
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-3 sm:p-4 border-t border-border"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium text-primary">AD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">Utilisateur</p>
                    <p className="text-xs text-muted-foreground truncate">agriculteur@example.com</p>
                  </div>
                </div>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
