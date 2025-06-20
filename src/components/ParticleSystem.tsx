
import { useEffect, useRef } from 'react';

const ParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 50;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';
      
      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random color
      const colors = ['#00f3ff', '#bc13fe', '#ff2d94'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.backgroundColor = color;
      particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random opacity
      particle.style.opacity = (Math.random() * 0.6 + 0.2).toString();
      
      // Random animation duration
      const duration = Math.random() * 20 + 10;
      particle.style.animation = `quantum-float ${duration}s infinite ease-in-out`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      
      particles.forEach((particle, index) => {
        const particleX = parseFloat(particle.style.left);
        const particleY = parseFloat(particle.style.top);
        const distance = Math.sqrt((mouseX - particleX) ** 2 + (mouseY - particleY) ** 2);
        
        if (distance < 20) {
          const force = (20 - distance) / 20;
          const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
          const offsetX = Math.cos(angle) * force * 10;
          const offsetY = Math.sin(angle) * force * 10;
          
          particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + force})`;
          particle.style.opacity = (0.8 + force * 0.2).toString();
        } else {
          particle.style.transform = 'translate(0, 0) scale(1)';
          particle.style.opacity = (Math.random() * 0.6 + 0.2).toString();
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default ParticleSystem;
