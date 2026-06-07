import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Background3D from './components/Background3D'
import FloatingSymbols from './components/FloatingSymbols'
import Navbar from './components/Navbar'
import SemesterView from './components/SemesterView'
import YearSummary from './components/YearSummary'
import LicenceSummary from './components/LicenceSummary'
import {
  courses,
  getDefaultPercentages,
  type Grades,
  type GradeEntry,
  type Lang,
} from './data/courses'

/* ── App ─────────────────────────────────────────────────────────── */

export default function App() {
  // ── State ──────────────────────────────────────────────────────
  const [grades, setGrades] = useState<Grades>(() => {
    try {
      const raw = localStorage.getItem('miage-grades-v3')
      return raw ? (JSON.parse(raw) as Grades) : {}
    } catch {
      return {}
    }
  })

  const [semInputs, setSemInputs] = useState<Record<string, number | null>>(() => {
    try {
      const raw = localStorage.getItem('miage-sem-inputs-v1')
      return raw ? (JSON.parse(raw) as Record<string, number | null>) : {}
    } catch { return {} }
  })

  const [activeTab, setActiveTab] = useState('s1')
  const [isDark, setIsDark] = useState(true)
  const lang: Lang = 'en'
  const { t } = useTranslation()

  // ── Persistence ────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('miage-grades-v3', JSON.stringify(grades))
  }, [grades])

  useEffect(() => {
    localStorage.setItem('miage-sem-inputs-v1', JSON.stringify(semInputs))
  }, [semInputs])

  // ── Grade updaters ─────────────────────────────────────────────
  const updateGrade = useCallback(
    (courseId: string, field: 'exam' | 'td' | 'tp', value: number | null) => {
      setGrades(prev => {
        const course = courses.find(c => c.id === courseId)!
        const existing: GradeEntry = prev[courseId] ?? {
          exam: null, td: null, tp: null,
          ...getDefaultPercentages(course.type),
        }
        return { ...prev, [courseId]: { ...existing, [field]: value } }
      })
    },
    [],
  )

  const updatePerc = useCallback(
    (courseId: string, pctExam: number, pctTd: number, pctTp: number) => {
      setGrades(prev => {
        const course = courses.find(c => c.id === courseId)!
        const existing: GradeEntry = prev[courseId] ?? {
          exam: null, td: null, tp: null,
          ...getDefaultPercentages(course.type),
        }
        return { ...prev, [courseId]: { ...existing, pctExam, pctTd, pctTp } }
      })
    },
    [],
  )

  const resetSemester = useCallback((semNum: number) => {
    const ids = courses.filter(c => c.semester === semNum).map(c => c.id)
    setGrades(prev => {
      const next = { ...prev }
      ids.forEach(id => delete next[id])
      return next
    })
  }, [])

  const updateSemInput = useCallback((key: string, value: number | null) => {
    setSemInputs(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetAll = useCallback(() => {
    setGrades({})
    setSemInputs({})
  }, [])

  // ── Theme ──────────────────────────────────────────────────────
  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'

  const textClass = isDark ? 'text-slate-100' : 'text-slate-900'

  // Derive active semester number for SemesterView
  const activeSemNum =
    activeTab.startsWith('s') ? (parseInt(activeTab[1]) as 1 | 2 | 3 | 4 | 5 | 6) : null

  return (
    <div
      className={`min-h-screen ${bgClass} ${textClass}`}
      dir="ltr"
    >
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Background3D isDark={isDark} />
      </div>

      {/* Floating math symbols */}
      <FloatingSymbols />

      {/* Main content */}
      <div className="relative z-10">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDark={isDark}
          onToggleDark={() => setIsDark(d => !d)}
          onResetAll={resetAll}
        />

        <main className="pt-[108px] md:pt-20 px-3 md:px-6 pb-12 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ── Semester view ── */}
            {activeSemNum !== null && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <SemesterView
                  semNum={activeSemNum}
                  grades={grades}
                  onGradeChange={updateGrade}
                  onPercChange={updatePerc}
                  onReset={() => resetSemester(activeSemNum)}
                  lang={lang}
                  isDark={isDark}
                />
              </motion.div>
            )}

            {/* ── Year summaries ── */}
            {(activeTab === 'l1' || activeTab === 'l2' || activeTab === 'l3') && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.22 }}
              >
                <YearSummary
                  year={activeTab as 'l1' | 'l2' | 'l3'}
                  semInputs={semInputs}
                  onSemInputChange={updateSemInput}
                  lang={lang}
                  isDark={isDark}
                  onTabChange={setActiveTab}
                />
              </motion.div>
            )}

            {/* ── Licence summary ── */}
            {activeTab === 'licence' && (
              <motion.div
                key="licence"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.22 }}
              >
                <LicenceSummary
                  semInputs={semInputs}
                  onSemInputChange={updateSemInput}
                  lang={lang}
                  isDark={isDark}
                  onTabChange={setActiveTab}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="relative z-10 pb-8 pt-2 flex justify-center">
          <div className={`px-6 py-3 rounded-2xl text-sm ${isDark ? 'glass-dark' : 'glass-light'} flex items-center gap-2`}>
            <span className="text-gold-gradient font-bold">{t('devBy')}</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
