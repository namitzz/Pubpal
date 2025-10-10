'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['🍻', '🍺', '🍹', '🥂', '🍷', '🥃', '🔥', '😂', '🎉', '⚡', '💪', '👑', '💯', '🤘', '🌟'];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-2xl hover:scale-110 transition-transform"
        aria-label="Pick emoji"
      >
        😊
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full mb-2 right-0 glass rounded-xl p-3 grid grid-cols-5 gap-2 shadow-2xl z-50"
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onSelect(emoji);
                  setIsOpen(false);
                }}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
