
import { useState, useEffect } from 'react';
import CyberpunkBackground from '../components/CyberpunkBackground';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HolographicInterface from '../components/HolographicInterface';
import ParticleSystem from '../components/ParticleSystem';
import SystemMonitor from '../components/SystemMonitor';

const Index = () => {
  const [isInterfaceActive, setIsInterfaceActive] = useState(false);
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
  }, []);

  const handleConnectToNexus = () => {
    setIsInterfaceActive(true);
  };

  const handleCloseInterface = () => {
    setIsInterfaceActive(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-color relative overflow-hidden">
      <CyberpunkBackground />
      <ParticleSystem />
      
      <div className="relative z-10">
        <Header />
        <Hero onConnect={handleConnectToNexus} />
        
        <SystemMonitor 
          status={systemStatus}
          isVisible={!isInterfaceActive}
        />
        
        <HolographicInterface 
          isActive={isInterfaceActive}
          onClose={handleCloseInterface}
          systemStatus={systemStatus}
        />
      </div>
    </div>
  );
};

export default Index;
