export type CourseType = 'exam' | 'exam+td' | 'exam+tp' | 'exam+td+tp';

export interface Course {
  id: string;
  semester: 1 | 2 | 3 | 4 | 5 | 6;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  coefficient: number;
  credits: number;
  type: CourseType;
}

export type Lang = 'fr' | 'en' | 'ar';

export interface GradeEntry {
  exam: number | null;
  td: number | null;
  tp: number | null;
  pctExam: number;
  pctTd: number;
  pctTp: number;
}

export type Grades = Record<string, GradeEntry>;

export const courses: Course[] = [
  // ── Semester 1 ──────────────────────────────────────────────────
  { id: 's1c1', semester: 1, nameFr: 'Analyse et logique mathématiques', nameAr: 'تحليل ومنطق رياضي', nameEn: 'Mathematic analysis and logic', coefficient: 3, credits: 5, type: 'exam+td' },
  { id: 's1c2', semester: 1, nameFr: 'Introduction aux probabilités et statistique descriptive', nameAr: 'مدخل إلى الاحتمالات والإحصاء الوصفي', nameEn: 'Introduction to probabilities and statistics', coefficient: 2, credits: 4, type: 'exam+tp' },
  { id: 's1c3', semester: 1, nameFr: "Structure machine et administration des systèmes d'exploitation", nameAr: 'بناء الآلة وإدارة نظام التشغيل', nameEn: 'Machine structure and OS', coefficient: 2, credits: 4, type: 'exam+tp' },
  { id: 's1c4', semester: 1, nameFr: 'Programmation 1', nameAr: 'برمجة 1', nameEn: 'Programming 1', coefficient: 3, credits: 5, type: 'exam+tp' },
  { id: 's1c5', semester: 1, nameFr: 'Introduction aux sciences économiques', nameAr: 'مدخل إلى العلوم الاقتصادية', nameEn: 'Introduction to economic sciences', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's1c6', semester: 1, nameFr: 'Introduction aux sciences humaines et sociales 1', nameAr: 'مدخل إلى العلوم الإنسانية والاجتماعية 1', nameEn: 'Introduction to human and social sciences 1', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's1c7', semester: 1, nameFr: 'Travail universitaire 1', nameAr: 'العمل الجامعي 1', nameEn: 'University work 1', coefficient: 2, credits: 2, type: 'exam' },
  { id: 's1c8', semester: 1, nameFr: 'Ethique et déontologie professionnelle', nameAr: 'الأخلاقيات والقيم المهنية', nameEn: 'Ethics and professional deontology', coefficient: 1, credits: 1, type: 'exam' },
  { id: 's1c9', semester: 1, nameFr: 'Anglais 1', nameAr: 'أنجليزية 1', nameEn: 'English 1', coefficient: 1, credits: 1, type: 'exam' },

  // ── Semester 2 ──────────────────────────────────────────────────
  { id: 's2c1', semester: 2, nameFr: "Introduction à l'intelligence artificielle", nameAr: 'مدخل إلى الذكاء الاصطناعي', nameEn: 'Introduction to AI', coefficient: 3, credits: 5, type: 'exam+tp' },
  { id: 's2c2', semester: 2, nameFr: 'Programmation 2', nameAr: 'برمجة 2', nameEn: 'Programming 2', coefficient: 3, credits: 6, type: 'exam+tp' },
  { id: 's2c3', semester: 2, nameFr: 'Introduction aux théories économiques', nameAr: 'مدخل إلى النظريات الاقتصادية', nameEn: 'Introduction to economic theories', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's2c4', semester: 2, nameFr: 'Introduction aux sciences humaines et sociales 2', nameAr: 'مدخل إلى العلوم الإنسانية والاجتماعية 2', nameEn: 'Introduction to human and social sciences 2', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's2c5', semester: 2, nameFr: 'Travail universitaire 2', nameAr: 'العمل الجامعي 2', nameEn: 'University work 2', coefficient: 2, credits: 2, type: 'exam' },
  { id: 's2c6', semester: 2, nameFr: 'Algèbre linéaire', nameAr: 'جبر خطي', nameEn: 'Linear algebra', coefficient: 3, credits: 5, type: 'exam+td' },
  { id: 's2c7', semester: 2, nameFr: "Entrepreneuriat et gestion de l'entreprise", nameAr: 'المقاولاتية وتسيير المؤسسات', nameEn: 'Entrepreneurship and management', coefficient: 1, credits: 1, type: 'exam' },
  { id: 's2c8', semester: 2, nameFr: 'Introduction au droit', nameAr: 'مدخل إلى القانون', nameEn: 'Introduction to law', coefficient: 1, credits: 1, type: 'exam' },
  { id: 's2c9', semester: 2, nameFr: 'Anglais 2', nameAr: 'أنجليزية 2', nameEn: 'English 2', coefficient: 1, credits: 1, type: 'exam' },

  // ── Semester 3 ──────────────────────────────────────────────────
  { id: 's3c1', semester: 3, nameFr: "Systèmes d'information", nameAr: 'أنظمة المعلومات', nameEn: 'Information systems', coefficient: 2, credits: 4, type: 'exam+td' },
  { id: 's3c2', semester: 3, nameFr: 'Programmation avancée', nameAr: 'برمجة متقدمة', nameEn: 'Advanced programming', coefficient: 3, credits: 5, type: 'exam+td+tp' },
  { id: 's3c3', semester: 3, nameFr: 'Microéconomie', nameAr: 'اقتصاد جزئي', nameEn: 'Microeconomics', coefficient: 3, credits: 5, type: 'exam+td' },
  { id: 's3c4', semester: 3, nameFr: 'Comptabilité financière', nameAr: 'محاسبة مالية', nameEn: 'Financial accounting', coefficient: 2, credits: 4, type: 'exam+td' },
  { id: 's3c5', semester: 3, nameFr: 'Introduction au management', nameAr: 'مدخل إلى التسيير', nameEn: 'Introduction to management', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's3c6', semester: 3, nameFr: 'Finances publiques', nameAr: 'مالية عامة', nameEn: 'Public finance', coefficient: 2, credits: 3, type: 'exam' },
  { id: 's3c7', semester: 3, nameFr: 'Analyse de données 1', nameAr: 'تحليل البيانات 1', nameEn: 'Data analysis 1', coefficient: 2, credits: 3, type: 'exam+tp' },
  { id: 's3c8', semester: 3, nameFr: 'Droit commercial', nameAr: 'قانون تجاري', nameEn: 'Commercial law', coefficient: 1, credits: 1, type: 'exam' },
  { id: 's3c9', semester: 3, nameFr: 'Anglais 3', nameAr: 'أنجليزية 3', nameEn: 'English 3', coefficient: 1, credits: 1, type: 'exam' },

  // ── Semester 4 ──────────────────────────────────────────────────
  { id: 's4c1', semester: 4, nameFr: 'Réseaux et technologies web', nameAr: 'شبكات وتكنولوجيات الويب', nameEn: 'Networks and web technologies', coefficient: 2, credits: 4, type: 'exam+tp' },
  { id: 's4c2', semester: 4, nameFr: 'Bases de données', nameAr: 'قواعد البيانات', nameEn: 'Databases', coefficient: 3, credits: 5, type: 'exam+td+tp' },
  { id: 's4c3', semester: 4, nameFr: 'Macroéconomie', nameAr: 'اقتصاد كلي', nameEn: 'Macroeconomics', coefficient: 3, credits: 5, type: 'exam+td' },
  { id: 's4c4', semester: 4, nameFr: 'Introduction à la comptabilité de gestion', nameAr: 'مدخل إلى المحاسبة الإدارية', nameEn: 'Introduction to management accounting', coefficient: 2, credits: 4, type: 'exam+td' },
  { id: 's4c5', semester: 4, nameFr: 'Analyse de données 2', nameAr: 'تحليل البيانات 2', nameEn: 'Data analysis 2', coefficient: 2, credits: 3, type: 'exam+tp' },
  { id: 's4c6', semester: 4, nameFr: 'Mathématiques financières', nameAr: 'رياضيات مالية', nameEn: 'Financial mathematics', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's4c7', semester: 4, nameFr: "Systèmes d'information pour les entreprises", nameAr: 'أنظمة معلومات المؤسسات', nameEn: 'Business information systems', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's4c8', semester: 4, nameFr: 'Introduction au marketing', nameAr: 'مدخل إلى التسويق', nameEn: 'Introduction to marketing', coefficient: 1, credits: 1, type: 'exam' },
  { id: 's4c9', semester: 4, nameFr: 'Anglais 4', nameAr: 'أنجليزية 4', nameEn: 'English 4', coefficient: 1, credits: 1, type: 'exam' },

  // ── Semester 5 ──────────────────────────────────────────────────
  { id: 's5c1', semester: 5, nameFr: 'Business intelligence et Big Data', nameAr: 'ذكاء الأعمال والبيانات الضخمة', nameEn: 'Business intelligence and Big Data', coefficient: 2, credits: 4, type: 'exam+tp' },
  { id: 's5c2', semester: 5, nameFr: 'Science de données et intelligence artificielle', nameAr: 'علم البيانات والذكاء الاصطناعي', nameEn: 'Data science and AI', coefficient: 3, credits: 5, type: 'exam+tp' },
  { id: 's5c3', semester: 5, nameFr: 'Gestion et analyse financière', nameAr: 'تسيير وتحليل مالي', nameEn: 'Financial management and analysis', coefficient: 2, credits: 4, type: 'exam+td' },
  { id: 's5c4', semester: 5, nameFr: 'Contrôle de gestion', nameAr: 'رقابة إدارية', nameEn: 'Management control', coefficient: 3, credits: 5, type: 'exam+td' },
  { id: 's5c5', semester: 5, nameFr: 'Cybersécurité', nameAr: 'أمن سيبراني', nameEn: 'Cybersecurity', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's5c6', semester: 5, nameFr: "Développement d'applications mobiles", nameAr: 'تطوير التطبيقات المحمولة', nameEn: 'Mobile application development', coefficient: 2, credits: 3, type: 'exam+tp' },
  { id: 's5c7', semester: 5, nameFr: 'Fiscalité des entreprises', nameAr: 'ضرائب المؤسسات', nameEn: 'Business taxation', coefficient: 2, credits: 3, type: 'exam+td' },
  { id: 's5c8', semester: 5, nameFr: 'Économie monétaire et financière', nameAr: 'الاقتصاد النقدي والمالي', nameEn: 'Monetary and financial economics', coefficient: 1, credits: 1, type: 'exam' },
  { id: 's5c9', semester: 5, nameFr: 'Économie et commerce internationaux', nameAr: 'اقتصاد وتجارة دوليين', nameEn: 'International economics and trade', coefficient: 1, credits: 1, type: 'exam' },

  // ── Semester 6 ──────────────────────────────────────────────────
  { id: 's6c1', semester: 6, nameFr: 'E-commerce', nameAr: 'تجارة إلكترونية', nameEn: 'E-commerce', coefficient: 3, credits: 5, type: 'exam+tp' },
  { id: 's6c2', semester: 6, nameFr: 'Logiciels spécialisés', nameAr: 'برمجيات متخصصة', nameEn: 'Specialized software', coefficient: 2, credits: 4, type: 'exam+tp' },
  { id: 's6c3', semester: 6, nameFr: 'Gestion des salaires', nameAr: 'إدارة الأجور', nameEn: 'Wage management', coefficient: 2, credits: 4, type: 'exam+td' },
  { id: 's6c4', semester: 6, nameFr: "Méthodes numériques appliquées à l'économie", nameAr: 'تطبيق الطرق العددية في الاقتصاد', nameEn: 'Applied numerical methods', coefficient: 3, credits: 5, type: 'exam+td' },
  { id: 's6c5', semester: 6, nameFr: 'Projet final', nameAr: 'مشروع التخرج', nameEn: 'Final project', coefficient: 6, credits: 9, type: 'exam' },
  { id: 's6c6', semester: 6, nameFr: 'Droit pénal des affaires', nameAr: 'قانون الجرائم الاقتصادية', nameEn: 'Business criminal law', coefficient: 1, credits: 1, type: 'exam' },
  { id: 's6c7', semester: 6, nameFr: 'Éthique des affaires', nameAr: 'أخلاقيات الأعمال', nameEn: 'Business ethics', coefficient: 1, credits: 1, type: 'exam' },
];

export function getDefaultPercentages(type: CourseType) {
  switch (type) {
    case 'exam':       return { pctExam: 100, pctTd: 0,  pctTp: 0  };
    case 'exam+td':    return { pctExam: 60,  pctTd: 40, pctTp: 0  };
    case 'exam+tp':    return { pctExam: 60,  pctTd: 0,  pctTp: 40 };
    case 'exam+td+tp': return { pctExam: 60,  pctTd: 20, pctTp: 20 };
  }
}

export function calcCourseGrade(course: Course, entry: GradeEntry): number | null {
  const { exam, td, tp, pctExam, pctTd, pctTp } = entry;
  if (exam === null) return null;

  let result = (exam * pctExam) / 100;

  if (course.type.includes('+td')) {
    if (td === null) return null;
    result += (td * pctTd) / 100;
  }
  if (course.type.includes('+tp')) {
    if (tp === null) return null;
    result += (tp * pctTp) / 100;
  }

  return Math.round(result * 100) / 100;
}

export function calcSemesterAverage(semNum: 1 | 2 | 3 | 4 | 5 | 6, grades: Grades): number | null {
  const semCourses = courses.filter(c => c.semester === semNum);
  let totalWeight = 0;
  let totalScore = 0;

  for (const c of semCourses) {
    const entry = grades[c.id];
    if (!entry) continue;
    const grade = calcCourseGrade(c, entry);
    if (grade === null) continue;
    totalScore += grade * c.coefficient;
    totalWeight += c.coefficient;
  }

  if (totalWeight === 0) return null;
  return Math.round((totalScore / totalWeight) * 100) / 100;
}

export function getCourseName(course: Course, lang: Lang): string {
  if (lang === 'ar') return course.nameAr;
  if (lang === 'en') return course.nameEn;
  return course.nameFr;
}
