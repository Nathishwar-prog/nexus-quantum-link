
import { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import BiometricAuth from './BiometricAuth';
import RealTimeChatInterface from './RealTimeChatInterface';
import NeuralVisualizer from './NeuralVisualizer';

interface HolographicInterfaceProps {
  isActive: boolean;
  onClose: () => void;
  systemStatus: {
    signalStrength: number;
    neuralSync: number;
    quantumEntanglement: number;
    bandwidth: number;
    cpuUsage: number;
    memoryUsage: number;
    networkLatency: number;
  };
}

const HolographicInterface = ({ isActive, onClose, systemStatus }: HolographicInterfaceProps) => {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [aiWaves, setAiWaves] = useState(Array.from({ length: 7 }, () => Math.random() * 30 + 5));

  useEffect(() => {
    // If user is logged in, set authenticated
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAiWaves(prev => prev.map(() => Math.random() * 30 + 5));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000 bg-dark-bg/50 backdrop-blur-sm">
      <div className={`hologram-flicker transition-all duration-1000 ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
        <div className="w-[90vw] max-w-6xl h-[85vh] max-h-5xl glass rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,243,255,0.3),0_10px_30px_rgba(188,19,254,0.2)] border border-neon-blue/30">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neon-blue/20 bg-gradient-to-r from-dark-bg/80 to-glass-bg/60">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue" />
                <div className="absolute inset-1 rounded-full bg-dark-bg" />
                <div className="absolute inset-2 rounded-full bg-neon-blue animate-pulse" />
              </div>
              <h2 className="text-xl font-quantum font-bold">Neural Connection Hub</h2>
              <div className="text-xs font-cyber text-neon-green bg-neon-green/10 px-2 py-1 rounded">
                v2.1.7
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-neon-green/50 hover:bg-neon-green transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors cursor-pointer" />
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full glass hover:bg-red-500/20 transition-colors flex items-center justify-center group"
              >
                <Circle className="w-4 h-4 rotate-45 group-hover:text-red-400" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex h-[calc(100%-80px)]">
            
            {/* Sidebar */}
            <div className="w-80 border-r border-neon-blue/20 p-6 space-y-6 bg-gradient-to-b from-dark-bg/60 to-glass-bg/40">
              
              {/* AI Assistant */}
              <div className="glass-dark rounded-xl p-4 border border-neon-blue/20">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple overflow-hidden">
                    <div className="absolute inset-1 rounded-full bg-dark-bg/90" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end justify-center gap-1 px-2">
                      {aiWaves.map((height, i) => (
                        <div
                          key={i}
                          className="w-1 bg-neon-blue/70 rounded-full transition-all duration-150"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-quantum font-bold text-neon-blue">NEXUS AI</h3>
                    <div className="flex items-center gap-2 text-xs text-neon-green">
                      <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                      System Online
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Metrics */}
              <div className="glass-dark rounded-xl p-4 border border-neon-blue/20">
                <h4 className="font-cyber font-bold mb-3 text-neon-blue">Connection Metrics</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Signal Strength', value: `${systemStatus.signalStrength.toFixed(1)}%`, color: systemStatus.signalStrength > 90 ? 'text-neon-green' : 'text-yellow-400' },
                    { label: 'Neural Sync', value: `${systemStatus.neuralSync.toFixed(1)}%`, color: systemStatus.neuralSync > 80 ? 'text-neon-blue' : 'text-yellow-400' },
                    { label: 'Quantum Entanglement', value: `${systemStatus.quantumEntanglement.toFixed(1)}%`, color: 'text-neon-purple' },
                    { label: 'Bandwidth', value: `${systemStatus.bandwidth.toFixed(1)} TB/s`, color: 'text-neon-green' },
                    { label: 'CPU Usage', value: `${systemStatus.cpuUsage.toFixed(0)}%`, color: systemStatus.cpuUsage > 80 ? 'text-red-400' : 'text-neon-blue' },
                    { label: 'Memory', value: `${systemStatus.memoryUsage.toFixed(0)}%`, color: systemStatus.memoryUsage > 75 ? 'text-yellow-400' : 'text-neon-green' },
                    { label: 'Latency', value: `${systemStatus.networkLatency.toFixed(0)}ms`, color: systemStatus.networkLatency < 20 ? 'text-neon-green' : 'text-yellow-400' }
                  ].map((metric) => (
                    <div key={metric.label} className="flex justify-between">
                      <span className="text-text-color/60">{metric.label}</span>
                      <span className={metric.color}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neural Visualizer */}
              <NeuralVisualizer />
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {!isAuthenticated ? (
                <BiometricAuth onAuthSuccess={handleAuthSuccess} />
              ) : (
                <RealTimeChatInterface />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicInterface;
