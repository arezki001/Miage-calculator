import { motion } from 'framer-motion'
import { useMemo } from 'react'

const SYMBOLS = ['∑', 'π', '∫', '∞', '{', '}', '</>', '#', '🎓', 'Δ', 'λ', '≥', '≤', '×']

interface SymbolConfig {
  symbol: string
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
  yRange: number
}

export default function FloatingSymbols() {
  const configs = useMemo<SymbolConfig[]>(() => {
    const seed = [
      { x: 5,  y: 10, size: 28, duration: 7,  delay: 0,   opacity: 0.055, yRange: 14 },
      { x: 15, y: 70, size: 20, duration: 9,  delay: 1.2, opacity: 0.045, yRange: 10 },
      { x: 25, y: 30, size: 36, duration: 6,  delay: 0.5, opacity: 0.06,  yRange: 16 },
      { x: 35, y: 85, size: 18, duration: 11, delay: 2,   opacity: 0.04,  yRange: 8  },
      { x: 50, y: 15, size: 42, duration: 8,  delay: 1.8, opacity: 0.05,  yRange: 18 },
      { x: 60, y: 55, size: 22, duration: 10, delay: 0.8, opacity: 0.05,  yRange: 12 },
      { x: 70, y: 80, size: 30, duration: 7,  delay: 3,   opacity: 0.045, yRange: 14 },
      { x: 80, y: 25, size: 16, duration: 12, delay: 1.5, opacity: 0.04,  yRange: 7  },
      { x: 88, y: 60, size: 34, duration: 9,  delay: 0.3, opacity: 0.055, yRange: 15 },
      { x: 92, y: 40, size: 24, duration: 6,  delay: 2.5, opacity: 0.05,  yRange: 11 },
      { x: 42, y: 45, size: 20, duration: 14, delay: 4,   opacity: 0.04,  yRange: 9  },
      { x: 12, y: 50, size: 32, duration: 8,  delay: 1,   opacity: 0.05,  yRange: 13 },
      { x: 65, y: 5,  size: 26, duration: 11, delay: 2.2, opacity: 0.045, yRange: 10 },
      { x: 78, y: 90, size: 22, duration: 7,  delay: 0.6, opacity: 0.055, yRange: 12 },
    ]
    return seed.map((s, i) => ({ ...s, symbol: SYMBOLS[i % SYMBOLS.length] }))
  }, [])

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
      {configs.map((cfg, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${cfg.x}%`,
            top: `${cfg.y}%`,
            fontSize: cfg.size,
            opacity: cfg.opacity,
            color: '#F59E0B',
            userSelect: 'none',
            fontFamily: 'monospace',
          }}
          animate={{ y: [0, -cfg.yRange, 0] }}
          transition={{
            duration: cfg.duration,
            delay: cfg.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {cfg.symbol}
        </motion.div>
      ))}
    </div>
  )
}
