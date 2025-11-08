'use client';

import React, { useRef, useEffect, memo } from 'react';

const AnimatedBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    let animationFrameId: number;
    
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      const primaryColorH = 180; // Cyan
      const secondaryColorH = 280; // Magenta

      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / (dpr * dpr * 25000));
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

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
  density: number;
  colorH: number;
  vx: number;
  vy: number;

  constructor(canvasWidth: number, canvasHeight: number, colorH: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2.5 + 1;
    this.density = (Math.random() * 30) + 15;
    this.colorH = colorH;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `hsl(${this.colorH}, 100%, 75%)`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsl(${this.colorH}, 100%, 50%)`;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }

  update(mouse: { x: number; y: number }, canvasWidth: number, canvasHeight: number) {
    const dxMouse = mouse.x - this.x;
    const dyMouse = mouse.y - this.y;
    const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
    const maxDistance = 120;
    
    if (distanceMouse < maxDistance) {
      const force = (maxDistance - distanceMouse) / maxDistance;
      const forceDirectionX = dxMouse / distanceMouse;
      const forceDirectionY = dyMouse / distanceMouse;
      this.x -= forceDirectionX * force * this.density * 0.015;
      this.y -= forceDirectionY * force * this.density * 0.015;
    } else {
        this.x += this.vx;
        this.y += this.vy;
    }
    
    if (this.x > canvasWidth + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = canvasWidth + this.size;
    if (this.y > canvasHeight + this.size) this.y = -this.size;
    if (this.y < -this.size) this.y = canvasHeight + this.size;
  }
}

AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;
