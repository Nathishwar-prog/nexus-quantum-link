
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="relative z-20 p-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" />
          <h1 className="text-2xl font-quantum font-bold glitch">
            NEXUS
          </h1>
        </div>

        {/* User Menu */}
        {user && (
          <div className="relative">
            <Button
              onClick={() => setShowUserMenu(!showUserMenu)}
              variant="ghost"
              className="glass hover:bg-neon-blue/10 text-neon-blue border border-neon-blue/30"
            >
              <User className="w-4 h-4 mr-2" />
              Neural Agent
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-dark rounded-lg border border-neon-blue/30 overflow-hidden">
                <div className="p-3 border-b border-neon-blue/20">
                  <p className="text-sm font-cyber text-neon-blue">Connected as</p>
                  <p className="text-xs text-text-color/60 truncate">{user.email}</p>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-3 py-2 text-sm font-cyber text-text-color hover:bg-neon-blue/10 rounded flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Neural Settings
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm font-cyber text-red-400 hover:bg-red-500/10 rounded flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
