
import { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface BiometricAuthProps {
  onAuthSuccess: () => void;
}

const BiometricAuth = ({ onAuthSuccess }: BiometricAuthProps) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState<'ready' | 'scanning' | 'analyzing' | 'complete'>('ready');
  const [neuralNodes, setNeuralNodes] = useState<boolean[]>(Array(100).fill(false));
  const { user } = useAuth();

  useEffect(() => {
    // If user is already authenticated, auto-complete the scan
    if (user) {
      setScanPhase('complete');
      setScanProgress(100);
      setTimeout(() => {
        onAuthSuccess();
      }, 1000);
    }
  }, [user, onAuthSuccess]);

  const startScan = () => {
    if (user) {
      onAuthSuccess();
      return;
    }

    setIsScanning(true);
    setScanPhase('scanning');
    setScanProgress(0);

    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 1;
        
        // Activate neural nodes progressively
        if (newProgress % 2 === 0) {
          setNeuralNodes(prevNodes => {
            const newNodes = [...prevNodes];
            const randomIndex = Math.floor(Math.random() * 100);
            if (!newNodes[randomIndex]) {
              newNodes[randomIndex] = true;
            }
            return newNodes;
          });
        }

        if (newProgress === 60) {
          setScanPhase('analyzing');
        }

        if (newProgress >= 100) {
          clearInterval(scanInterval);
          setScanPhase('complete');
          setTimeout(() => {
            onAuthSuccess();
          }, 1500);
        }

        return newProgress;
      });
    }, 50);

    return () => clearInterval(scanInterval);
  };

  const getScanPhaseText = () => {
    if (user) {
      return 'Neural Link Verified - Access Granted';
    }
    
    switch (scanPhase) {
      case 'ready':
        return 'Bio-Neural Authentication Ready';
      case 'scanning':
        return 'Scanning Neural Patterns...';
      case 'analyzing':
        return 'Analyzing Quantum Signatures...';
      case 'complete':
        return 'Authentication Successful - Establishing Link...';
      default:
        return 'Initializing...';
    }
  };

  const getScanPhaseColor = () => {
    if (user) return 'text-neon-green';
    
    switch (scanPhase) {
      case 'ready':
        return 'text-neon-blue';
      case 'scanning':
        return 'text-yellow-400';
      case 'analyzing':
        return 'text-neon-purple';
      case 'complete':
        return 'text-neon-green';
      default:
        return 'text-text-color';
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-8 max-w-md">
        
        {/* Biometric Scanner */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-full border-2 border-neon-blue bg-dark-bg/50 flex items-center justify-center relative overflow-hidden">
            <Circle className="w-16 h-16 text-neon-blue" />
            
            {/* Scanning line effect */}
            {(isScanning || user) && (
              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-scan" />
            )}
            
            {/* Pulse effect when scanning */}
            {(isScanning || user) && (
              <div className="absolute inset-0 rounded-full border-2 border-neon-blue animate-ping opacity-50" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <h3 className={`text-lg font-cyber font-bold ${getScanPhaseColor()}`}>
            {getScanPhaseText()}
          </h3>
          <p className="text-sm text-text-color/60 font-cyber">
            {user ? 'Neural patterns verified' : 'Neural scan required for secure quantum link establishment'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-dark-bg/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-300 rounded-full shadow-[0_0_10px_#00f3ff]"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="text-xs text-text-color/50 font-mono">
            {scanProgress.toFixed(0)}% Complete
          </div>
        </div>

        {/* Neural Matrix */}
        <div className="grid grid-cols-10 gap-1 w-64 mx-auto">
          {neuralNodes.map((isActive, index) => (
            <div
              key={index}
              className={`aspect-square rounded-sm transition-all duration-300 ${
                isActive 
                  ? 'bg-neon-blue shadow-[0_0_5px_#00f3ff]' 
                  : 'bg-white/5'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={startScan}
          disabled={isScanning}
          className={`px-8 py-3 rounded-lg font-cyber font-bold tracking-wide uppercase transition-all duration-300 ${
            isScanning
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-neon-purple to-neon-blue hover:shadow-[0_5px_15px_rgba(0,243,255,0.3)] hover:scale-105'
          }`}
        >
          {user ? 'Access Granted' : (isScanning ? 'Authenticating...' : 'Start Bio-Neural Authentication')}
        </button>

        {/* Security Notice */}
        <div className="text-xs text-text-color/40 font-cyber max-w-xs mx-auto">
          <p>⚡ Quantum-encrypted biometric authentication</p>
          <p>🔒 Your neural patterns are never stored</p>
          <p>🌐 End-to-end quantum entanglement</p>
        </div>
      </div>
    </div>
  );
};

export default BiometricAuth;
