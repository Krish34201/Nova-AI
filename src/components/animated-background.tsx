'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

declare global {
  interface Window {
    VANTA: any;
  }
}

const AnimatedBackground = () => {
  const { resolvedTheme } = useTheme();
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkVanta = setInterval(() => {
        if (window.VANTA && window.VANTA.WAVES) {
          clearInterval(checkVanta);
          if (!vantaEffect) {
            setVantaEffect(
              window.VANTA.WAVES({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x0,
                shininess: 35.00,
                waveHeight: 15.00,
                waveSpeed: 0.8,
                zoom: 0.8,
              })
            );
          }
        }
      }, 100);

      return () => clearInterval(checkVanta);
    }
  }, []);

  useEffect(() => {
    if (vantaEffect && vantaEffect.renderer) {
        // This dynamically updates the colors when the theme changes.
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim();

        const convertHslToHex = (hsl: string) => {
            const [h, s, l] = hsl.match(/\d+/g)!.map(Number);
            const hDecimal = h / 360;
            const sDecimal = s / 100;
            const lDecimal = l / 100;
            
            let r, g, b;
            if (s === 0) {
                r = g = b = lDecimal;
            } else {
                const hue2rgb = (p: number, q: number, t: number) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                }
                const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
                const p = 2 * lDecimal - q;
                r = hue2rgb(p, q, hDecimal + 1/3);
                g = hue2rgb(p, q, hDecimal);
                b = hue2rgb(p, q, hDecimal - 1/3);
            }
            const toHex = (x: number) => {
                const hex = Math.round(x * 255).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }

        const primaryHex = parseInt(convertHslToHex(primaryColor).substring(1), 16);
        const secondaryHex = parseInt(convertHslToHex(secondaryColor).substring(1), 16);
      
        vantaEffect.setOptions({
            color1: primaryHex,
            color2: secondaryHex,
        });
    }
  }, [vantaEffect, resolvedTheme]);

  useEffect(() => {
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default AnimatedBackground;
