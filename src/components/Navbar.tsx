import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, RotateCcw } from 'lucide-react'
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

export default function Navbar({
  activeTab,
  onTabChange,
  lang,
  onLangChange,
  isDark,
  onToggleDark,
  onResetAll,
}: NavbarProps) {
  const { t } = useTranslation()
  const [confirmReset, setConfirmReset] = useState(false)

  const glass = isDark ? 'glass-dark' : 'glass-light'
  const textBase = isDark ? 'text-slate-200' : 'text-slate-700'
  const tabBase = `relative px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none`
  const tabActive = isDark
    ? 'text-yellow-400 bg-yellow-500/10'
    : 'text-yellow-600 bg-yellow-500/15'
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
            {/* Semester tabs */}
            <div className="flex items-center gap-1">
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
            </div>

            {/* Divider */}
            <div className={`w-px h-5 mx-1 ${isDark ? 'bg-white/15' : 'bg-black/10'}`} />

            {/* Year / Licence tabs */}
            <div className="flex items-center gap-1">
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
          </div>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language switcher */}
          <div className="flex items-center gap-0.5 rounded-lg overflow-hidden border border-white/10">
            {LANG_FLAGS.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => onLangChange(code)}
                title={label}
                className={`px-2 py-1 text-xs font-semibold transition-all ${
                  lang === code
                    ? isDark
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-yellow-500/25 text-yellow-600'
                    : isDark
                    ? 'text-slate-400 hover:bg-white/5'
                    : 'text-slate-500 hover:bg-black/5'
                }`}
              >
                <span className="mr-0.5">{flag}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleDark}
            title={isDark ? t('lightMode') : t('darkMode')}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? 'text-yellow-400 hover:bg-yellow-500/10'
                : 'text-slate-600 hover:bg-black/5'
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
                >
                  ✓
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className={`px-2 py-1 text-xs rounded-md font-semibold transition-colors ${
                    isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'
                  }`}
                >
                  ✕
                </button>
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
  )
}
