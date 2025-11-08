'use client';

import React, { useRef, useEffect, useCallback, memo } from 'react';

const AnimatedBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      const primaryColorH = 180; // Cyan
      const secondaryColorH = 280; // Magenta

      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / (dpr * dpr * 20000));
      for (let i = 0; i < numParticles; i++) {
        const colorH = Math.random() < 0.2 ? secondaryColorH : primaryColorH;
        particles.push(new Particle(canvas.width / dpr, canvas.height / dpr, colorH));
      }
    };

    const mouse = { x: Infinity, y: Infinity };
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      particles.forEach(p => {
        p.update(mouse, width, height);
        p.draw(ctx);
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = 1 - (distance / 150);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(180, 100%, 70%, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-background">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <canvas ref={canvasRef} className="opacity-50 w-full h-full" />
    </div>
  );
});

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  colorH: number;
  vx: number;
  vy: number;

  constructor(canvasWidth: number, canvasHeight: number, colorH: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2.5 + 1.5; // Bigger particles
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 40) + 20;
    this.colorH = colorH;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3 - 0.2; // Tend to move upwards
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `hsl(${this.colorH}, 100%, 80%)`;
    ctx.shadowBlur = 20; // More glow
    ctx.shadowColor = `hsl(${this.colorH}, 100%, 60%)`;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    
    // Reset shadow for other elements
    ctx.shadowBlur = 0;
  }

  update(mouse: { x: number; y: number }, canvasWidth: number, canvasHeight: number) {
    // Mouse interaction
    const dxMouse = mouse.x - this.x;
    const dyMouse = mouse.y - this.y;
    const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
    const maxDistance = 100;
    
    if (distanceMouse < maxDistance) {
      const force = (maxDistance - distanceMouse) / maxDistance;
      const forceDirectionX = dxMouse / distanceMouse;
      const forceDirectionY = dyMouse / distanceMouse;
      this.x -= forceDirectionX * force * this.density * 0.02;
      this.y -= forceDirectionY * force * this.density * 0.02;
    } else {
        // Automatic movement
        this.x += this.vx;
        this.y += this.vy;
    }
    
    // Wall collision and looping
    if (this.x > canvasWidth + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = canvasWidth + this.size;
    if (this.y > canvasHeight + this.size) this.y = -this.size;
    if (this.y < -this.size) this.y = canvasHeight + this.size;
  }
}


AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;
