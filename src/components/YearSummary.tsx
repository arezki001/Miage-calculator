import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  calcSemesterAverage,
  calcCreditsEarned,
  getTotalCredits,
  type Grades,
  type Lang,
} from '../data/courses'

interface YearSummaryProps {
  year: 'l1' | 'l2' | 'l3'
  grades: Grades
  lang: Lang
  isDark: boolean
  onTabChange: (tab: string) => void
}

const YEAR_SEMS: Record<'l1' | 'l2' | 'l3', [1 | 2 | 3 | 4 | 5 | 6, 1 | 2 | 3 | 4 | 5 | 6]> = {
  l1: [1, 2],
  l2: [3, 4],
  l3: [5, 6],
}

function SemCard({
  semNum, grades, isDark, onClick,
}: {
  semNum: 1 | 2 | 3 | 4 | 5 | 6
  grades: Grades
  isDark: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()
  const avg = calcSemesterAverage(semNum, grades)
  const credits = calcCreditsEarned(semNum, grades)
  const total = getTotalCredits(semNum)
  const passed = avg !== null && avg >= 10

  const glass = isDark ? 'glass-dark' : 'glass-light'

  return (
    <motion.button
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(245,158,11,0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${glass} rounded-2xl p-6 text-left w-full transition-all cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('semester')} {semNum}
          </span>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {credits}/{total} {t('credits')}
          </p>
        </div>
        {avg !== null && (
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            passed
              ? 'bg-green-500/12 text-green-400 border-green-500/25'
              : 'bg-red-500/12 text-red-400 border-red-500/25'
          }`}>
            {passed ? '✅' : '❌'} {passed ? t('validated') : t('notValidated')}
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className={`text-5xl font-bold ${
          avg === null
            ? isDark ? 'text-slate-700' : 'text-slate-300'
            : passed ? 'text-green-400' : 'text-red-400'
        }`}>
          {avg !== null ? avg.toFixed(2) : '—'}
        </span>
        {avg !== null && (
          <span className={`text-lg mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/20</span>
        )}
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: avg !== null ? `${(avg / 20) * 100}%` : '0%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${passed ? 'bg-green-400' : avg !== null ? 'bg-red-400' : 'bg-slate-600'}`}
        />
      </div>

      <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        ↗ {t('semester')} {semNum}
      </p>
    </motion.button>
  )
}

export default function YearSummary({ year, grades, isDark, onTabChange }: YearSummaryProps) {
  const { t } = useTranslation()
  const [s1, s2] = YEAR_SEMS[year]

  const avg1 = calcSemesterAverage(s1, grades)
  const avg2 = calcSemesterAverage(s2, grades)

  const yearAvg =
    avg1 !== null && avg2 !== null
      ? Math.round(((avg1 + avg2) / 2) * 100) / 100
      : avg1 !== null
      ? avg1
      : avg2 !== null
      ? avg2
      : null

  const credits1 = calcCreditsEarned(s1, grades)
  const credits2 = calcCreditsEarned(s2, grades)
  const totalEarned = credits1 + credits2
  const totalAll = getTotalCredits(s1) + getTotalCredits(s2)

  const passed = yearAvg !== null && yearAvg >= 10
  const avgKey = `${year}Avg` as 'l1Avg' | 'l2Avg' | 'l3Avg'
  const glass = isDark ? 'glass-dark' : 'glass-light'

  return (
    <div className="space-y-6 pt-4">
      {/* Title */}
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t(year)} — {t('yearAvg')}
        </h2>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {totalEarned}/{totalAll} {t('credits')}
        </p>
      </div>

      {/* Semester cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SemCard semNum={s1} grades={grades} isDark={isDark} onClick={() => onTabChange(`s${s1}`)} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <SemCard semNum={s2} grades={grades} isDark={isDark} onClick={() => onTabChange(`s${s2}`)} />
        </motion.div>
      </div>

      {/* Year summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${glass} rounded-2xl p-6`}
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t(avgKey)}
            </p>
            <div className="flex items-end gap-2">
              <span className={`text-6xl font-bold ${
                yearAvg === null
                  ? isDark ? 'text-slate-700' : 'text-slate-300'
                  : passed ? 'text-green-400' : 'text-red-400'
              }`}>
                {yearAvg !== null ? yearAvg.toFixed(2) : '—'}
              </span>
              {yearAvg !== null && (
                <span className={`text-2xl mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/20</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('creditsEarned')}
              </p>
              <p className={`text-3xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {totalEarned}
                <span className={`text-lg ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  /{totalAll}
                </span>
              </p>
            </div>

            {yearAvg !== null && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm ${
                  passed
                    ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                    : 'bg-red-500/15 text-red-400 border border-red-500/30'
                }`}
              >
                {passed ? `✅ ${t('yearValidated')}` : `❌ ${t('yearNotValidated')}`}
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {yearAvg !== null && (
          <div className="mt-5 h-2 rounded-full bg-white/8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(yearAvg / 20) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className={`h-full rounded-full ${
                passed
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : 'bg-gradient-to-r from-red-500 to-red-400'
              }`}
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}
