import React, { useState, useEffect } from 'react';
import { Calculator, Languages, RefreshCcw, BookOpen, GraduationCap, FlaskConical, Trophy, AlertCircle, HelpCircle, Settings, X, CheckCircle } from 'lucide-react';

// جميع مواد MIAGE
const MIAGE_MODULES = {
  L1_S1: [
    { id: '1', nameAr: 'تحليل ومنطق رياضي', nameEn: 'Analysis and Mathematical Logic', coeff: 3 },
    { id: '2', nameAr: 'مقدمة في الاحتمالات والإحصاء الوصفي', nameEn: 'Introduction to Probabilities and Descriptive Statistics', coeff: 2 },
    { id: '3', nameAr: 'هيكلة الآلة وإدارة أنظمة التشغيل', nameEn: 'Machine Structure and OS Administration', coeff: 2 },
    { id: '4', nameAr: 'برمجة 1', nameEn: 'Programming 1', coeff: 3 },
    { id: '5', nameAr: 'مقدمة في العلوم الاقتصادية', nameEn: 'Introduction to Economic Sciences', coeff: 2 },
    { id: '6', nameAr: 'مقدمة في العلوم الإنسانية والاجتماعية 1', nameEn: 'Introduction to Human and Social Sciences 1', coeff: 2 },
    { id: '7', nameAr: 'عمل جامعي 1', nameEn: 'University Work 1', coeff: 2 },
    { id: '8', nameAr: 'أخلاقيات المهنة', nameEn: 'Professional Ethics', coeff: 1 },
    { id: '9', nameAr: 'لغة إنجليزية 1', nameEn: 'English 1', coeff: 1 }
  ],
  L1_S2: [
    { id: '10', nameAr: 'مقدمة في الذكاء الاصطناعي', nameEn: 'Introduction to Artificial Intelligence', coeff: 3 },
    { id: '11', nameAr: 'برمجة 2', nameEn: 'Programming 2', coeff: 3 },
    { id: '12', nameAr: 'مقدمة في النظريات الاقتصادية', nameEn: 'Introduction to Economic Theories', coeff: 2 },
    { id: '13', nameAr: 'مقدمة في العلوم الإنسانية والاجتماعية 2', nameEn: 'Introduction to Human and Social Sciences 2', coeff: 2 },
    { id: '14', nameAr: 'عمل جامعي 2', nameEn: 'University Work 2', coeff: 2 },
    { id: '15', nameAr: 'جبر خطي', nameEn: 'Linear Algebra', coeff: 3 },
    { id: '16', nameAr: 'ريادة الأعمال وإدارة المؤسسة', nameEn: 'Entrepreneurship and Business Management', coeff: 2 },
    { id: '17', nameAr: 'مقدمة في القانون', nameEn: 'Introduction to Law', coeff: 1 },
    { id: '18', nameAr: 'لغة إنجليزية 2', nameEn: 'English 2', coeff: 1}
  ],
  L2_S3: [
    { id: '19', nameAr: 'نظم المعلومات', nameEn: 'Information Systems', coeff: 2 },
    { id: '20', nameAr: 'برمجة متقدمة', nameEn: 'Advanced Programming', coeff: 3 },
    { id: '21', nameAr: 'اقتصاد جزئي', nameEn: 'Microeconomics', coeff: 3 },
    { id: '22', nameAr: 'محاسبة مالية', nameEn: 'Financial Accounting', coeff: 2 },
    { id: '23', nameAr: 'مقدمة في الإدارة', nameEn: 'Introduction to Management', coeff: 2 },
    { id: '24', nameAr: 'مالية عامة', nameEn: 'Public Finance', coeff: 2 },
    { id: '25', nameAr: 'تحليل بيانات 1', nameEn: 'Data Analysis 1', coeff: 2 },
    { id: '26', nameAr: 'قانون تجاري', nameEn: 'Commercial Law', coeff: 1 },
    { id: '27', nameAr: 'لغة إنجليزية 3', nameEn: 'English 3', coeff: 1 }
  ],
  L2_S4: [
    { id: '28', nameAr: 'شبكات وتقنيات الويب', nameEn: 'Networks and Web Technologies', coeff: 2 },
    { id: '29', nameAr: 'قواعد البيانات', nameEn: 'Databases', coeff: 3 },
    { id: '30', nameAr: 'اقتصاد كلي', nameEn: 'Macroeconomics', coeff: 3 },
    { id: '31', nameAr: 'مقدمة إلى محاسبة التكاليف', nameEn: 'Introduction to Cost Accounting', coeff: 2 },
    { id: '32', nameAr: 'تحليل بيانات 2', nameEn: 'Data Analysis 2', coeff: 2 },
    { id: '33', nameAr: 'رياضيات مالية', nameEn: 'Financial Mathematics', coeff: 2 },
    { id: '34', nameAr: 'مقدمة في التسويق', nameEn: 'Introduction to Marketing', coeff: 2 },
    { id: '35', nameAr: 'لغة إنجليزية 4', nameEn: 'English 4', coeff: 2 },
    { id: '36', nameAr: 'نظم المعلومات للمؤسسات', nameEn: 'Enterprise Information Systems', coeff: 2 }
  ]
};

function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [level, setLevel] = useState<'L1' | 'L2'>('L1');
  const [semester, setSemester] = useState<'S1' | 'S2' | 'S3' | 'S4'>('S1');
  
  const [grades, setGrades] = useState<Record<string, { exam: string; td: string; tp: string }>>({});
  const [checks, setChecks] = useState<Record<string, { exam: boolean; td: boolean; tp: boolean }>>({});
  const [customExamPercentage, setCustomExamPercentage] = useState<Record<string, number | null>>({});
  
  const [showCustomModal, setShowCustomModal] = useState<string | null>(null);
  const [tempCustomPercentage, setTempCustomPercentage] = useState<number>(50);
  const [showHelp, setShowHelp] = useState(false);
  
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [calculatedAverage, setCalculatedAverage] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [moduleAverages, setModuleAverages] = useState<Record<string, number>>({});

  // تهيئة Checkboxes
  useEffect(() => {
    const modules = getCurrentModules();
    const initialChecks: Record<string, { exam: boolean; td: boolean; tp: boolean }> = {};
    modules.forEach(module => {
      initialChecks[module.id] = {
        exam: true,
        td: false,
        tp: false
      };
    });
    setChecks(initialChecks);
    setGrades({});
    setCustomExamPercentage({});
    setCalculationError(null);
    setCalculatedAverage(null);
    setIsCalculated(false);
    setModuleAverages({});
  }, [level, semester]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const getCurrentModules = () => {
    const key = `${level}_${semester}` as keyof typeof MIAGE_MODULES;
    return MIAGE_MODULES[key] || [];
  };

  const modules = getCurrentModules();

  const handleGradeChange = (moduleId: string, type: 'exam' | 'td' | 'tp', value: string) => {
    let numValue = parseFloat(value);
    
    if (!isNaN(numValue) && numValue > 20) {
      numValue = 20;
    }
    
    if (!isNaN(numValue) && numValue < 0) {
      numValue = 0;
    }
    
    const finalValue = isNaN(numValue) ? '' : numValue.toString();
    
    setGrades(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [type]: finalValue
      }
    }));
  };

  const handleCheckChange = (moduleId: string, type: 'exam' | 'td' | 'tp', checked: boolean) => {
    if (type === 'exam') {
      setChecks(prev => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          exam: true
        }
      }));
      return;
    }
    
    setChecks(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [type]: checked
      }
    }));
  };

  const calculatePercentages = (moduleId: string, hasExam: boolean, hasTD: boolean, hasTP: boolean) => {
    if (customExamPercentage[moduleId] !== null && customExamPercentage[moduleId] !== undefined) {
      const examPercent = customExamPercentage[moduleId]!;
      const remaining = 100 - examPercent;
      
      if (hasTD && hasTP) {
        return { exam: examPercent, td: remaining / 2, tp: remaining / 2 };
      } else if (hasTD && !hasTP) {
        return { exam: examPercent, td: remaining, tp: 0 };
      } else if (!hasTD && hasTP) {
        return { exam: examPercent, td: 0, tp: remaining };
      } else {
        return { exam: examPercent, td: 0, tp: 0 };
      }
    }

    if (level === 'L1') {
      if (!hasTD && !hasTP && hasExam) {
        return { exam: 100, td: 0, tp: 0 };
      } else if (hasTD && hasTP && hasExam) {
        return { exam: 50, td: 25, tp: 25 };
      } else if (hasTD && !hasTP && hasExam) {
        return { exam: 50, td: 50, tp: 0 };
      } else if (!hasTD && hasTP && hasExam) {
        return { exam: 50, td: 0, tp: 50 };
      }
    } else {
      if (!hasTD && !hasTP && hasExam) {
        return { exam: 60, td: 0, tp: 0 };
      } else if (hasTD && hasTP && hasExam) {
        return { exam: 60, td: 20, tp: 20 };
      } else if (hasTD && !hasTP && hasExam) {
        return { exam: 60, td: 40, tp: 0 };
      } else if (!hasTD && hasTP && hasExam) {
        return { exam: 60, td: 0, tp: 40 };
      }
    }
    
    return { exam: 0, td: 0, tp: 0 };
  };

  const calculateModuleAverage = (moduleId: string): number => {
    const moduleGrades = grades[moduleId];
    const moduleChecks = checks[moduleId];
    
    if (!moduleGrades || !moduleChecks) return 0;

    const exam = parseFloat(moduleGrades.exam) || 0;
    const td = parseFloat(moduleGrades.td) || 0;
    const tp = parseFloat(moduleGrades.tp) || 0;
    
    const percentages = calculatePercentages(
      moduleId,
      moduleChecks.exam,
      moduleChecks.td,
      moduleChecks.tp
    );

    const examValue = exam * (percentages.exam / 100);
    const tdValue = td * (percentages.td / 100);
    const tpValue = tp * (percentages.tp / 100);

    return examValue + tdValue + tpValue;
  };

  const calculateGeneralAverage = (): number => {
    let totalPoints = 0;
    let totalCoeff = 0;

    modules.forEach(module => {
      const moduleAverage = calculateModuleAverage(module.id);
      if (moduleAverage > 0) {
        totalPoints += moduleAverage * module.coeff;
        totalCoeff += module.coeff;
      }
    });

    return totalCoeff > 0 ? totalPoints / totalCoeff : 0;
  };

  const resetAll = () => {
    setGrades({});
    const modules = getCurrentModules();
    const initialChecks: Record<string, { exam: boolean; td: boolean; tp: boolean }> = {};
    modules.forEach(module => {
      initialChecks[module.id] = {
        exam: true,
        td: false,
        tp: false
      };
    });
    setChecks(initialChecks);
    setCustomExamPercentage({});
    setCalculationError(null);
    setCalculatedAverage(null);
    setIsCalculated(false);
    setModuleAverages({});
  };

  const openCustomModal = (moduleId: string) => {
    setTempCustomPercentage(customExamPercentage[moduleId] || 50);
    setShowCustomModal(moduleId);
  };

  const saveCustomPercentage = () => {
    if (showCustomModal) {
      setCustomExamPercentage(prev => ({
        ...prev,
        [showCustomModal]: tempCustomPercentage
      }));
      setShowCustomModal(null);
    }
  };

  const removeCustomPercentage = (moduleId: string) => {
    setCustomExamPercentage(prev => {
      const newState = { ...prev };
      delete newState[moduleId];
      return newState;
    });
  };

  const calculateAverageWithValidation = () => {
    const missingModules = [];
    
    modules.forEach(module => {
      const moduleGrades = grades[module.id];
      const moduleChecks = checks[module.id];
      
      if (!moduleGrades || !moduleGrades.exam || moduleGrades.exam.trim() === '') {
        missingModules.push(module.id);
        return;
      }
      
      if (moduleChecks?.td && (!moduleGrades.td || moduleGrades.td.trim() === '')) {
        missingModules.push(module.id);
        return;
      }
      
      if (moduleChecks?.tp && (!moduleGrades.tp || moduleGrades.tp.trim() === '')) {
        missingModules.push(module.id);
        return;
      }
    });
    
    if (missingModules.length > 0) {
      setCalculationError(
        lang === 'en' 
          ? 'Please enter all missing marks before calculating the average'
          : 'الرجاء إدخال جميع الدرجات المفقودة قبل حساب المعدل'
      );
      setCalculatedAverage(null);
      setIsCalculated(false);
      setModuleAverages({});
      return;
    }
    
    // حساب معدلات المواد
    const newModuleAverages: Record<string, number> = {};
    modules.forEach(module => {
      newModuleAverages[module.id] = calculateModuleAverage(module.id);
    });
    setModuleAverages(newModuleAverages);
    
    // حساب المعدل العام
    const average = calculateGeneralAverage();
    setCalculatedAverage(average);
    setCalculationError(null);
    setIsCalculated(true);
  };

  const generalAverage = calculatedAverage !== null ? calculatedAverage : 0;
  const isPassing = generalAverage >= 10;

  const text = {
    title: lang === 'en' ? 'MIAGE Calculator' : 'حاسبة MIAGE',
    level: lang === 'en' ? 'Level' : 'المستوى',
    semester: lang === 'en' ? 'Semester' : 'الفصل',
    reset: lang === 'en' ? 'Reset All' : 'إعادة ضبط',
    modules: lang === 'en' ? 'Modules' : 'المقاييس',
    exam: lang === 'en' ? 'Exam' : 'امتحان',
    td: lang === 'en' ? 'TD' : 'ت.م',
    tp: lang === 'en' ? 'TP' : 'ت.ت',
    coeff: lang === 'en' ? 'Coeff' : 'المعامل',
    average: lang === 'en' ? 'Average' : 'المعدل',
    generalAverage: lang === 'en' ? 'General Average' : 'المعدل العام',
    enterGrade: lang === 'en' ? 'Enter grade (0-20)' : 'أدخل الدرجة (0-20)',
    status: lang === 'en' ? 'Status' : 'الحالة',
    passed: lang === 'en' ? 'Passed' : 'ناجح',
    failed: lang === 'en' ? 'Failed' : 'راسب',
    by: lang === 'en' ? 'Programmed by DevMaster' : 'مبرمج من قبل DevMaster',
    selectPercentage: lang === 'en' ? 'Select percentage' : 'اختر النسبة',
    totalPercent: lang === 'en' ? 'Total must be 100%' : 'المجموع يجب أن يكون 100%',
    customizePercentages: lang === 'en' ? 'Customize Percentages' : 'تخصيص النسب',
    specialCase: lang === 'en' ? 'Special Case' : 'حالة خاصة',
    customCase: lang === 'en' ? 'Set custom exam percentage' : 'تعيين نسبة مخصصة للامتحان',
    customExamPercentage: lang === 'en' ? 'Custom Exam Percentage' : 'نسبة امتحان مخصصة',
    setExamPercentage: lang === 'en' ? 'Set exam percentage' : 'تعيين نسبة الامتحان',
    customExamInfo: lang === 'en' 
      ? 'Set a custom percentage for the exam. The rest will be automatically distributed between TD and TP.' 
      : 'قم بتعيين نسبة مخصصة للامتحان. سيتم توزيع الباقي تلقائياً بين TD و TP.',
    resetToAuto: lang === 'en' ? 'Reset to auto' : 'إعادة للوضع التلقائي',
    save: lang === 'en' ? 'Save' : 'حفظ',
    cancel: lang === 'en' ? 'Cancel' : 'إلغاء',
    currentDistribution: lang === 'en' ? 'Current Distribution' : 'التوزيع الحالي',
    custom: lang === 'en' ? 'Custom' : 'مخصص',
    customDistributionApplied: lang === 'en' 
      ? 'Custom distribution applied' 
      : 'تم تطبيق توزيع مخصص',
    automaticDistribution: lang === 'en' 
      ? 'Automatic distribution based on selected elements' 
      : 'توزيع تلقائي بناءً على العناصر المحددة',
    selectElements: lang === 'en' ? 'Select existing elements' : 'اختر العناصر الموجودة',
    examRequired: lang === 'en' ? 'Exam is always required' : 'الامتحان مطلوب دائمًا',
    help: lang === 'en' ? 'Help' : 'مساعدة',
    helpTitle: lang === 'en' ? 'How to use the calculator' : 'كيفية استخدام الحاسبة',
    helpStepsTitle: lang === 'en' ? 'Steps:' : 'الخطوات:',
    helpStep1: lang === 'en' 
      ? '1. Select your level (L1 or L2) and semester.' 
      : '1. اختر المستوى (L1 أو L2) والفصل الدراسي.',
    helpStep2: lang === 'en' 
      ? '2. For each module, select which elements exist (TD, TP). Exam is always required.' 
      : '2. لكل مقياس، اختر العناصر الموجودة (TD، TP). الامتحان مطلوب دائماً.',
    helpStep3: lang === 'en' 
      ? '3. Enter your grades (0-20). The system automatically validates that grades don\'t exceed 20.' 
      : '3. أدخل درجاتك (0-20). النظام يتحقق تلقائياً أن الدرجات لا تتجاوز 20.',
    helpStep4: lang === 'en' 
      ? '4. For special cases, click the "Special Case" button to set custom exam percentages.' 
      : '4. للحالات الخاصة، اضغط على زر "حالة خاصة" لتعيين نسب مخصصة للامتحان.',
    helpStep5: lang === 'en' 
      ? '5. Click "Calculate Average" button after entering all grades.' 
      : '5. اضغط على زر "حساب المعدل" بعد إدخال جميع الدرجات.',
    helpNote: lang === 'en' 
      ? 'Note: The calculator automatically validates all grades before calculating the average.' 
      : 'ملاحظة: الحاسبة تتحقق من جميع الدرجات تلقائياً قبل حساب المعدل.',
    closeHelp: lang === 'en' ? 'Close Help' : 'إغلاق المساعدة',
    calculateAverage: lang === 'en' ? 'Calculate Average' : 'حساب المعدل',
    missingMarksWarning: lang === 'en' 
      ? 'Please enter all missing marks before calculating the average' 
      : 'الرجاء إدخال جميع الدرجات المفقودة قبل حساب المعدل',
    waitingForCalculation: lang === 'en' ? 'Waiting for calculation...' : 'بانتظار الحساب...',
    moduleAverage: lang === 'en' ? 'Module Average' : 'معدل المادة'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* الهيدر */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">{text.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-blue-300 transition-all flex items-center gap-2 font-medium"
              title={text.help}
            >
              <HelpCircle className="w-4 h-4" />
              {text.help}
            </button>
            <button 
              onClick={toggleLang}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-blue-300 transition-all flex items-center gap-2 font-medium"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* نافذة المساعدة */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">{text.helpTitle}</h2>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-5 rounded-xl">
                <h3 className="font-bold text-lg mb-3 text-blue-700">{text.helpStepsTitle}</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>{text.helpStep1}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>{text.helpStep2}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>{text.helpStep3}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>{text.helpStep4}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    <span>{text.helpStep5}</span>
                  </li>
                </ol>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-green-700 text-sm">
                  <span className="font-bold">{text.helpNote}</span>
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl">
                <p className="text-yellow-700 text-sm">
                  <span className="font-bold">{lang === 'en' ? 'Important:' : 'مهم:'}</span> {lang === 'en' 
                    ? 'Grades are automatically validated and cannot exceed 20.' 
                    : 'الدرجات يتم التحقق منها تلقائياً ولا يمكن أن تتجاوز 20.'}
                </p>
              </div>
              
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
                >
                  {text.closeHelp}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* التحكم */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <h2 className="font-bold mb-3">{text.level}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setLevel('L1')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${level === 'L1' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                L1
              </button>
              <button
                onClick={() => setLevel('L2')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${level === 'L2' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                L2
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <h2 className="font-bold mb-3">{text.semester}</h2>
            <div className="grid grid-cols-2 gap-2">
              {level === 'L1' ? (
                <>
                  <button 
                    onClick={() => setSemester('S1')} 
                    className={`py-3 rounded-xl font-bold transition-all ${semester === 'S1' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    S1
                  </button>
                  <button 
                    onClick={() => setSemester('S2')} 
                    className={`py-3 rounded-xl font-bold transition-all ${semester === 'S2' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    S2
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setSemester('S3')} 
                    className={`py-3 rounded-xl font-bold transition-all ${semester === 'S3' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    S3
                  </button>
                  <button 
                    onClick={() => setSemester('S4')} 
                    className={`py-3 rounded-xl font-bold transition-all ${semester === 'S4' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    S4
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border flex items-center justify-center">
            <button 
              onClick={resetAll} 
              className="px-6 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 flex items-center gap-2 transition-all"
            >
              <RefreshCcw className="w-4 h-4" />
              {text.reset}
            </button>
          </div>
        </div>

        {/* زر حساب المعدل وتحذير الأخطاء */}
        <div className="mb-8">
          {calculationError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{calculationError}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className={`flex-1 rounded-2xl p-8 text-white shadow-lg transition-all ${
              isCalculated && calculatedAverage !== null 
                ? (isPassing ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600') 
                : 'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{text.generalAverage}</h2>
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                      isCalculated && calculatedAverage !== null 
                        ? (isPassing ? 'bg-green-700/30 hover:bg-green-700/40' : 'bg-red-700/30 hover:bg-red-700/40') 
                        : 'bg-gray-600/30'
                    }`}>
                      {isCalculated && calculatedAverage !== null 
                        ? (isPassing ? <Trophy className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />) 
                        : <AlertCircle className="w-5 h-5" />}
                      {isCalculated && calculatedAverage !== null 
                        ? (isPassing ? text.passed : text.failed) 
                        : text.waitingForCalculation}
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right mt-4 md:mt-0">
                  <div className="text-6xl font-bold font-mono">
                    {isCalculated && calculatedAverage !== null ? calculatedAverage.toFixed(2) : '0.00'}
                    <span className="text-2xl opacity-70">/20</span>
                  </div>
                  <p className="text-sm opacity-80 mt-2">{text.status}</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <button
                onClick={calculateAverageWithValidation}
                className="w-full md:w-64 h-full py-8 px-6 rounded-2xl font-bold text-lg transition-all flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
              >
                <Calculator className="w-8 h-8" />
                {text.calculateAverage}
              </button>
            </div>
          </div>
        </div>

        {/* جميع المواد */}
        <h2 className="text-2xl font-bold mb-6">
          {text.modules} ({modules.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const moduleGrades = grades[module.id] || { exam: '', td: '', tp: '' };
            const moduleChecks = checks[module.id] || { exam: true, td: false, tp: false };
            const percentages = calculatePercentages(
              module.id,
              moduleChecks.exam,
              moduleChecks.td,
              moduleChecks.tp
            );
            const hasCustomPercentage = customExamPercentage[module.id] !== null;
            const moduleAverage = moduleAverages[module.id] || 0;
            const isModulePassing = moduleAverage >= 10;

            return (
              <div key={module.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                {/* عنوان المادة */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {lang === 'en' ? module.nameEn : module.nameAr}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        {text.coeff}: {module.coeff}
                      </span>
                      {isCalculated && moduleAverage > 0 && (
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${isModulePassing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {moduleAverage.toFixed(2)}
                        </span>
                      )}
                      <button
                        onClick={() => openCustomModal(module.id)}
                        className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 transition-all ${
                          hasCustomPercentage 
                            ? 'bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={text.customCase}
                      >
                        <Settings className="w-3 h-3" />
                        {text.specialCase}
                      </button>
                    </div>
                  </div>
                </div>

                {/* نافذة الحالة الخاصة */}
                {showCustomModal === module.id && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">{text.customExamPercentage}</h3>
                        <button 
                          onClick={() => setShowCustomModal(null)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {text.setExamPercentage} (%)
                        </label>
                        <div className="flex items-center gap-4 mb-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={tempCustomPercentage}
                            onChange={(e) => setTempCustomPercentage(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="w-16 text-center font-bold text-xl text-blue-600">
                            {tempCustomPercentage}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[50, 60, 70, 80, 90, 100].map(percent => (
                            <button
                              key={percent}
                              onClick={() => setTempCustomPercentage(percent)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                tempCustomPercentage === percent
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {percent}%
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-blue-700 mb-2">
                          {text.customExamInfo}
                        </p>
                        <div className="text-xs text-blue-600 space-y-1">
                          <div className="font-medium">{text.currentDistribution}:</div>
                          <div>
                            {moduleChecks.td && moduleChecks.tp 
                              ? `Exam: ${tempCustomPercentage}%, TD: ${(100 - tempCustomPercentage) / 2}%, TP: ${(100 - tempCustomPercentage) / 2}%`
                              : moduleChecks.td 
                                ? `Exam: ${tempCustomPercentage}%, TD: ${100 - tempCustomPercentage}%`
                                : moduleChecks.tp 
                                  ? `Exam: ${tempCustomPercentage}%, TP: ${100 - tempCustomPercentage}%`
                                  : `Exam: ${tempCustomPercentage}%`
                            }
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            removeCustomPercentage(module.id);
                            setShowCustomModal(null);
                          }}
                          className="flex-1 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                        >
                          {text.resetToAuto}
                        </button>
                        <button
                          onClick={saveCustomPercentage}
                          className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
                        >
                          {text.save}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* عرض النسب الحالية */}
                <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        {text.currentDistribution}
                      </span>
                    </div>
                    {hasCustomPercentage && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {text.custom}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center mb-2">
                    <div className={`p-2 rounded-lg ${moduleChecks.exam ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                      <div className="font-bold text-lg">{percentages.exam}%</div>
                      <div className="text-xs">{text.exam}</div>
                    </div>
                    <div className={`p-2 rounded-lg ${moduleChecks.td ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      <div className="font-bold text-lg">{percentages.td}%</div>
                      <div className="text-xs">{text.td}</div>
                    </div>
                    <div className={`p-2 rounded-lg ${moduleChecks.tp ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                      <div className="font-bold text-lg">{percentages.tp}%</div>
                      <div className="text-xs">{text.tp}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 pt-2 border-t border-blue-100">
                    {hasCustomPercentage 
                      ? text.customDistributionApplied
                      : text.automaticDistribution}
                  </div>
                </div>

                {/* Checkboxes لاختيار العناصر */}
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{text.selectElements}</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${module.id}-exam-check`}
                        checked={true}
                        disabled
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`${module.id}-exam-check`} className="ml-2 text-sm font-medium text-gray-700">
                        {text.exam} <span className="text-xs text-gray-500">({text.examRequired})</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${module.id}-td-check`}
                        checked={moduleChecks.td}
                        onChange={(e) => handleCheckChange(module.id, 'td', e.target.checked)}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label htmlFor={`${module.id}-td-check`} className="ml-2 text-sm font-medium text-gray-700">
                        {text.td}
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${module.id}-tp-check`}
                        checked={moduleChecks.tp}
                        onChange={(e) => handleCheckChange(module.id, 'tp', e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`${module.id}-tp-check`} className="ml-2 text-sm font-medium text-gray-700">
                        {text.tp}
                      </label>
                    </div>
                  </div>
                </div>

                {/* حقول إدخال الدرجات */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      {text.exam} (0-20) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      value={moduleGrades.exam}
                      onChange={(e) => handleGradeChange(module.id, 'exam', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder={text.enterGrade}
                      required
                    />
                    {parseFloat(moduleGrades.exam) > 20 && (
                      <p className="text-xs text-red-600">
                        {lang === 'en' ? 'Grade cannot exceed 20' : 'الدرجة لا يمكن أن تتجاوز 20'}
                      </p>
                    )}
                  </div>

                  {moduleChecks.td && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <GraduationCap className="w-4 h-4 text-green-600" />
                        {text.td} (0-20)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={moduleGrades.td}
                        onChange={(e) => handleGradeChange(module.id, 'td', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder={text.enterGrade}
                      />
                      {parseFloat(moduleGrades.td) > 20 && (
                        <p className="text-xs text-red-600">
                          {lang === 'en' ? 'Grade cannot exceed 20' : 'الدرجة لا يمكن أن تتجاوز 20'}
                        </p>
                      )}
                    </div>
                  )}

                  {moduleChecks.tp && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <FlaskConical className="w-4 h-4 text-purple-600" />
                        {text.tp} (0-20)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={moduleGrades.tp}
                        onChange={(e) => handleGradeChange(module.id, 'tp', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder={text.enterGrade}
                      />
                      {parseFloat(moduleGrades.tp) > 20 && (
                        <p className="text-xs text-red-600">
                          {lang === 'en' ? 'Grade cannot exceed 20' : 'الدرجة لا يمكن أن تتجاوز 20'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* الفوتر */}
      <footer className="mt-12 py-12 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-3">
            {text.by}
          </p>
          <p className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            MIAGE Calculator
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
            {lang === 'en' 
              ? ' MIAGE calculator '
              : 'حاسبة MIAGE '}
          </p>
          <p className="text-xs opacity-40 mt-8">© {new Date().getFullYear()} MIAGE Calculator - DevMaster</p>
        </div>
      </footer>
    </div>
  );
}

export default App;