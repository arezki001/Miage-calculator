import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  calcSemesterAverage,
  calcCreditsEarned,
  getTotalCredits,
  type Grades,
  type Lang,
} from '../data/courses'

interface LicenceSummaryProps {
  grades: Grades
  lang: Lang
  isDark: boolean
  onTabChange: (tab: string) => void
}

const ALL_SEMS = [1, 2, 3, 4, 5, 6] as const

function MiniSemCard({
  semNum, avg, credits, total, isDark, onClick,
}: {
  semNum: number
  avg: number | null
  credits: number
  total: number
  isDark: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()
  const passed = avg !== null && avg >= 10

  return (
    <motion.button
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(245,158,11,0.18)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`rounded-xl p-4 text-left cursor-pointer transition-all border ${
        isDark
          ? 'bg-slate-800/50 border-white/8 hover:border-yellow-500/20'
          : 'bg-white/50 border-black/8 hover:border-yellow-500/25'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('semester')} {semNum}
        </span>
        {avg !== null && (
          <span className={`text-[10px] ${passed ? 'text-green-400' : 'text-red-400'}`}>
            {passed ? '✅' : '❌'}
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold ${
        avg === null
          ? isDark ? 'text-slate-700' : 'text-slate-300'
          : passed ? 'text-green-400' : 'text-red-400'
      }`}>
        {avg !== null ? avg.toFixed(2) : '—'}
      </p>
      <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
        {credits}/{total} {t('credits')}
      </p>
      <div className="mt-2 h-1 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: avg !== null ? `${(avg / 20) * 100}%` : '0%' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full ${passed ? 'bg-green-400' : avg !== null ? 'bg-red-400' : 'bg-slate-600'}`}
        />
      </div>
    </motion.button>
  )
}

function YearBadge({ label, avg, isDark }: { label: string; avg: number | null; isDark: boolean }) {
  const passed = avg !== null && avg >= 10
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
      isDark ? 'bg-slate-800/40 border-white/8' : 'bg-white/40 border-black/8'
    }`}>
      <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={`text-xl font-bold ${
          avg === null
            ? isDark ? 'text-slate-600' : 'text-slate-400'
            : passed ? 'text-green-400' : 'text-red-400'
        }`}>
          {avg !== null ? avg.toFixed(2) : '—'}
        </span>
        {avg !== null && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
            passed
              ? 'bg-green-500/12 text-green-400 border-green-500/25'
              : 'bg-red-500/12 text-red-400 border-red-500/25'
          }`}>
            {passed ? '✅' : '❌'}
          </span>
        )}
      </div>
    </div>
  )
}

export default function LicenceSummary({ grades, isDark, onTabChange }: LicenceSummaryProps) {
  const { t } = useTranslation()

  const semAvgs = ALL_SEMS.map(s => calcSemesterAverage(s, grades))
  const semCredits = ALL_SEMS.map(s => calcCreditsEarned(s, grades))
  const semTotals = ALL_SEMS.map(s => getTotalCredits(s))

  const validSems = semAvgs.filter(a => a !== null) as number[]
  const licAvg = validSems.length > 0
    ? Math.round((validSems.reduce((s, a) => s + a, 0) / validSems.length) * 100) / 100
    : null

  const l1Avg = semAvgs[0] !== null && semAvgs[1] !== null
    ? Math.round(((semAvgs[0]! + semAvgs[1]!) / 2) * 100) / 100
    : semAvgs[0] ?? semAvgs[1] ?? null

  const l2Avg = semAvgs[2] !== null && semAvgs[3] !== null
    ? Math.round(((semAvgs[2]! + semAvgs[3]!) / 2) * 100) / 100
    : semAvgs[2] ?? semAvgs[3] ?? null

  const l3Avg = semAvgs[4] !== null && semAvgs[5] !== null
    ? Math.round(((semAvgs[4]! + semAvgs[5]!) / 2) * 100) / 100
    : semAvgs[4] ?? semAvgs[5] ?? null

  const totalEarned = semCredits.reduce((s, c) => s + c, 0)
  const totalAll = semTotals.reduce((s, c) => s + c, 0)

  const licPassed = licAvg !== null && licAvg >= 10
  const glass = isDark ? 'glass-dark' : 'glass-light'

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('licenceSummary')}
        </h2>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {totalEarned}/{totalAll} {t('credits')}
        </p>
      </div>

      {/* All 6 semester mini-cards */}
      <div>
        <p className={`text-xs uppercase tracking-wider font-semibold mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          L1
        </p>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-4">
          {[0, 1].map(i => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <MiniSemCard
                semNum={i + 1}
                avg={semAvgs[i]}
                credits={semCredits[i]}
                total={semTotals[i]}
                isDark={isDark}
                onClick={() => onTabChange(`s${i + 1}`)}
              />
            </motion.div>
          ))}
        </div>

        <p className={`text-xs uppercase tracking-wider font-semibold mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          L2
        </p>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-4">
          {[2, 3].map(i => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <MiniSemCard
                semNum={i + 1}
                avg={semAvgs[i]}
                credits={semCredits[i]}
                total={semTotals[i]}
                isDark={isDark}
                onClick={() => onTabChange(`s${i + 1}`)}
              />
            </motion.div>
          ))}
        </div>

        <p className={`text-xs uppercase tracking-wider font-semibold mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          L3
        </p>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          {[4, 5].map(i => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <MiniSemCard
                semNum={i + 1}
                avg={semAvgs[i]}
                credits={semCredits[i]}
                total={semTotals[i]}
                isDark={isDark}
                onClick={() => onTabChange(`s${i + 1}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Year averages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className={`${glass} rounded-2xl p-5 space-y-3`}
      >
        <p className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {t('yearAvg')}
        </p>
        <YearBadge label={t('l1Avg')} avg={l1Avg} isDark={isDark} />
        <YearBadge label={t('l2Avg')} avg={l2Avg} isDark={isDark} />
        <YearBadge label={t('l3Avg')} avg={l3Avg} isDark={isDark} />
      </motion.div>

      {/* Licence final average */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className={`${glass} rounded-2xl p-6`}
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('licenceAvg')}
            </p>
            <div className="flex items-end gap-2">
              <span className={`text-7xl font-bold ${
                licAvg === null
                  ? isDark ? 'text-slate-700' : 'text-slate-300'
                  : licPassed ? 'text-green-400' : 'text-red-400'
              }`}>
                {licAvg !== null ? licAvg.toFixed(2) : '—'}
              </span>
              {licAvg !== null && (
                <span className={`text-2xl mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/20</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('totalCredits')}
              </p>
              <p className={`text-3xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {totalEarned}
                <span className={`text-xl ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  /{totalAll}
                </span>
              </p>
            </div>

            {licAvg !== null && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.5 }}
                className={`px-6 py-3 rounded-xl font-bold text-base ${
                  licPassed
                    ? 'bg-green-500/15 text-green-400 border border-green-500/30 glow-green'
                    : 'bg-red-500/15 text-red-400 border border-red-500/30 glow-red'
                }`}
              >
                {licPassed ? `✅ ${t('licenceValidated')}` : `❌ ${t('licenceNotValidated')}`}
              </motion.div>
            )}
          </div>
        </div>

        {licAvg !== null && (
          <div className="mt-5 h-2.5 rounded-full bg-white/8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(licAvg / 20) * 100}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              className={`h-full rounded-full ${
                licPassed
                  ? 'bg-gradient-to-r from-green-600 to-green-400'
                  : 'bg-gradient-to-r from-red-600 to-red-400'
              }`}
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}
