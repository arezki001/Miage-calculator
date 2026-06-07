import React from 'react'
import ReactDOM from 'react-dom/client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import App from './App'
import './index.css'

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    en: {
      translation: {
        appName: 'MIAGE Calculator',
        semester: 'Semester',
        s1: 'S1', s2: 'S2', s3: 'S3', s4: 'S4', s5: 'S5', s6: 'S6',
        l1: 'L1', l2: 'L2', l3: 'L3',
        licence: 'Degree',
        exam: 'Exam', td: 'Tutorial', tp: 'Lab',
        validated: 'PASSED',
        notValidated: 'FAILED',
        semesterValidated: 'SEMESTER PASSED',
        semesterNotValidated: 'SEMESTER FAILED',
        yearValidated: 'YEAR PASSED',
        yearNotValidated: 'YEAR FAILED',
        licenceValidated: 'DEGREE PASSED',
        licenceNotValidated: 'DEGREE FAILED',
        average: 'Average',
        credits: 'Credits',
        creditsEarned: 'Credits earned',
        totalCredits: 'Total credits',
        coefficient: 'Coeff.',
        course: 'Course',
        grade: 'Grade',
        status: 'Status',
        reset: 'Reset',
        resetAll: 'Reset all',
        resetConfirm: 'Reset this semester?',
        resetAllConfirm: 'Reset all grades?',
        simulatorTitle: 'Grade Simulator',
        simulatorQuestion: 'What exam score do I need to pass?',
        neededScore: 'Required exam score',
        impossible: 'Impossible (> 20)',
        alreadyPassed: 'Already passing (Tutorial/Lab)',
        noGrades: 'No grades entered for this semester',
        selectCourse: 'Select a course...',
        enterTd: 'Tutorial grade',
        enterTp: 'Lab grade',
        customPerc: 'Customize',
        percSum: 'Must sum to 100 %',
        apply: 'Apply',
        cancel: 'Cancel',
        l1Avg: 'L1 Average',
        l2Avg: 'L2 Average',
        l3Avg: 'L3 Average',
        licenceAvg: 'Degree Average',
        yearAvg: 'Year average',
        semSummary: 'Semester summary',
        licenceSummary: 'Degree summary',
        darkMode: 'Dark mode',
        lightMode: 'Light mode',
        editPerc: 'Edit %',
        helpBtn: 'Help',
        semAvgLabel: 'Average',
        enterSemAvg: 'Enter average...',
        manualNote: 'Enter your semester averages below',
        devBy: 'Developed by A-CH',
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
