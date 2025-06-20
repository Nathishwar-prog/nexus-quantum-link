
import { useEffect } from 'react';

const CyberpunkBackground = () => {
  useEffect(() => {
    // Add dynamic background effects
    const grid = document.querySelector('.cyber-grid');
    if (grid) {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        // Update CSS custom properties for parallax effect
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <>
      {/* Scanner Effect */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-0 z-20 pointer-events-none animate-scan shadow-[0_0_15px_#00f3ff,0_0_30px_#00f3ff]" />
      
      {/* Cyberpunk Grid */}
      <div className="cyber-grid fixed inset-0 z-[-1] opacity-20 pointer-events-none perspective-1000">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-bg"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'rotateX(60deg)',
            transformOrigin: 'bottom'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-bg" />
      </div>

      {/* Matrix Rain Effect */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-neon-blue opacity-30 font-mono text-xs animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j} className="block">
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Radial Gradients */}
      <div className="fixed inset-0 z-[-2] pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(188, 19, 254, 0.3) 0%, transparent 70%)',
            top: '20%',
            left: '10%',
            animation: 'quantum-float 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, transparent 70%)',
            top: '60%',
            right: '15%',
            animation: 'quantum-float 10s ease-in-out infinite reverse'
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 45, 148, 0.3) 0%, transparent 70%)',
            bottom: '20%',
            left: '50%',
            animation: 'quantum-float 12s ease-in-out infinite'
          }}
        />
      </div>
    </>
  );
};

export default CyberpunkBackground;
