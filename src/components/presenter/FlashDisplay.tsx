import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface FlashDisplayProps {
  isVisible: boolean;
  hasHistory: boolean;
  children: ReactNode;
}

export function FlashDisplay({ isVisible, hasHistory, children }: FlashDisplayProps) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-0">
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            key="stimulus"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="w-full h-full flex items-center justify-center p-8"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="blank"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="select-none text-center"
          >
            {hasHistory ? (
              <div className="text-gray-300">
                <p className="text-2xl">몇 개였을까요?</p>
                <p className="text-base mt-2">← 다시 보기 &nbsp; → 다음</p>
              </div>
            ) : (
              <p className="text-gray-300 text-2xl">
                스페이스바를 눌러 시작하세요
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
