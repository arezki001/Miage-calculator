import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { RotateCcw, Calculator, Pencil, X } from 'lucide-react'
import {
  courses,
  calcCourseGrade,
  calcSemesterAverage,
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
  if (!raw || raw === '-' || raw === '.') return null
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

const TYPE_COLORS = {
  exam: { border: '#3B82F6', text: '#60A5FA' },
  td:   { border: '#10B981', text: '#34D399' },
  tp:   { border: '#8B5CF6', text: '#A78BFA' },
} as const

interface GradeInputProps {
  value: number | null
  onChange: (v: number | null) => void
  label: string
  colorType: 'exam' | 'td' | 'tp'
  isDark: boolean
}

function GradeInput({ value, onChange, label, colorType, isDark }: GradeInputProps) {
  const [raw, setRaw] = useState(value !== null ? String(value) : '')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) {
      setRaw(value !== null ? String(value) : '')
    }
  }, [value, focused])

  const hasValue = value !== null
  const isValid = hasValue && value! >= 10
  const isInvalid = hasValue && value! < 10

  const tc = TYPE_COLORS[colorType]
  const borderColor = isValid ? '#22C55E' : isInvalid ? '#EF4444' : tc.border
  const labelColor = hasValue ? (isValid ? '#4ADE80' : '#F87171') : tc.text

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRaw(e.target.value)
    onChange(parseGrade(e.target.value))
  }

  function handleBlur() {
    setFocused(false)
    setRaw(value !== null ? String(value) : '')
  }

  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-[62px]">
      <span className="text-xs font-bold uppercase tracking-wide leading-none" style={{ color: labelColor }}>
        {label}
      </span>
      <input
        type="number"
        min={0}
        max={20}
        step={0.25}
        value={raw}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        placeholder="0-20"
        className={`w-full text-center font-bold rounded-xl outline-none transition-all duration-200 ${
          isDark ? 'bg-slate-800/60 text-slate-100' : 'bg-white/90 text-slate-900'
        }`}
        style={{
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor,
          fontSize: '1.125rem',
          minHeight: '52px',
          boxShadow: focused ? `0 0 0 3px ${borderColor}30` : 'none',
        }}
      />
    </div>
  )
}

/* ── PercModal ─────────────────────────────────────────────────── */

interface PercModalProps {
  course: Course
  entry: GradeEntry
  onApply: (pctExam: number, pctTd: number, pctTp: number) => void
  onClose: () => void
  isDark: boolean
}

function PercModal({ course, entry, onApply, onClose, isDark }: PercModalProps) {
  const { t } = useTranslation()
  const [pE, setPE] = useState(entry.pctExam)
  const [pD, setPD] = useState(entry.pctTd)
  const [pP, setPP] = useState(entry.pctTp)
  const sum = pE + pD + pP
  const ok = sum === 100
  const defaults = getDefaultPercentages(course.type)

  const inp = `w-20 text-center rounded-xl border-2 px-2 py-3 text-base outline-none transition-all font-bold ${
    isDark
      ? 'bg-slate-800/60 border-white/15 text-slate-200 focus:border-yellow-500'
      : 'bg-white/90 border-black/12 text-slate-800 focus:border-yellow-500'
  }`

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-sm rounded-2xl shadow-2xl p-5 ${
          isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-black/8'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Pencil size={14} className="text-orange-500" />
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('editPerc')}
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-[220px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {course.nameFr.length > 40 ? course.nameFr.slice(0, 40) + '…' : course.nameFr}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-end justify-center gap-4 mb-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: TYPE_COLORS.exam.text }}>
              {t('exam')} %
            </span>
            <input
              type="number" min={0} max={100} value={pE}
              onChange={e => setPE(Math.max(0, Math.min(100, Number(e.target.value))))}
              className={inp}
            />
          </div>
          {course.type.includes('+td') && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: TYPE_COLORS.td.text }}>
                {t('td')} %
              </span>
              <input
                type="number" min={0} max={100} value={pD}
                onChange={e => setPD(Math.max(0, Math.min(100, Number(e.target.value))))}
                className={inp}
              />
            </div>
          )}
          {course.type.includes('+tp') && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: TYPE_COLORS.tp.text }}>
                {t('tp')} %
              </span>
              <input
                type="number" min={0} max={100} value={pP}
                onChange={e => setPP(Math.max(0, Math.min(100, Number(e.target.value))))}
                className={inp}
              />
            </div>
          )}
        </div>

        <div className={`flex items-center justify-center gap-2 mb-4 py-2.5 rounded-xl ${
          ok
            ? isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
            : isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
        }`}>
          <span className={`text-sm font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>
            Total = {sum}% {ok ? '✓' : `(${t('percSum')})`}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setPE(defaults.pctExam); setPD(defaults.pctTd); setPP(defaults.pctTp) }}
            className={`flex-1 py-2.5 text-sm rounded-xl border font-semibold transition-colors ${
              isDark ? 'border-white/12 text-slate-400 hover:bg-white/5' : 'border-black/10 text-slate-500 hover:bg-black/4'
            }`}
          >
            ↺ {t('reset')}
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 text-sm rounded-xl border font-semibold transition-colors ${
              isDark ? 'border-white/12 text-slate-400 hover:bg-white/5' : 'border-black/10 text-slate-500 hover:bg-black/4'
            }`}
          >
            {t('cancel')}
          </button>
          <button
            disabled={!ok}
            onClick={() => { onApply(pE, pD, pP); onClose() }}
            className="flex-1 py-2.5 text-sm rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t('apply')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── CourseRow ─────────────────────────────────────────────────── */

interface CourseRowProps {
  course: Course
  entry: GradeEntry | undefined
  onGradeChange: (courseId: string, field: 'exam' | 'td' | 'tp', value: number | null) => void
  onOpenPerc: (courseId: string) => void
  lang: Lang
  isDark: boolean
  index: number
}

function CourseRow({ course, entry, onGradeChange, onOpenPerc, lang, isDark, index }: CourseRowProps) {
  const { t } = useTranslation()
  const defaults = getDefaultPercentages(course.type)
  const eff: GradeEntry = entry ?? { exam: null, td: null, tp: null, ...defaults }

  const grade = calcCourseGrade(course, eff)
  const isValidated = grade !== null && grade >= 10
  const hasTd = course.type.includes('+td')
  const hasTp = course.type.includes('+tp')
  const hasCustomPerc = entry && (
    entry.pctExam !== defaults.pctExam ||
    entry.pctTd !== defaults.pctTd ||
    entry.pctTp !== defaults.pctTp
  )

  const gradeColor = grade === null
    ? isDark ? '#475569' : '#94A3B8'
    : isValidated ? '#4ADE80' : '#F87171'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.3, ease: 'easeOut' }}
      className={`rounded-xl p-3 mb-2 border ${
        isDark
          ? index % 2 === 0 ? 'bg-white/[0.03] border-white/5' : 'bg-transparent border-transparent'
          : index % 2 === 0 ? 'bg-black/[0.025] border-black/5' : 'bg-transparent border-transparent'
      }`}
    >
      {/* Top: course name + grade result */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-tight mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {getCourseName(course, lang)}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${
              isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
            }`}>
              {t('coefficient')}: {course.coefficient}
            </span>
            {(hasTd || hasTp) && (
              <button
                onClick={() => onOpenPerc(course.id)}
                title={t('editPerc')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors min-h-[28px] min-w-[44px]"
              >
                <Pencil size={10} />
                <span>%{hasCustomPerc ? '*' : ''}</span>
              </button>
            )}
          </div>
        </div>

        {/* Grade display */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <motion.span
            key={String(grade)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold leading-none"
            style={{ color: gradeColor }}
          >
            {fmtGrade(grade)}
          </motion.span>
          {grade !== null && (
            <motion.span
              key={`b-${isValidated}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                isValidated
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'bg-red-500/15 text-red-400 border border-red-500/25'
              }`}
            >
              {isValidated ? `✅ ${t('validated')}` : `❌ ${t('notValidated')}`}
            </motion.span>
          )}
        </div>
      </div>

      {/* Bottom: grade inputs */}
      <div className="flex gap-2">
        <GradeInput
          value={eff.exam}
          onChange={v => onGradeChange(course.id, 'exam', v)}
          label={t('exam')}
          colorType="exam"
          isDark={isDark}
        />
        {hasTd && (
          <GradeInput
            value={eff.td}
            onChange={v => onGradeChange(course.id, 'td', v)}
            label={`${t('td')} ${eff.pctTd}%`}
            colorType="td"
            isDark={isDark}
          />
        )}
        {hasTp && (
          <GradeInput
            value={eff.tp}
            onChange={v => onGradeChange(course.id, 'tp', v)}
            label={`${t('tp')} ${eff.pctTp}%`}
            colorType="tp"
            isDark={isDark}
          />
        )}
      </div>
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

  const result = selected && entry ? calcSimulator(selected, entry, simTd, simTp) : null

  const card = isDark ? 'bg-slate-800/40 border-white/8' : 'bg-white/50 border-black/8'

  return (
    <div className={`rounded-2xl border p-4 ${card}`}>
      <div className="flex items-center gap-2 mb-1">
        <Calculator size={15} className="text-yellow-500" />
        <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {t('simulatorTitle')}
        </span>
      </div>
      <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {t('simulatorQuestion')}
      </p>

      <div className="space-y-3">
        <select
          value={selectedId}
          onChange={e => { setSelectedId(e.target.value); setSimTd(null); setSimTp(null) }}
          className={`w-full text-sm rounded-xl px-3 py-2.5 outline-none border-2 transition-all ${
            isDark
              ? 'bg-slate-800/60 border-white/10 text-slate-200 focus:border-yellow-500/50'
              : 'bg-white/80 border-black/10 text-slate-700 focus:border-yellow-500/60'
          }`}
        >
          <option value="">{t('selectCourse')}</option>
          {complexCourses.map(c => (
            <option key={c.id} value={c.id}>{getCourseName(c, lang)}</option>
          ))}
        </select>

        {selected && (selected.type.includes('+td') || selected.type.includes('+tp')) && (
          <div className="flex gap-2">
            {selected.type.includes('+td') && (
              <GradeInput value={simTd} onChange={setSimTd} label={t('td')} colorType="td" isDark={isDark} />
            )}
            {selected.type.includes('+tp') && (
              <GradeInput value={simTp} onChange={setSimTp} label={t('tp')} colorType="tp" isDark={isDark} />
            )}
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl ${
              isDark ? 'bg-white/5' : 'bg-black/4'
            }`}
          >
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('neededScore')}
            </span>
            {result.status === 'ok' && (
              <span className="text-xl font-bold text-yellow-400">{fmtGrade(result.score)}</span>
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

/* ── SemesterView ──────────────────────────────────────────────── */

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
  const [percModalId, setPercModalId] = useState<string | null>(null)

  const semCourses = courses.filter(c => c.semester === semNum)
  const avg = calcSemesterAverage(semNum, grades)
  const passed = avg !== null && avg >= 10
  const glass = isDark ? 'glass-dark' : 'glass-light'

  const percCourse = percModalId ? semCourses.find(c => c.id === percModalId) : null
  const percDefaults = percCourse ? getDefaultPercentages(percCourse.type) : null
  const percEntry: GradeEntry = percCourse
    ? (grades[percCourse.id] ?? { exam: null, td: null, tp: null, ...percDefaults! })
    : { exam: null, td: null, tp: null, pctExam: 100, pctTd: 0, pctTp: 0 }

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return }
    onReset()
    setConfirmReset(false)
  }

  return (
    <>
      <div className="space-y-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('semester')} {semNum}
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {semCourses.length} {t('course')}s
            </p>
          </div>
          {!confirmReset ? (
            <button
              onClick={handleReset}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all min-h-[40px] ${
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
              <button onClick={handleReset} className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold min-h-[36px]">✓</button>
              <button onClick={() => setConfirmReset(false)} className={`px-3 py-1.5 text-sm rounded-lg min-h-[36px] ${isDark ? 'hover:bg-white/8 text-slate-400' : 'hover:bg-black/5 text-slate-500'}`}>✕</button>
            </div>
          )}
        </div>

        {/* Courses */}
        <div className={`rounded-2xl ${glass} p-3 md:p-4`}>
          {semCourses.map((course, i) => (
            <CourseRow
              key={course.id}
              course={course}
              entry={grades[course.id]}
              onGradeChange={onGradeChange}
              onOpenPerc={setPercModalId}
              lang={lang}
              isDark={isDark}
              index={i}
            />
          ))}
        </div>

        {/* Semester average */}
        <div className={`rounded-2xl ${glass} p-5 flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('average')}
            </p>
            <motion.p
              key={String(avg)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold"
              style={{ color: avg === null ? (isDark ? '#475569' : '#94A3B8') : passed ? '#4ADE80' : '#F87171' }}
            >
              {avg !== null ? avg.toFixed(2) : '—'}
            </motion.p>
          </div>

          {avg !== null && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={`px-5 py-3 rounded-xl font-bold text-sm ${
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

      <AnimatePresence>
        {percModalId && percCourse && (
          <PercModal
            course={percCourse}
            entry={percEntry}
            onApply={(pE, pD, pP) => onPercChange(percModalId, pE, pD, pP)}
            onClose={() => setPercModalId(null)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </>
  )
}
