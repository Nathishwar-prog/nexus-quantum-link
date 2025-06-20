
import { Button } from "@/components/ui/button";
import { Zap, User } from "lucide-react";

interface HeroProps {
  onConnect: () => void;
  onProfile?: () => void;
}

const Hero = ({ onConnect, onProfile }: HeroProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="max-w-4xl space-y-8">
        
        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-quantum font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink glitch">
            NEXUS
          </h1>
          <p className="text-xl md:text-2xl font-cyber text-neon-blue">
            Neural Exchange & Unified Synaptic System
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg font-cyber text-text-color/80 max-w-2xl mx-auto leading-relaxed">
            Connect to the quantum neural network. Experience real-time consciousness synchronization 
            with agents across the digital realm.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm font-cyber text-neon-green">
            <span>🧠 Neural Interface Active</span>
            <span>⚡ Quantum Encryption Enabled</span>
            <span>🌐 Global Network Access</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onConnect}
            className="bg-gradient-to-r from-neon-purple to-neon-blue hover:shadow-[0_10px_30px_rgba(0,243,255,0.4)] hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-cyber font-bold tracking-wider"
          >
            <Zap className="w-5 h-5 mr-2" />
            CONNECT TO NEXUS
          </Button>
          
          {onProfile && (
            <Button
              onClick={onProfile}
              variant="outline"
              className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 px-8 py-4 text-lg font-cyber font-bold tracking-wider"
            >
              <User className="w-5 h-5 mr-2" />
              NEURAL PROFILE
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto pt-8">
          <div className="text-center space-y-1">
            <div className="text-2xl font-quantum font-bold text-neon-blue">∞</div>
            <div className="text-xs font-cyber text-text-color/60">Neural Agents</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-quantum font-bold text-neon-purple">24/7</div>
            <div className="text-xs font-cyber text-text-color/60">Network Uptime</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-quantum font-bold text-neon-green">∞</div>
            <div className="text-xs font-cyber text-text-color/60">Data Streams</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
