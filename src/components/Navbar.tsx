import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, RotateCcw, HelpCircle, X } from 'lucide-react'
import type { Lang } from '../data/courses'

interface NavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  lang: Lang
  onLangChange: (lang: Lang) => void
  isDark: boolean
  onToggleDark: () => void
  onResetAll: () => void
}

const SEM_TABS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const
const YEAR_TABS = ['l1', 'l2', 'l3', 'licence'] as const
const ALL_TABS = [...SEM_TABS, ...YEAR_TABS]

const LANG_FLAGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ar', flag: '🇸🇦', label: 'AR' },
]

const GROUP_LABELS: Record<Lang, { sem: string; year: string }> = {
  fr: { sem: 'Semestres', year: 'Années' },
  en: { sem: 'Semesters', year: 'Years' },
  ar: { sem: 'الفصول', year: 'السنوات' },
}

/* ── Help content ───────────────────────────────────────────────── */

interface HelpSection { icon: string; title: string; items: string[] }
interface HelpData { title: string; sections: HelpSection[] }

function getHelpData(lang: Lang): HelpData {
  if (lang === 'en') {
    return {
      title: 'User Guide',
      sections: [
        { icon: '📖', title: 'How to use the app', items: [
          'Select a semester (S1–S6) to enter course grades.',
          'Enter your Exam grade — and TD / Lab grades if applicable.',
          'The final grade is calculated automatically.',
          'The semester average appears at the bottom.',
          'In L1, L2, L3 and Degree tabs, type each semester average manually.',
        ]},
        { icon: '🧮', title: 'Grade calculation', items: [
          'Exam only → grade = Exam (100 %)',
          'Exam + Tutorial → Exam × 60 % + Tutorial × 40 %',
          'Exam + Lab → Exam × 60 % + Lab × 40 %',
          'Exam + Tutorial + Lab → Exam × 60 % + Tutorial × 20 % + Lab × 20 %',
          'Click the orange % button to customize percentages.',
        ]},
        { icon: '📊', title: 'Semester average', items: [
          'Average = Σ(grade × coefficient) ÷ Σ(coefficients)',
          'Only courses with all required grades entered are counted.',
        ]},
        { icon: '🎓', title: 'L1 / L2 / L3 / Degree', items: [
          'L1 = (S1 + S2) ÷ 2',
          'L2 = (S3 + S4) ÷ 2',
          'L3 = (S5 + S6) ÷ 2',
          'Degree = (S1 + S2 + S3 + S4 + S5 + S6) ÷ 6',
        ]},
        { icon: '✅', title: 'PASSED / FAILED', items: [
          'A course is PASSED if grade ≥ 10 / 20.',
          'A semester is PASSED if average ≥ 10 / 20.',
          'L1, L2, L3 PASSED if year average ≥ 10 / 20.',
          'Degree PASSED if overall average ≥ 10 / 20.',
        ]},
      ],
    }
  }
  if (lang === 'ar') {
    return {
      title: 'دليل الاستخدام',
      sections: [
        { icon: '📖', title: 'كيفية الاستخدام', items: [
          'اختر فصلاً (من ف1 إلى ف6) لإدخال درجات مواده.',
          'أدخل درجة الامتحان — وأعمال موجهة / تطبيقية إن وُجدت.',
          'تُحسب الدرجة النهائية تلقائياً.',
          'يظهر معدل الفصل في أسفل الصفحة.',
          'في أبواب س1، س2، س3 والليسانس، أدخل معدل كل فصل يدوياً.',
        ]},
        { icon: '🧮', title: 'حساب الدرجات', items: [
          'الامتحان فقط ← الدرجة = الامتحان (100٪)',
          'الامتحان + أ.م ← الامتحان × 60٪ + أ.م × 40٪',
          'الامتحان + أ.ت ← الامتحان × 60٪ + أ.ت × 40٪',
          'الامتحان + أ.م + أ.ت ← الامتحان × 60٪ + أ.م × 20٪ + أ.ت × 20٪',
          'انقر زر % البرتقالي لتخصيص النسب.',
        ]},
        { icon: '📊', title: 'معدل الفصل', items: [
          'المعدل = مجموع(الدرجة × المعامل) ÷ مجموع(المعاملات)',
          'تُحتسب فقط المواد التي أُدخلت جميع درجاتها.',
        ]},
        { icon: '🎓', title: 'س1 / س2 / س3 / الليسانس', items: [
          'السنة الأولى = (ف1 + ف2) ÷ 2',
          'السنة الثانية = (ف3 + ف4) ÷ 2',
          'السنة الثالثة = (ف5 + ف6) ÷ 2',
          'الليسانس = (ف1 + ف2 + ف3 + ف4 + ف5 + ف6) ÷ 6',
        ]},
        { icon: '✅', title: 'ناجح / راسب', items: [
          'مادة ناجحة إذا كانت درجتها ≥ 10/20.',
          'فصل ناجح إذا كان معدله ≥ 10/20.',
          'السنة ناجحة إذا كان معدلها ≥ 10/20.',
          'الليسانس ناجح إذا كان المعدل العام ≥ 10/20.',
        ]},
      ],
    }
  }
  return {
    title: "Guide d'utilisation",
    sections: [
      { icon: '📖', title: "Comment utiliser l'application", items: [
        'Sélectionnez un semestre (S1–S6) pour saisir vos notes.',
        "Entrez la note d'examen — et TD / TP si applicable.",
        'La note finale est calculée automatiquement.',
        'La moyenne du semestre apparaît en bas de page.',
        'Dans les onglets L1, L2, L3 et Licence, saisissez manuellement les moyennes.',
      ]},
      { icon: '🧮', title: 'Calcul des notes', items: [
        'Examen seul → note = Examen (100 %)',
        'Examen + TD → Examen × 60 % + TD × 40 %',
        'Examen + TP → Examen × 60 % + TP × 40 %',
        'Examen + TD + TP → Examen × 60 % + TD × 20 % + TP × 20 %',
        "Cliquez le bouton % orange pour personnaliser les pourcentages.",
      ]},
      { icon: '📊', title: 'Moyenne du semestre', items: [
        'Moyenne = Σ(note × coefficient) ÷ Σ(coefficients)',
        'Seules les matières avec toutes les notes saisies sont comptabilisées.',
      ]},
      { icon: '🎓', title: 'L1 / L2 / L3 / Licence', items: [
        'L1 = (S1 + S2) ÷ 2',
        'L2 = (S3 + S4) ÷ 2',
        'L3 = (S5 + S6) ÷ 2',
        'Licence = (S1 + S2 + S3 + S4 + S5 + S6) ÷ 6',
      ]},
      { icon: '✅', title: 'VALIDÉ / NON VALIDÉ', items: [
        'Une matière est VALIDÉE si note ≥ 10 / 20.',
        'Un semestre est VALIDÉ si moyenne ≥ 10 / 20.',
        'L1, L2, L3 VALIDÉE si moyenne annuelle ≥ 10 / 20.',
        'Licence VALIDÉE si moyenne générale ≥ 10 / 20.',
      ]},
    ],
  }
}

/* ── HelpModal ──────────────────────────────────────────────────── */

function HelpModal({ lang, isDark, onClose }: { lang: Lang; isDark: boolean; onClose: () => void }) {
  const help = getHelpData(lang)
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className={`relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-black/8'
        }`}
      >
        <div className={`sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b ${
          isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-black/8'
        }`}>
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-yellow-500" />
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {help.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`p-2 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'
            }`}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {help.sections.map((sec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className={`rounded-xl p-4 ${
                isDark ? 'bg-white/[0.04] border border-white/8' : 'bg-slate-50 border border-black/6'
              }`}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-lg">{sec.icon}</span>
                <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{sec.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {sec.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-1 text-yellow-500 flex-shrink-0 text-[10px]">●</span>
                    <span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Navbar ─────────────────────────────────────────────────────── */

export default function Navbar({
  activeTab, onTabChange, lang, onLangChange, isDark, onToggleDark, onResetAll,
}: NavbarProps) {
  const { t } = useTranslation()
  const [confirmReset, setConfirmReset] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const glass = isDark ? 'glass-dark' : 'glass-light'
  const tabBase = `relative px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none min-h-[36px] flex items-center`
  const tabActive = isDark ? 'text-yellow-400 bg-yellow-500/10' : 'text-yellow-600 bg-yellow-500/15'
  const tabInactive = isDark
    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
    : 'text-slate-500 hover:text-slate-700 hover:bg-black/5'

  const tabLabel = (tab: string) => t(tab as any) || tab.toUpperCase()

  function handleResetAll() {
    if (!confirmReset) { setConfirmReset(true); return }
    onResetAll()
    setConfirmReset(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 ${glass} shadow-lg`}
        style={{ borderBottom: isDark ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(124,58,237,0.14)' }}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 h-16 flex items-center gap-2 md:gap-3">

          {/* Logo */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xl md:text-2xl">🎓</span>
            <span className="font-bold text-xs md:text-sm text-gold-gradient whitespace-nowrap hidden sm:block">
              {t('appName')}
            </span>
          </div>

          {/* MOBILE: compact tab selector */}
          <div className="flex-1 md:hidden flex justify-center">
            <select
              value={activeTab}
              onChange={e => onTabChange(e.target.value)}
              aria-label="Select tab"
              className={`text-sm font-semibold rounded-xl px-3 py-2 outline-none border-2 w-full max-w-[180px] min-h-[40px] transition-colors ${
                isDark
                  ? 'bg-slate-800/80 border-yellow-500/35 text-yellow-400'
                  : 'bg-white/80 border-yellow-500/50 text-yellow-600'
              }`}
            >
              <optgroup label={GROUP_LABELS[lang].sem}>
                {SEM_TABS.map(tab => (
                  <option key={tab} value={tab}>{tabLabel(tab)}</option>
                ))}
              </optgroup>
              <optgroup label={GROUP_LABELS[lang].year}>
                {YEAR_TABS.map(tab => (
                  <option key={tab} value={tab}>{tabLabel(tab)}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* DESKTOP: scrollable tab bar */}
          <nav className="hidden md:flex flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 min-w-max px-1">
              {SEM_TABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange(tab)}
                  className={`${tabBase} ${activeTab === tab ? tabActive : tabInactive}`}
                >
                  {tabLabel(tab)}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute bottom-0.5 left-1.5 right-1.5 h-0.5 rounded-full bg-yellow-400"
                    />
                  )}
                </button>
              ))}

              <div className={`w-px h-5 mx-1 flex-shrink-0 ${isDark ? 'bg-white/15' : 'bg-black/10'}`} />

              {YEAR_TABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange(tab)}
                  className={`${tabBase} ${activeTab === tab ? tabActive : tabInactive}`}
                >
                  {tabLabel(tab)}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute bottom-0.5 left-1.5 right-1.5 h-0.5 rounded-full bg-yellow-400"
                    />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Language switcher */}
            <div className={`flex items-center rounded-lg overflow-hidden border ${isDark ? 'border-white/12' : 'border-black/10'}`}>
              {LANG_FLAGS.map(({ code, flag, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onLangChange(code)}
                  title={label}
                  className={`px-2 py-1.5 text-xs font-semibold transition-all min-h-[36px] min-w-[32px] ${
                    lang === code
                      ? isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-500/25 text-yellow-600'
                      : isDark ? 'text-slate-400 hover:bg-white/8' : 'text-slate-500 hover:bg-black/5'
                  }`}
                >
                  <span>{flag}</span>
                  <span className="hidden sm:inline ml-0.5">{label}</span>
                </button>
              ))}
            </div>

            {/* Help button */}
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              title={t('helpBtn')}
              aria-label={t('helpBtn')}
              className={`p-2 rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isDark ? 'text-yellow-400 hover:bg-yellow-500/12' : 'text-yellow-600 hover:bg-yellow-500/10'
              }`}
            >
              <HelpCircle size={17} />
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={onToggleDark}
              title={isDark ? t('lightMode') : t('darkMode')}
              aria-label={isDark ? t('lightMode') : t('darkMode')}
              className={`p-2 rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isDark ? 'text-slate-300 hover:bg-white/8' : 'text-slate-600 hover:bg-black/5'
              }`}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Reset all */}
            <AnimatePresence mode="wait">
              {confirmReset ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-2.5 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors min-h-[36px]"
                  >✓</button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg font-bold min-h-[36px] transition-colors ${
                      isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'
                    }`}
                  >✕</button>
                </motion.div>
              ) : (
                <motion.button
                  key="reset"
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleResetAll}
                  title={t('resetAll')}
                  aria-label={t('resetAll')}
                  className={`p-2 rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                    isDark
                      ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                      : 'text-slate-500 hover:text-red-500 hover:bg-red-500/10'
                  }`}
                >
                  <RotateCcw size={17} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE: active tab indicator strip */}
        <div className="md:hidden flex overflow-x-auto no-scrollbar border-t border-white/5 px-3 py-1.5 gap-1.5">
          {ALL_TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all ${
                activeTab === tab
                  ? 'bg-yellow-500 text-black'
                  : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tabLabel(tab)}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence>
        {showHelp && (
          <HelpModal lang={lang} isDark={isDark} onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
