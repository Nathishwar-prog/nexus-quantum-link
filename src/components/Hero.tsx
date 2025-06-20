
import { useState, useEffect } from 'react';

interface HeroProps {
  onConnect: () => void;
}

const Hero = ({ onConnect }: HeroProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [glitchText, setGlitchText] = useState('NEXUS');

  useEffect(() => {
    const glitchWords = ['NEXUS', 'MATRIX', 'QUANTUM', 'NEURAL'];
    let interval: NodeJS.Timeout;

    if (isHovered) {
      interval = setInterval(() => {
        setGlitchText(glitchWords[Math.floor(Math.random() * glitchWords.length)]);
      }, 200);
    } else {
      setGlitchText('NEXUS');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered]);

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Title */}
        <h1 
          className="text-5xl sm:text-6xl lg:text-8xl font-quantum font-black mb-6 leading-tight"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="bg-gradient-to-r from-text-color via-neon-blue to-neon-purple bg-clip-text text-transparent">
            Connect to the{' '}
          </span>
          <span className="glitch neon-text text-neon-pink block sm:inline">
            {glitchText}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-text-color/80 max-w-3xl mx-auto mb-12 font-cyber leading-relaxed">
          Experience quantum neural integration with our advanced AI system.{' '}
          <span className="text-neon-blue">Expand your consciousness</span> and unlock{' '}
          <span className="text-neon-purple">limitless potential</span> through the neural link.
        </p>

        {/* Neural Interface Button */}
        <div className="relative inline-block">
          <button
            onClick={onConnect}
            className="group relative px-8 py-4 sm:px-12 sm:py-6 bg-transparent border-2 border-neon-blue/50 rounded-lg font-cyber font-bold text-lg sm:text-xl tracking-wider uppercase overflow-hidden transition-all duration-500 hover:scale-105 hover:border-neon-blue hover:shadow-[0_0_50px_rgba(0,243,255,0.5)]"
          >
            {/* Button Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-dark-bg/80 group-hover:bg-dark-bg/40 transition-all duration-500" />
            
            {/* Scanning Line Effect */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan" />
            
            {/* Button Text */}
            <span className="relative z-10 flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse-glow" />
              Initialize Neural Link
              <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse-glow" />
            </span>

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000" />
            </div>
          </button>
        </div>

        {/* Connection Status Indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {[
            { label: 'Quantum Servers', status: 'Online', color: 'text-neon-green' },
            { label: 'Neural Networks', status: 'Active', color: 'text-neon-blue' },
            { label: 'Security Protocols', status: 'Enabled', color: 'text-neon-purple' }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm font-cyber">
              <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')} animate-pulse-glow`} />
              <span className="text-text-color/60">{item.label}:</span>
              <span className={item.color}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Hero;
