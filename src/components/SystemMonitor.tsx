
import { useState, useEffect } from 'react';

interface SystemMonitorProps {
  status: {
    signalStrength: number;
    neuralSync: number;
    quantumEntanglement: number;
    bandwidth: number;
    cpuUsage: number;
    memoryUsage: number;
    networkLatency: number;
  };
  isVisible: boolean;
}

const SystemMonitor = ({ status, isVisible }: SystemMonitorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'NEXUS Core initialized',
    'Quantum processors online',
    'Neural networks synchronized',
    'Security protocols enabled'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const logMessages = [
        'Quantum flux stabilized',
        'Neural pathways optimized',
        'Data stream encrypted',
        'Connection verified',
        'System resources balanced',
        'Network topology updated',
        'Biometric scan completed',
        'Authentication tokens refreshed'
      ];
      
      const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
      setLogs(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()} - ${randomMessage}`]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`glass rounded-lg border border-neon-blue/30 transition-all duration-500 ${
        isExpanded ? 'w-80 h-64' : 'w-16 h-16'
      }`}>
        
        {/* Monitor Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 right-2 w-12 h-12 rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-blue/30 hover:border-neon-blue/50 transition-all duration-300 flex items-center justify-center group"
        >
          <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse-glow" />
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-sm font-quantum font-bold text-neon-blue mb-3">System Monitor</h3>
            
            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: 'CPU', value: `${status.cpuUsage.toFixed(0)}%`, color: status.cpuUsage > 80 ? 'text-red-400' : 'text-neon-green' },
                { label: 'Memory', value: `${status.memoryUsage.toFixed(0)}%`, color: status.memoryUsage > 75 ? 'text-yellow-400' : 'text-neon-blue' },
                { label: 'Network', value: `${status.networkLatency.toFixed(0)}ms`, color: status.networkLatency < 20 ? 'text-neon-green' : 'text-yellow-400' },
                { label: 'Signal', value: `${status.signalStrength.toFixed(0)}%`, color: 'text-neon-purple' }
              ].map((metric) => (
                <div key={metric.label} className="bg-dark-bg/50 rounded p-2 text-xs">
                  <div className="text-text-color/60">{metric.label}</div>
                  <div className={`font-mono ${metric.color}`}>{metric.value}</div>
                </div>
              ))}
            </div>

            {/* System Logs */}
            <div className="flex-1 overflow-hidden">
              <h4 className="text-xs font-cyber text-neon-blue mb-2">System Logs</h4>
              <div className="h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/30 scrollbar-track-transparent">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs text-text-color/60 font-mono mb-1 fade-slide-up">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-neon-blue/20">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <span className="text-xs text-neon-green font-cyber">ALL SYSTEMS NOMINAL</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemMonitor;
