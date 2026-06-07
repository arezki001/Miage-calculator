import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Settings, RotateCcw, Calculator } from 'lucide-react'
import {
  courses,
  calcCourseGrade,
  calcSemesterAverage,
  calcCreditsEarned,
  getTotalCredits,
  getCourseName,
  getDefaultPercentages,
  type Course,
  type Grades,
  type GradeEntry,
  type Lang,
} from '../data/courses'

/* ── helpers ──────────────────────────────────────────────────── */

function clampGrade(v: number) {
  return Math.min(20, Math.max(0, v))
}

function parseGrade(raw: string): number | null {
  if (raw === '' || raw === '-' || raw === '.') return null
  const v = parseFloat(raw)
  return isNaN(v) ? null : clampGrade(v)
}

function fmtGrade(g: number | null): string {
  if (g === null) return '—'
  return g % 1 === 0 ? g.toFixed(0) : g.toFixed(2)
}

function calcSimulator(
  course: Course,
  entry: GradeEntry,
  simulTd: number | null,
  simulTp: number | null,
): { score: number | null; status: 'ok' | 'impossible' | 'already' | 'na' } {
  const { pctExam, pctTd, pctTp } = entry
  if (pctExam === 0) return { score: null, status: 'na' }

  let rest = 0
  if (course.type.includes('+td') && simulTd !== null) rest += (simulTd * pctTd) / 100
  if (course.type.includes('+tp') && simulTp !== null) rest += (simulTp * pctTp) / 100

  const needed = (10 - rest) / (pctExam / 100)
  if (needed <= 0) return { score: 0, status: 'already' }
  if (needed > 20) return { score: needed, status: 'impossible' }
  return { score: Math.round(needed * 100) / 100, status: 'ok' }
}

/* ── GradeInput ────────────────────────────────────────────────── */

interface GradeInputProps {
  value: number | null
  onChange: (v: number | null) => void
  label: string
  isDark: boolean
}

function GradeInput({ value, onChange, label, isDark }: GradeInputProps) {
  const [raw, setRaw] = useState(value !== null ? String(value) : '')
  const isValid = value !== null && value >= 10
  const isInvalid = value !== null && value < 10

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const txt = e.target.value
    setRaw(txt)
    const parsed = parseGrade(txt)
    onChange(parsed)
  }

  function handleBlur() {
    if (value !== null) setRaw(String(value))
    else setRaw('')
  }

  const borderColor = isValid
    ? 'border-green-500/40'
    : isInvalid
    ? 'border-red-500/40'
    : isDark
    ? 'border-white/12'
    : 'border-black/12'

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </span>
      <input
        type="number"
        min={0}
        max={20}
        step={0.25}
        value={raw}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="—"
        className={`grade-input border ${borderColor} ${isDark ? 'text-slate-100' : 'text-slate-800'} placeholder-slate-500`}
      />
    </div>
  )
}

/* ── PercEditor ────────────────────────────────────────────────── */

interface PercEditorProps {
  course: Course
  entry: GradeEntry
  onApply: (pctExam: number, pctTd: number, pctTp: number) => void
  onClose: () => void
  isDark: boolean
}

function PercEditor({ course, entry, onApply, onClose, isDark }: PercEditorProps) {
  const { t } = useTranslation()
  const [pE, setPE] = useState(entry.pctExam)
  const [pD, setPD] = useState(entry.pctTd)
  const [pP, setPP] = useState(entry.pctTp)
  const sum = pE + pD + pP
  const ok = sum === 100

  const defaults = getDefaultPercentages(course.type)

  const inp = `w-16 text-center rounded-md border px-2 py-1 text-sm outline-none transition-colors ${
    isDark
      ? 'bg-white/5 border-white/15 text-slate-200 focus:border-yellow-500/50'
      : 'bg-black/5 border-black/12 text-slate-800 focus:border-yellow-600/50'
  }`

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`mt-2 p-3 rounded-xl border ${
        isDark ? 'bg-slate-800/60 border-white/10' : 'bg-white/60 border-black/8'
      }`}
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('exam')} %
          </span>
          <input type="number" min={0} max={100} value={pE}
            onChange={e => setPE(Number(e.target.value))} className={inp} />
        </div>
        {course.type.includes('+td') && (
          <div className="flex flex-col items-center gap-1">
            <span className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('td')} %
            </span>
            <input type="number" min={0} max={100} value={pD}
              onChange={e => setPD(Number(e.target.value))} className={inp} />
          </div>
        )}
        {course.type.includes('+tp') && (
          <div className="flex flex-col items-center gap-1">
            <span className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('tp')} %
            </span>
            <input type="number" min={0} max={100} value={pP}
              onChange={e => setPP(Number(e.target.value))} className={inp} />
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {!ok && (
            <span className="text-xs text-red-400">{t('percSum')}</span>
          )}
          <span className={`text-xs font-semibold ${ok ? 'text-green-400' : 'text-red-400'}`}>
            = {sum}%
          </span>
          <button
            onClick={() => { setPE(defaults.pctExam); setPD(defaults.pctTd); setPP(defaults.pctTp) }}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-black/5'
            }`}
          >
            ↺
          </button>
          <button
            disabled={!ok}
            onClick={() => { onApply(pE, pD, pP); onClose() }}
            className="text-xs px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t('apply')}
          </button>
          <button
            onClick={onClose}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-black/5'
            }`}
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── CourseRow ─────────────────────────────────────────────────── */

interface CourseRowProps {
  course: Course
  entry: GradeEntry | undefined
  onGradeChange: (courseId: string, field: 'exam' | 'td' | 'tp', value: number | null) => void
  onPercChange: (courseId: string, pctExam: number, pctTd: number, pctTp: number) => void
  lang: Lang
  isDark: boolean
  index: number
}

function CourseRow({ course, entry, onGradeChange, onPercChange, lang, isDark, index }: CourseRowProps) {
  const { t } = useTranslation()
  const [showPerc, setShowPerc] = useState(false)

  const defaults = getDefaultPercentages(course.type)
  const eff: GradeEntry = entry ?? {
    exam: null, td: null, tp: null, ...defaults,
  }

  const grade = calcCourseGrade(course, eff)
  const isValidated = grade !== null && grade >= 10
  const isNotValidated = grade !== null && grade < 10

  const hasTd = course.type.includes('+td')
  const hasTp = course.type.includes('+tp')

  const rowBg = isDark
    ? index % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
    : index % 2 === 0 ? 'bg-black/[0.02]' : 'bg-transparent'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-xl p-3 mb-1 ${rowBg}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Course name */}
        <div className="flex-1 min-w-[160px]">
          <p className={`text-sm font-medium leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {getCourseName(course, lang)}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('coefficient')}: <span className="font-semibold text-yellow-500">{course.coefficient}</span>
            </span>
            <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('credits')}: {course.credits}
            </span>
            {/* Customize button */}
            {(hasTd || hasTp) && (
              <button
                onClick={() => setShowPerc(v => !v)}
                title={t('customPerc')}
                className={`text-[10px] flex items-center gap-0.5 transition-colors ${
                  showPerc
                    ? 'text-yellow-500'
                    : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Settings size={10} />
                {t('customPerc')}
              </button>
            )}
          </div>
        </div>

        {/* Grade inputs */}
        <div className="flex items-end gap-2">
          <GradeInput
            value={eff.exam}
            onChange={v => onGradeChange(course.id, 'exam', v)}
            label={t('exam')}
            isDark={isDark}
          />
          {hasTd && (
            <GradeInput
              value={eff.td}
              onChange={v => onGradeChange(course.id, 'td', v)}
              label={`${t('td')} ${eff.pctTd}%`}
              isDark={isDark}
            />
          )}
          {hasTp && (
            <GradeInput
              value={eff.tp}
              onChange={v => onGradeChange(course.id, 'tp', v)}
              label={`${t('tp')} ${eff.pctTp}%`}
              isDark={isDark}
            />
          )}
        </div>

        {/* Grade + badge */}
        <div className="flex items-center gap-2 min-w-[120px] justify-end">
          <motion.span
            key={grade}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-xl font-bold ${
              grade === null
                ? isDark ? 'text-slate-600' : 'text-slate-400'
                : isValidated
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {fmtGrade(grade)}
          </motion.span>

          {grade !== null && (
            <motion.span
              key={`badge-${isValidated}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                isValidated
                  ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
              }`}
            >
              {isValidated ? `✅ ${t('validated')}` : `❌ ${t('notValidated')}`}
            </motion.span>
          )}
        </div>
      </div>

      {/* Percentage editor */}
      <AnimatePresence>
        {showPerc && (
          <PercEditor
            course={course}
            entry={eff}
            onApply={(pE, pD, pP) => onPercChange(course.id, pE, pD, pP)}
            onClose={() => setShowPerc(false)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Simulator ─────────────────────────────────────────────────── */

interface SimulatorProps {
  semCourses: Course[]
  grades: Grades
  lang: Lang
  isDark: boolean
}

function Simulator({ semCourses, grades, lang, isDark }: SimulatorProps) {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState<string>('')
  const [simTd, setSimTd] = useState<number | null>(null)
  const [simTp, setSimTp] = useState<number | null>(null)

  const complexCourses = semCourses.filter(c => c.type !== 'exam')
  const selected = complexCourses.find(c => c.id === selectedId)

  const defaults = selected ? getDefaultPercentages(selected.type) : null
  const entry = selected
    ? grades[selected.id] ?? { exam: null, td: null, tp: null, ...defaults! }
    : null

  const result = selected && entry
    ? calcSimulator(selected, entry, simTd, simTp)
    : null

  const card = isDark
    ? 'bg-slate-800/40 border-white/8'
    : 'bg-white/40 border-black/8'

  return (
    <div className={`rounded-2xl border p-4 ${card}`}>
      <div className="flex items-center gap-2 mb-3">
        <Calculator size={16} className="text-yellow-500" />
        <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {t('simulatorTitle')}
        </span>
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          — {t('simulatorQuestion')}
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {/* Course select */}
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('course')}
          </span>
          <select
            value={selectedId}
            onChange={e => { setSelectedId(e.target.value); setSimTd(null); setSimTp(null) }}
            className={`text-sm rounded-lg px-3 py-1.5 outline-none border transition-colors ${
              isDark
                ? 'bg-slate-700/60 border-white/10 text-slate-200'
                : 'bg-white/60 border-black/10 text-slate-700'
            }`}
          >
            <option value="">{t('selectCourse')}</option>
            {complexCourses.map(c => (
              <option key={c.id} value={c.id}>{getCourseName(c, lang)}</option>
            ))}
          </select>
        </div>

        {/* TD input */}
        {selected?.type.includes('+td') && (
          <div className="flex flex-col items-center gap-1">
            <span className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('td')}
            </span>
            <input
              type="number" min={0} max={20} step={0.25}
              placeholder="—"
              value={simTd ?? ''}
              onChange={e => setSimTd(parseGrade(e.target.value))}
              className={`grade-input border ${isDark ? 'border-white/12 text-slate-100' : 'border-black/12 text-slate-800'}`}
            />
          </div>
        )}

        {/* TP input */}
        {selected?.type.includes('+tp') && (
          <div className="flex flex-col items-center gap-1">
            <span className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('tp')}
            </span>
            <input
              type="number" min={0} max={20} step={0.25}
              placeholder="—"
              value={simTp ?? ''}
              onChange={e => setSimTp(parseGrade(e.target.value))}
              className={`grade-input border ${isDark ? 'border-white/12 text-slate-100' : 'border-black/12 text-slate-800'}`}
            />
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 ml-auto"
          >
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('neededScore')}:
            </span>
            {result.status === 'ok' && (
              <span className="text-xl font-bold text-yellow-400">
                {fmtGrade(result.score)}
              </span>
            )}
            {result.status === 'impossible' && (
              <span className="text-sm font-bold text-red-400">{t('impossible')}</span>
            )}
            {result.status === 'already' && (
              <span className="text-sm font-bold text-green-400">{t('alreadyPassed')}</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* ── SemesterView (main) ───────────────────────────────────────── */

interface SemesterViewProps {
  semNum: 1 | 2 | 3 | 4 | 5 | 6
  grades: Grades
  onGradeChange: (courseId: string, field: 'exam' | 'td' | 'tp', value: number | null) => void
  onPercChange: (courseId: string, pctExam: number, pctTd: number, pctTp: number) => void
  onReset: () => void
  lang: Lang
  isDark: boolean
}

export default function SemesterView({
  semNum, grades, onGradeChange, onPercChange, onReset, lang, isDark,
}: SemesterViewProps) {
  const { t } = useTranslation()
  const [confirmReset, setConfirmReset] = useState(false)

  const semCourses = courses.filter(c => c.semester === semNum)
  const avg = calcSemesterAverage(semNum, grades)
  const credits = calcCreditsEarned(semNum, grades)
  const totalCred = getTotalCredits(semNum)
  const passed = avg !== null && avg >= 10

  const glass = isDark ? 'glass-dark' : 'glass-light'

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return }
    onReset(); setConfirmReset(false)
  }

  return (
    <div className="space-y-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('semester')} {semNum}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {semCourses.length} {t('course')}s · {totalCred} {t('credits')}
          </p>
        </div>
        {/* Reset button */}
        {!confirmReset ? (
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
              isDark
                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/8'
                : 'text-slate-500 hover:text-red-500 hover:bg-red-500/8 border border-black/8'
            }`}
          >
            <RotateCcw size={14} /> {t('reset')}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('resetConfirm')}
            </span>
            <button onClick={handleReset} className="px-2 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold">✓</button>
            <button onClick={() => setConfirmReset(false)} className={`px-2 py-1 text-sm rounded-md ${isDark ? 'hover:bg-white/8 text-slate-400' : 'hover:bg-black/5 text-slate-500'}`}>✕</button>
          </div>
        )}
      </div>

      {/* Courses card */}
      <div className={`rounded-2xl ${glass} p-4 card-hover`}>
        {/* Column headers */}
        <div className={`hidden md:flex items-center gap-3 px-3 pb-2 mb-1 border-b text-[11px] uppercase tracking-wider font-semibold ${
          isDark ? 'border-white/8 text-slate-500' : 'border-black/8 text-slate-400'
        }`}>
          <span className="flex-1">{t('course')}</span>
          <span className="w-20 text-center">{t('exam')}</span>
          <span className="w-20 text-center">{t('td')}</span>
          <span className="w-20 text-center">{t('tp')}</span>
          <span className="w-24 text-right">{t('grade')} / {t('status')}</span>
        </div>

        {semCourses.map((course, i) => (
          <CourseRow
            key={course.id}
            course={course}
            entry={grades[course.id]}
            onGradeChange={onGradeChange}
            onPercChange={onPercChange}
            lang={lang}
            isDark={isDark}
            index={i}
          />
        ))}
      </div>

      {/* Semester stats */}
      <div className={`rounded-2xl ${glass} p-5 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('average')}
            </p>
            <motion.p
              key={avg}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-3xl font-bold ${
                avg === null
                  ? isDark ? 'text-slate-600' : 'text-slate-400'
                  : passed ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {avg !== null ? avg.toFixed(2) : '—'}
            </motion.p>
          </div>
          <div>
            <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('creditsEarned')}
            </p>
            <p className={`text-3xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {credits}
              <span className={`text-lg ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                /{totalCred}
              </span>
            </p>
          </div>
        </div>

        {avg !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm ${
              passed
                ? 'bg-green-500/15 text-green-400 border border-green-500/30 glow-green'
                : 'bg-red-500/15 text-red-400 border border-red-500/30 glow-red'
            }`}
          >
            {passed ? `✅ ${t('semesterValidated')}` : `❌ ${t('semesterNotValidated')}`}
          </motion.div>
        )}
      </div>

      {/* Simulator */}
      <Simulator semCourses={semCourses} grades={grades} lang={lang} isDark={isDark} />
    </div>
  )
}
