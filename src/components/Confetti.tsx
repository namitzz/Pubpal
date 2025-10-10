'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#ffd700'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.3,
      }));
      setPieces(newPieces);
      
      setTimeout(() => {
        setPieces([]);
      }, 3000);
    }
  }, [trigger]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}%`, rotate: 0, opacity: 1 }}
          animate={{ 
            y: '100vh', 
            rotate: 360,
            opacity: 0,
          }}
          transition={{ 
            duration: 2 + Math.random(),
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}
