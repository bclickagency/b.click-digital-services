import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
}

const colors = [
  'hsl(248, 98%, 60%)', // primary
  'hsl(0, 82%, 71%)',   // secondary
  'hsl(45, 100%, 50%)', // gold
  'hsl(160, 100%, 45%)', // green
  'hsl(280, 90%, 55%)', // purple
];

const Confetti = ({ isActive, duration = 3000, particleCount = 50 }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, particleCount]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: '120vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: 'linear',
              }}
              style={{ backgroundColor: piece.color }}
              className="absolute w-3 h-3 rounded-sm"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;
