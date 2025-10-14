'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-shrink-0 px-4 py-2.5 rounded-xl font-semibold transition-all
              text-sm sm:text-base whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-white text-purple-600 shadow-lg' 
                : 'bg-white/20 text-white hover:bg-white/30'
              }
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tabs.find(tab => tab.id === activeTab)?.content}
      </motion.div>
    </div>
  );
}
