
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Neural Interface', href: '#interface' },
    { label: 'Quantum Core', href: '#quantum' },
    { label: 'Data Streams', href: '#streams' },
    { label: 'System Status', href: '#status' },
    { label: 'Documentation', href: '#docs' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass border-b border-neon-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue animate-pulse-glow" />
                <div className="absolute inset-1 rounded-full bg-dark-bg" />
                <div className="absolute inset-2 rounded-full bg-neon-blue animate-pulse" />
              </div>
              <span className="text-xl font-quantum font-bold tracking-tight">
                NEXUS<span className="glitch text-neon-pink">•</span>2099
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative group px-3 py-2 text-sm font-cyber font-medium text-text-color/80 hover:text-neon-blue transition-all duration-300"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded transition-transform duration-300 origin-left" />
                <div className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-neon-blue to-transparent transition-transform duration-300 origin-left" />
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-8 h-8 focus:outline-none"
            >
              <div className={`absolute w-6 h-0.5 bg-neon-blue transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-4' : 'top-2'}`} />
              <div className={`absolute w-6 h-0.5 bg-neon-blue transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-4'}`} />
              <div className={`absolute w-6 h-0.5 bg-neon-blue transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-4' : 'top-6'}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-neon-blue/20 mt-2 rounded-lg">
            <nav className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-cyber font-medium text-text-color/80 hover:text-neon-blue hover:bg-neon-blue/10 rounded transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
