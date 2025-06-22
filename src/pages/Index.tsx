
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CyberpunkBackground from '../components/CyberpunkBackground';
import Header from '../components/Header';
import Hero from '../components/Hero';
import RealTimeChatInterface from '../components/RealTimeChatInterface';
import UserProfile from '../components/UserProfile';
import ParticleSystem from '../components/ParticleSystem';
import SystemMonitor from '../components/SystemMonitor';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeInterface, setActiveInterface] = useState<'chat' | 'profile' | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    signalStrength: 98.2,
    neuralSync: 87.5,
    quantumEntanglement: 99.9,
    bandwidth: 1.2,
    cpuUsage: 45,
    memoryUsage: 67,
    networkLatency: 12
  });

  useEffect(() => {
    console.log('Index page - Auth state:', { user: user?.email, loading });
    
    // Only redirect to auth if we're sure there's no user and loading is complete
    if (!loading && !user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    // Simulate real-time system metrics updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        signalStrength: Math.max(85, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 2)),
        neuralSync: Math.max(70, Math.min(95, prev.neuralSync + (Math.random() - 0.5) * 3)),
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(40, Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 4)),
        networkLatency: Math.max(5, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 3))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [user, loading, navigate]);

  const handleConnectToNexus = () => {
    console.log('Connecting to NEXUS chat');
    setActiveInterface('chat');
  };

  const handleCloseInterface = () => {
    console.log('Closing interface');
    setActiveInterface(null);
  };

  const handleOpenProfile = () => {
    console.log('Opening profile');
    setActiveInterface('profile');
  };

  // Show loading while checking auth
  if (loading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen bg-dark-bg text-text-color flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-neon-blue font-cyber">Establishing neural connection...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if no user (redirect will happen in useEffect)
  if (!user) {
    console.log('No user, returning null (redirect should happen)');
    return null;
  }

  console.log('Rendering main interface for user:', user.email);

  return (
    <div className="min-h-screen bg-dark-bg text-text-color relative overflow-hidden">
      <CyberpunkBackground />
      <ParticleSystem />
      
      <div className="relative z-10">
        <Header />
        
        {!activeInterface && (
          <Hero onConnect={handleConnectToNexus} onProfile={handleOpenProfile} />
        )}
        
        <SystemMonitor 
          status={systemStatus}
          isVisible={!activeInterface}
        />
        
        {/* Main Interface */}
        {activeInterface && (
          <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000 bg-dark-bg/50 backdrop-blur-sm">
            <div className="hologram-flicker transition-all duration-1000 scale-100 opacity-100">
              <div className="w-[90vw] max-w-6xl h-[85vh] max-h-5xl glass rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,243,255,0.3),0_10px_30px_rgba(188,19,254,0.2)] border border-neon-blue/30">
                
                {/* Interface Header */}
                <div className="flex items-center justify-between p-6 border-b border-neon-blue/20 bg-gradient-to-r from-dark-bg/80 to-glass-bg/60">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue" />
                      <div className="absolute inset-1 rounded-full bg-dark-bg" />
                      <div className="absolute inset-2 rounded-full bg-neon-blue animate-pulse" />
                    </div>
                    <h2 className="text-xl font-quantum font-bold">
                      {activeInterface === 'chat' ? 'Neural Communication Hub' : 'Neural Profile Interface'}
                    </h2>
                    <div className="text-xs font-cyber text-neon-green bg-neon-green/10 px-2 py-1 rounded">
                      v2.1.7
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveInterface('chat')}
                        className={`px-3 py-1 rounded text-xs font-cyber transition-colors ${
                          activeInterface === 'chat' 
                            ? 'bg-neon-blue/20 text-neon-blue' 
                            : 'text-text-color/60 hover:text-neon-blue'
                        }`}
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => setActiveInterface('profile')}
                        className={`px-3 py-1 rounded text-xs font-cyber transition-colors ${
                          activeInterface === 'profile' 
                            ? 'bg-neon-purple/20 text-neon-purple' 
                            : 'text-text-color/60 hover:text-neon-purple'
                        }`}
                      >
                        Profile
                      </button>
                    </div>
                    
                    <button
                      onClick={handleCloseInterface}
                      className="w-8 h-8 rounded-full glass hover:bg-red-500/20 transition-colors flex items-center justify-center group"
                    >
                      <span className="text-lg group-hover:text-red-400">×</span>
                    </button>
                  </div>
                </div>

                {/* Interface Content */}
                <div className="h-[calc(100%-80px)]">
                  {activeInterface === 'chat' && <RealTimeChatInterface />}
                  {activeInterface === 'profile' && <UserProfile />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
