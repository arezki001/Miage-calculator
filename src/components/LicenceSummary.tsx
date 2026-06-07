import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { Lang } from '../data/courses'

interface LicenceSummaryProps {
  semInputs: Record<string, number | null>
  onSemInputChange: (key: string, value: number | null) => void
  lang: Lang
  isDark: boolean
  onTabChange: (tab: string) => void
}

const SEM_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const

function clamp(v: number) {
  return Math.min(20, Math.max(0, v))
}

function parseInput(s: string): number | null {
  if (!s || s === '-' || s === '.') return null
  const n = parseFloat(s)
  return isNaN(n) ? null : clamp(n)
}

/* ── SemAvgCard ───────────────────────────────────────────────── */

interface SemAvgCardProps {
  semKey: string
  value: number | null
  onChange: (key: string, v: number | null) => void
  label: string
  onGoToSem: () => void
  isDark: boolean
}

function SemAvgCard({ semKey, value, onChange, label, onGoToSem, isDark }: SemAvgCardProps) {
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
    <div className={`rounded-xl p-4 border ${isDark ? 'bg-white/[0.04] border-white/8' : 'bg-black/[0.03] border-black/8'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {label}
        </span>
        <button
          type="button"
          onClick={onGoToSem}
          title={`${t('semester')} ${label}`}
          className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
            isDark ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-yellow-600 hover:bg-yellow-500/10'
          }`}
        >
          →
        </button>
      </div>
      <input
        type="number"
        min={0}
        max={20}
        step={0.01}
        value={value ?? ''}
        onChange={e => onChange(semKey, parseInput(e.target.value))}
        placeholder="—"
        title={label}
        className={`w-full text-center text-xl font-bold rounded-lg border px-2 py-2 outline-none transition-colors ${borderColor} ${
          isDark ? 'bg-white/5 text-slate-100' : 'bg-black/3 text-slate-900'
        }`}
      />
      {value !== null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-1.5 text-center text-[10px] font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}
        >
          {value.toFixed(2)} {passed ? '✅' : '❌'}
        </motion.p>
      )}
    </div>
  )
}

/* ── YearBlock ────────────────────────────────────────────────── */

interface YearBlockProps {
  yearLabel: string
  semA: string
  semB: string
  labelA: string
  labelB: string
  valA: number | null
  valB: number | null
  onChange: (key: string, v: number | null) => void
  onGoToSem: (sem: string) => void
  isDark: boolean
}

function YearBlock({ yearLabel, semA, semB, labelA, labelB, valA, valB, onChange, onGoToSem, isDark }: YearBlockProps) {
  const { t } = useTranslation()
  const avg = valA !== null && valB !== null ? Math.round(((valA + valB) / 2) * 100) / 100 : null
  const passed = avg !== null && avg >= 10

  return (
    <div className={`rounded-2xl p-4 border ${isDark ? 'bg-white/[0.03] border-white/8' : 'bg-black/[0.02] border-black/8'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {yearLabel}
        </span>
        {avg !== null && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              passed
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}
          >
            {avg.toFixed(2)} {passed ? `✅ ${t('validated')}` : `❌ ${t('notValidated')}`}
          </motion.span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SemAvgCard
          semKey={semA} value={valA} onChange={onChange}
          label={labelA} onGoToSem={() => onGoToSem(semA)} isDark={isDark}
        />
        <SemAvgCard
          semKey={semB} value={valB} onChange={onChange}
          label={labelB} onGoToSem={() => onGoToSem(semB)} isDark={isDark}
        />
      </div>
    </div>
  )
}

/* ── LicenceSummary ───────────────────────────────────────────── */

export default function LicenceSummary({
  semInputs, onSemInputChange, isDark, onTabChange,
}: LicenceSummaryProps) {
  const { t } = useTranslation()
  const glass = isDark ? 'glass-dark' : 'glass-light'

  const vals = SEM_KEYS.map(k => semInputs[k] ?? null)
  const [v1, v2, v3, v4, v5, v6] = vals

  const licenceAvg =
    vals.every(v => v !== null)
      ? Math.round(((vals as number[]).reduce((a, b) => a + b, 0) / 6) * 100) / 100
      : null

  const licencePassed = licenceAvg !== null && licenceAvg >= 10
  const filledCount = vals.filter(v => v !== null).length

  const semLabel = (k: string) => t(k as any) || k.toUpperCase()

  return (
    <div className="space-y-5 pt-4">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('licence')} — {t('licenceAvg')}
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('manualNote')}
        </p>
      </div>

      {/* Three year blocks */}
      <div className="space-y-4">
        <YearBlock
          yearLabel="L1"
          semA="s1" semB="s2"
          labelA={semLabel('s1')} labelB={semLabel('s2')}
          valA={v1} valB={v2}
          onChange={onSemInputChange}
          onGoToSem={onTabChange}
          isDark={isDark}
        />
        <YearBlock
          yearLabel="L2"
          semA="s3" semB="s4"
          labelA={semLabel('s3')} labelB={semLabel('s4')}
          valA={v3} valB={v4}
          onChange={onSemInputChange}
          onGoToSem={onTabChange}
          isDark={isDark}
        />
        <YearBlock
          yearLabel="L3"
          semA="s5" semB="s6"
          labelA={semLabel('s5')} labelB={semLabel('s6')}
          valA={v5} valB={v6}
          onChange={onSemInputChange}
          onGoToSem={onTabChange}
          isDark={isDark}
        />
      </div>

      {/* Licence grand total */}
      <div className={`rounded-2xl ${glass} p-6 flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('licenceAvg')} = (S1+S2+S3+S4+S5+S6) ÷ 6
          </p>
          <motion.p
            key={String(licenceAvg)}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl font-bold ${
              licenceAvg === null
                ? isDark ? 'text-slate-600' : 'text-slate-400'
                : licencePassed ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {licenceAvg !== null ? licenceAvg.toFixed(2) : '—'}
          </motion.p>
          {filledCount > 0 && filledCount < 6 && (
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {filledCount}/6 {t('semester')}s
            </p>
          )}
        </div>

        {licenceAvg !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`px-5 py-3 rounded-xl font-bold text-sm ${
              licencePassed
                ? 'bg-green-500/15 text-green-400 border border-green-500/30 glow-green'
                : 'bg-red-500/15 text-red-400 border border-red-500/30 glow-red'
            }`}
          >
            {licencePassed ? `✅ ${t('licenceValidated')}` : `❌ ${t('licenceNotValidated')}`}
          </motion.div>
        )}
      </div>
    </div>
  )
}
