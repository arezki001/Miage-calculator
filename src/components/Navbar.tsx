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

const LANG_FLAGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ar', flag: '🇸🇦', label: 'AR' },
]

/* ── Help content ───────────────────────────────────────────────── */

interface HelpSection {
  icon: string
  title: string
  items: string[]
}

interface HelpData {
  title: string
  sections: HelpSection[]
}

function getHelpData(lang: Lang): HelpData {
  if (lang === 'en') {
    return {
      title: 'User Guide',
      sections: [
        {
          icon: '📖',
          title: 'How to use the app',
          items: [
            'Select a semester tab (S1 to S6) to enter your course grades.',
            'For each course, enter your Exam grade — and TD / Lab grades if applicable.',
            'The final course grade is calculated automatically from the entered grades.',
            'The semester average appears at the bottom of the page.',
            'In the L1, L2, L3 and Degree tabs, manually type each semester average.',
          ],
        },
        {
          icon: '🧮',
          title: 'Grade calculation',
          items: [
            'Exam only → grade = Exam (100 %)',
            'Exam + Tutorial → grade = Exam × 60 % + Tutorial × 40 %',
            'Exam + Lab → grade = Exam × 60 % + Lab × 40 %',
            'Exam + Tutorial + Lab → grade = Exam × 60 % + Tutorial × 20 % + Lab × 20 %',
            'Click the pencil icon ✎ on any course to customize these percentages.',
          ],
        },
        {
          icon: '📊',
          title: 'Semester average',
          items: [
            'Average = Σ(grade × coefficient) ÷ Σ(coefficients)',
            'Only courses where all required grades are entered are counted.',
          ],
        },
        {
          icon: '🎓',
          title: 'L1 / L2 / L3 / Degree',
          items: [
            'In the L1, L2, L3 and Degree tabs, enter your semester averages manually.',
            'L1 = (S1 + S2) ÷ 2',
            'L2 = (S3 + S4) ÷ 2',
            'L3 = (S5 + S6) ÷ 2',
            'Degree = (S1 + S2 + S3 + S4 + S5 + S6) ÷ 6',
          ],
        },
        {
          icon: '✅',
          title: 'PASSED / FAILED',
          items: [
            'A course is PASSED if its grade ≥ 10 / 20.',
            'A semester is PASSED if its average ≥ 10 / 20.',
            'L1, L2 or L3 is PASSED if the year average ≥ 10 / 20.',
            'The Degree is PASSED if the overall average ≥ 10 / 20.',
          ],
        },
      ],
    }
  }

  if (lang === 'ar') {
    return {
      title: 'دليل الاستخدام',
      sections: [
        {
          icon: '📖',
          title: 'كيفية استخدام التطبيق',
          items: [
            'اختر فصلاً دراسياً (من ف1 إلى ف6) لإدخال درجات مواده.',
            'لكل مادة، أدخل درجة الامتحان — وأعمال موجهة / تطبيقية إن وُجدت.',
            'تُحسب الدرجة النهائية للمادة تلقائياً من الدرجات المُدخلة.',
            'يظهر معدل الفصل في أسفل الصفحة.',
            'في أبواب س1، س2، س3 والليسانس، أدخل يدوياً معدل كل فصل.',
          ],
        },
        {
          icon: '🧮',
          title: 'حساب الدرجات',
          items: [
            'الامتحان فقط ← الدرجة = الامتحان (100٪)',
            'الامتحان + أعمال موجهة ← الدرجة = الامتحان × 60٪ + أ.م × 40٪',
            'الامتحان + أعمال تطبيقية ← الدرجة = الامتحان × 60٪ + أ.ت × 40٪',
            'الامتحان + أ.م + أ.ت ← الدرجة = الامتحان × 60٪ + أ.م × 20٪ + أ.ت × 20٪',
            'انقر أيقونة القلم ✎ على أي مادة لتخصيص هذه النسب.',
          ],
        },
        {
          icon: '📊',
          title: 'معدل الفصل',
          items: [
            'المعدل = مجموع(الدرجة × المعامل) ÷ مجموع(المعاملات)',
            'تُحتسب فقط المواد التي أُدخلت جميع درجاتها المطلوبة.',
          ],
        },
        {
          icon: '🎓',
          title: 'س1 / س2 / س3 / الليسانس',
          items: [
            'في أبواب س1، س2، س3 والليسانس، أدخل معدلات فصولك يدوياً.',
            'السنة الأولى = (ف1 + ف2) ÷ 2',
            'السنة الثانية = (ف3 + ف4) ÷ 2',
            'السنة الثالثة = (ف5 + ف6) ÷ 2',
            'الليسانس = (ف1 + ف2 + ف3 + ف4 + ف5 + ف6) ÷ 6',
          ],
        },
        {
          icon: '✅',
          title: 'ناجح / راسب',
          items: [
            'مادة ناجحة إذا كانت درجتها ≥ 10/20.',
            'فصل ناجح إذا كان معدله ≥ 10/20.',
            'السنة (س1، س2، س3) ناجحة إذا كان معدلها ≥ 10/20.',
            'الليسانس ناجح إذا كان المعدل العام ≥ 10/20.',
          ],
        },
      ],
    }
  }

  // French (default)
  return {
    title: "Guide d'utilisation",
    sections: [
      {
        icon: '📖',
        title: "Comment utiliser l'application",
        items: [
          'Sélectionnez un onglet semestre (S1 à S6) pour saisir les notes de ses matières.',
          "Pour chaque matière, entrez la note d'examen — et TD / TP si applicable.",
          'La note finale de la matière est calculée automatiquement.',
          'La moyenne du semestre apparaît en bas de page.',
          'Dans les onglets L1, L2, L3 et Licence, saisissez manuellement la moyenne de chaque semestre.',
        ],
      },
      {
        icon: '🧮',
        title: 'Calcul des notes',
        items: [
          'Examen seul → note = Examen (100 %)',
          'Examen + TD → note = Examen × 60 % + TD × 40 %',
          'Examen + TP → note = Examen × 60 % + TP × 40 %',
          'Examen + TD + TP → note = Examen × 60 % + TD × 20 % + TP × 20 %',
          "Cliquez l'icône crayon ✎ d'une matière pour personnaliser ces pourcentages.",
        ],
      },
      {
        icon: '📊',
        title: 'Moyenne du semestre',
        items: [
          'Moyenne = Σ(note × coefficient) ÷ Σ(coefficients)',
          'Seules les matières avec toutes les notes requises saisies sont comptabilisées.',
        ],
      },
      {
        icon: '🎓',
        title: 'L1 / L2 / L3 / Licence',
        items: [
          'Dans les onglets L1, L2, L3 et Licence, saisissez manuellement vos moyennes de semestres.',
          'L1 = (S1 + S2) ÷ 2',
          'L2 = (S3 + S4) ÷ 2',
          'L3 = (S5 + S6) ÷ 2',
          'Licence = (S1 + S2 + S3 + S4 + S5 + S6) ÷ 6',
        ],
      },
      {
        icon: '✅',
        title: 'VALIDÉ / NON VALIDÉ',
        items: [
          'Une matière est VALIDÉE si sa note ≥ 10 / 20.',
          'Un semestre est VALIDÉ si sa moyenne ≥ 10 / 20.',
          'L1, L2 ou L3 est VALIDÉE si la moyenne annuelle ≥ 10 / 20.',
          'La Licence est VALIDÉE si la moyenne générale ≥ 10 / 20.',
        ],
      },
    ],
  }
}

/* ── HelpModal ──────────────────────────────────────────────────── */

function HelpModal({ lang, isDark, onClose }: { lang: Lang; isDark: boolean; onClose: () => void }) {
  const help = getHelpData(lang)

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-black/8'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-black/8'
        }`}>
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-yellow-500" />
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {help.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {help.sections.map((sec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl p-4 ${
                isDark ? 'bg-white/[0.04] border border-white/8' : 'bg-slate-50 border border-black/6'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{sec.icon}</span>
                <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  {sec.title}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {sec.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-1 text-yellow-500 flex-shrink-0 text-xs">●</span>
                    <span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {item}
                    </span>
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
  const textBase = isDark ? 'text-slate-200' : 'text-slate-700'
  const tabBase = `relative px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none`
  const tabActive = isDark ? 'text-yellow-400 bg-yellow-500/10' : 'text-yellow-600 bg-yellow-500/15'
  const tabInactive = isDark
    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
    : 'text-slate-500 hover:text-slate-700 hover:bg-black/5'

  function tabLabel(tab: string): string {
    return t(tab as any) || tab.toUpperCase()
  }

  function handleResetAll() {
    if (!confirmReset) { setConfirmReset(true); return }
    onResetAll()
    setConfirmReset(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 ${glass} shadow-lg`}
        style={{ borderBottom: isDark ? '1px solid rgba(124,58,237,0.18)' : '1px solid rgba(124,58,237,0.12)' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-sm md:text-base text-gold-gradient whitespace-nowrap">
              {t('appName')}
            </span>
          </div>

          {/* Tabs – scrollable */}
          <nav className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 min-w-max mx-auto px-2">
              {SEM_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`${tabBase} ${activeTab === tab ? tabActive : tabInactive}`}
                >
                  {tabLabel(tab)}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-yellow-400"
                    />
                  )}
                </button>
              ))}

              <div className={`w-px h-5 mx-1 ${isDark ? 'bg-white/15' : 'bg-black/10'}`} />

              {YEAR_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`${tabBase} ${activeTab === tab ? tabActive : tabInactive}`}
                >
                  {tabLabel(tab)}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-yellow-400"
                    />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Language switcher */}
            <div className="flex items-center gap-0.5 rounded-lg overflow-hidden border border-white/10">
              {LANG_FLAGS.map(({ code, flag, label }) => (
                <button
                  key={code}
                  onClick={() => onLangChange(code)}
                  title={label}
                  className={`px-2 py-1 text-xs font-semibold transition-all ${
                    lang === code
                      ? isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-500/25 text-yellow-600'
                      : isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-black/5'
                  }`}
                >
                  <span className="mr-0.5">{flag}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Help button */}
            <button
              onClick={() => setShowHelp(true)}
              title={t('helpBtn')}
              className={`p-2 rounded-lg transition-all font-bold ${
                isDark
                  ? 'text-yellow-400 hover:bg-yellow-500/10'
                  : 'text-yellow-600 hover:bg-yellow-500/10'
              }`}
            >
              <HelpCircle size={16} />
            </button>

            {/* Theme toggle */}
            <button
              onClick={onToggleDark}
              title={isDark ? t('lightMode') : t('darkMode')}
              className={`p-2 rounded-lg transition-all ${
                isDark ? 'text-slate-300 hover:bg-white/8' : 'text-slate-600 hover:bg-black/5'
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Reset all */}
            <AnimatePresence mode="wait">
              {confirmReset ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1"
                >
                  <span className={`text-xs ${textBase}`}>{t('resetAllConfirm')}</span>
                  <button
                    onClick={handleResetAll}
                    className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold transition-colors"
                  >✓</button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className={`px-2 py-1 text-xs rounded-md font-semibold transition-colors ${
                      isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'
                    }`}
                  >✕</button>
                </motion.div>
              ) : (
                <motion.button
                  key="reset"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleResetAll}
                  title={t('resetAll')}
                  className={`p-2 rounded-lg transition-all ${
                    isDark
                      ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                      : 'text-slate-500 hover:text-red-500 hover:bg-red-500/10'
                  }`}
                >
                  <RotateCcw size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Help modal */}
      <AnimatePresence>
        {showHelp && (
          <HelpModal lang={lang} isDark={isDark} onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
