import { useEffect, useRef } from 'react';

const NeuralVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Neural network nodes
    const nodes: { x: number; y: number; vx: number; vy: number; connections: number[] }[] = [];
    const nodeCount = 15;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * (canvas.offsetWidth - 40) + 20,
        y: Math.random() * (canvas.offsetHeight - 40) + 20,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: []
      });
    }

    // Create connections
    nodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex);
        }
      }
    });

    let animationId: number;
    let pulsePhase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      pulsePhase += 0.02;

      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 10 || node.x >= canvas.offsetWidth - 10) node.vx *= -1;
        if (node.y <= 10 || node.y >= canvas.offsetHeight - 10) node.vy *= -1;

        // Keep within bounds
        node.x = Math.max(10, Math.min(canvas.offsetWidth - 10, node.x));
        node.y = Math.max(10, Math.min(canvas.offsetHeight - 10, node.y));
      });

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          const target = nodes[targetIndex];
          const distance = Math.sqrt((target.x - node.x) ** 2 + (target.y - node.y) ** 2);
          const opacity = Math.max(0, 1 - distance / 100);
          
          if (opacity > 0) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.6})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Pulse effect
            const pulseIntensity = Math.sin(pulsePhase + i * 0.5) * 0.3 + 0.7;
            ctx.strokeStyle = `rgba(188, 19, 254, ${opacity * pulseIntensity * 0.4})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulseSize = Math.sin(pulsePhase + i * 0.3) * 2 + 6;
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 243, 255, 0.3)';
        ctx.fill();

        // Inner node
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = '#00f3ff';
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#080815';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="glass-dark rounded-xl p-4 border border-neon-blue/20">
      <h4 className="font-cyber font-bold mb-3 text-neon-purple">Neural Network</h4>
      <div className="relative h-32 w-full overflow-hidden rounded-lg bg-dark-bg/50">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute top-2 right-2 text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded">
          ACTIVE
        </div>
      </div>
    </div>
  );
};

export default NeuralVisualizer;
