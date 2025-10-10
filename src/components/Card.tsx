'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'glass' | 'glass-dark';
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = '',
  variant = 'glass',
  hover = false
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`${variant} rounded-2xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
