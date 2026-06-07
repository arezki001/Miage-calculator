import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { Lang } from '../data/courses'

interface YearSummaryProps {
  year: 'l1' | 'l2' | 'l3'
  semInputs: Record<string, number | null>
  onSemInputChange: (key: string, value: number | null) => void
  lang: Lang
  isDark: boolean
  onTabChange: (tab: string) => void
}

const YEAR_SEMS: Record<'l1' | 'l2' | 'l3', [string, string]> = {
  l1: ['s1', 's2'],
  l2: ['s3', 's4'],
  l3: ['s5', 's6'],
}

function clamp(v: number) {
  return Math.min(20, Math.max(0, v))
}

function parseInput(s: string): number | null {
  if (!s || s === '-' || s === '.') return null
  const n = parseFloat(s)
  return isNaN(n) ? null : clamp(n)
}

/* ── SemAvgInput ──────────────────────────────────────────────── */

interface SemAvgInputProps {
  semKey: string
  value: number | null
  onChange: (key: string, v: number | null) => void
  label: string
  onGoToSem: () => void
  isDark: boolean
}

function SemAvgInput({ semKey, value, onChange, label, onGoToSem, isDark }: SemAvgInputProps) {
  const { t } = useTranslation()
  const passed = value !== null && value >= 10
  const failed = value !== null && value < 10

  const borderColor = passed
    ? 'border-green-500/50 focus:border-green-400'
    : failed
    ? 'border-red-500/50 focus:border-red-400'
    : isDark
    ? 'border-white/15 focus:border-yellow-500/60'
    : 'border-black/12 focus:border-yellow-600/60'

  return (
    <div className={`flex-1 rounded-2xl p-5 border ${isDark ? 'bg-white/[0.04] border-white/8' : 'bg-black/[0.03] border-black/8'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {label}
        </span>
        <button
          type="button"
          onClick={onGoToSem}
          title={`${t('semester')} ${label}`}
          className={`text-xs px-2 py-1 rounded-lg transition-colors ${
            isDark
              ? 'text-yellow-400 hover:bg-yellow-500/10'
              : 'text-yellow-600 hover:bg-yellow-500/10'
          }`}
        >
          → {t('semester')}
        </button>
      </div>

      <input
        type="number"
        min={0}
        max={20}
        step={0.01}
        value={value ?? ''}
        onChange={e => onChange(semKey, parseInput(e.target.value))}
        placeholder={t('enterSemAvg')}
        title={label}
        className={`w-full text-center text-2xl font-bold rounded-xl border px-3 py-3 outline-none transition-colors ${borderColor} ${
          isDark ? 'bg-white/5 text-slate-100' : 'bg-black/3 text-slate-900'
        }`}
      />

      {value !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-2 text-center text-xs font-bold py-1 rounded-lg ${
            passed
              ? isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50'
              : isDark ? 'text-red-400 bg-red-500/10' : 'text-red-600 bg-red-50'
          }`}
        >
          {passed ? `✅ ${t('validated')}` : `❌ ${t('notValidated')}`}
        </motion.div>
      )}
    </div>
  )
}

/* ── YearSummary ──────────────────────────────────────────────── */

export default function YearSummary({
  year, semInputs, onSemInputChange, isDark, onTabChange,
}: YearSummaryProps) {
  const { t } = useTranslation()
  const [semA, semB] = YEAR_SEMS[year]

  const valA = semInputs[semA] ?? null
  const valB = semInputs[semB] ?? null

  const yearAvg =
    valA !== null && valB !== null
      ? Math.round(((valA + valB) / 2) * 100) / 100
      : null

  const yearPassed = yearAvg !== null && yearAvg >= 10
  const glass = isDark ? 'glass-dark' : 'glass-light'

  const semLabel = (key: string) => t(key as any) || key.toUpperCase()
  const yearLabel = t(year as any) || year.toUpperCase()

  const validatedKey = `yearValidated`
  const notValidatedKey = `yearNotValidated`

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {yearLabel}
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('manualNote')}
        </p>
      </div>

      {/* Two semester inputs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SemAvgInput
          semKey={semA}
          value={valA}
          onChange={onSemInputChange}
          label={semLabel(semA)}
          onGoToSem={() => onTabChange(semA)}
          isDark={isDark}
        />
        <SemAvgInput
          semKey={semB}
          value={valB}
          onChange={onSemInputChange}
          label={semLabel(semB)}
          onGoToSem={() => onTabChange(semB)}
          isDark={isDark}
        />
      </div>

      {/* Year average result */}
      <div className={`rounded-2xl ${glass} p-6 flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('yearAvg')} = ({semLabel(semA)} + {semLabel(semB)}) ÷ 2
          </p>
          <motion.p
            key={String(yearAvg)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl font-bold ${
              yearAvg === null
                ? isDark ? 'text-slate-600' : 'text-slate-400'
                : yearPassed ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {yearAvg !== null ? yearAvg.toFixed(2) : '—'}
          </motion.p>
        </div>

        {yearAvg !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`px-5 py-3 rounded-xl font-bold text-sm ${
              yearPassed
                ? 'bg-green-500/15 text-green-400 border border-green-500/30 glow-green'
                : 'bg-red-500/15 text-red-400 border border-red-500/30 glow-red'
            }`}
          >
            {yearPassed ? `✅ ${t(validatedKey as any)}` : `❌ ${t(notValidatedKey as any)}`}
          </motion.div>
        )}
      </div>
    </div>
  )
}
