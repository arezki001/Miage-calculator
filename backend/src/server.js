import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🎓 MIAGE Calculator API',
    version: '1.0.0',
    author: 'DOUBLE-A',
    rules: {
      L1: {
        'Exam only': '100% Exam',
        'Exam + TD': '50% Exam, 50% TD',
        'Exam + TP': '50% Exam, 50% TP',
        'Exam + TD + TP': '50% Exam, 25% TD, 25% TP'
      },
      L2: {
        'Exam only': '100% Exam',
        'Exam + TD': '60% Exam, 40% TD',
        'Exam + TP': '60% Exam, 40% TP',
        'Exam + TD + TP': '60% Exam, 20% TD, 20% TP'
      }
    }
  });
});

// ========== MIAGE DATA ==========
const MIAGE_DATA = {
  L1: {
    S1: [
      { id: 'm1', nameAr: 'تحليل ومنطق رياضي', nameEn: 'Analysis and Mathematical Logic', coefficient: 3, hasTD: true, hasTP: false },
      { id: 'm2', nameAr: 'مقدمة في الاحتمالات والإحصاء الوصفي', nameEn: 'Introduction to Probabilities and Descriptive Statistics', coefficient: 2, hasTD: true, hasTP: false },
      { id: 'm3', nameAr: 'هيكلة الآلة وإدارة أنظمة التشغيل', nameEn: 'Machine Structure and OS Administration', coefficient: 2, hasTD: false, hasTP: true },
      { id: 'm4', nameAr: 'برمجة 1', nameEn: 'Programming 1', coefficient: 3, hasTD: true, hasTP: true },
      { id: 'm5', nameAr: 'مقدمة في العلوم الاقتصادية', nameEn: 'Introduction to Economic Sciences', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm6', nameAr: 'مقدمة في العلوم الإنسانية والاجتماعية 1', nameEn: 'Introduction to Human and Social Sciences 1', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm7', nameAr: 'عمل جامعي 1', nameEn: 'University Work 1', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm8', nameAr: 'أخلاقيات المهنة', nameEn: 'Professional Ethics', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm9', nameAr: 'لغة إنجليزية 1', nameEn: 'English 1', coefficient: 2, hasTD: false, hasTP: false }
    ],
    S2: [
      { id: 'm10', nameAr: 'مقدمة في الذكاء الاصطناعي', nameEn: 'Introduction to Artificial Intelligence', coefficient: 3, hasTD: true, hasTP: false },
      { id: 'm11', nameAr: 'برمجة 2', nameEn: 'Programming 2', coefficient: 3, hasTD: true, hasTP: true },
      { id: 'm12', nameAr: 'مقدمة في النظريات الاقتصادية', nameEn: 'Introduction to Economic Theories', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm13', nameAr: 'مقدمة في العلوم الإنسانية والاجتماعية 2', nameEn: 'Introduction to Human and Social Sciences 2', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm14', nameAr: 'عمل جامعي 2', nameEn: 'University Work 2', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm15', nameAr: 'جبر خطي', nameEn: 'Linear Algebra', coefficient: 3, hasTD: true, hasTP: false },
      { id: 'm16', nameAr: 'ريادة الأعمال وإدارة المؤسسة', nameEn: 'Entrepreneurship and Business Management', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm17', nameAr: 'مقدمة في القانون', nameEn: 'Introduction to Law', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm18', nameAr: 'لغة إنجليزية 2', nameEn: 'English 2', coefficient: 2, hasTD: false, hasTP: false }
    ]
  },
  L2: {
    S3: [
      { id: 'm19', nameAr: 'نظم المعلومات', nameEn: 'Information Systems', coefficient: 2, hasTD: true, hasTP: false },
      { id: 'm20', nameAr: 'برمجة متقدمة', nameEn: 'Advanced Programming', coefficient: 3, hasTD: true, hasTP: true },
      { id: 'm21', nameAr: 'اقتصاد جزئي', nameEn: 'Microeconomics', coefficient: 3, hasTD: false, hasTP: false },
      { id: 'm22', nameAr: 'محاسبة مالية', nameEn: 'Financial Accounting', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm23', nameAr: 'مقدمة في الإدارة', nameEn: 'Introduction to Management', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm24', nameAr: 'مالية عامة', nameEn: 'Public Finance', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm25', nameAr: 'تحليل بيانات 1', nameEn: 'Data Analysis 1', coefficient: 2, hasTD: false, hasTP: true },
      { id: 'm26', nameAr: 'قانون تجاري', nameEn: 'Commercial Law', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm27', nameAr: 'لغة إنجليزية 3', nameEn: 'English 3', coefficient: 2, hasTD: false, hasTP: false }
    ],
    S4: [
      { id: 'm28', nameAr: 'شبكات وتقنيات الويب', nameEn: 'Networks and Web Technologies', coefficient: 2, hasTD: false, hasTP: true },
      { id: 'm29', nameAr: 'قواعد البيانات', nameEn: 'Databases', coefficient: 3, hasTD: true, hasTP: true },
      { id: 'm30', nameAr: 'اقتصاد كلي', nameEn: 'Macroeconomics', coefficient: 3, hasTD: false, hasTP: false },
      { id: 'm31', nameAr: 'مقدمة إلى محاسبة التكاليف', nameEn: 'Introduction to Cost Accounting', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm32', nameAr: 'تحليل بيانات 2', nameEn: 'Data Analysis 2', coefficient: 2, hasTD: false, hasTP: true },
      { id: 'm33', nameAr: 'رياضيات مالية', nameEn: 'Financial Mathematics', coefficient: 2, hasTD: true, hasTP: false },
      { id: 'm34', nameAr: 'مقدمة في التسويق', nameEn: 'Introduction to Marketing', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm35', nameAr: 'لغة إنجليزية 4', nameEn: 'English 4', coefficient: 2, hasTD: false, hasTP: false },
      { id: 'm36', nameAr: 'نظم المعلومات للمؤسسات', nameEn: 'Enterprise Information Systems', coefficient: 2, hasTD: false, hasTP: false }
    ]
  }
};

// API 1: Get modules
app.get('/api/modules/:level/:semester', (req, res) => {
  const { level, semester } = req.params;
  
  if (!MIAGE_DATA[level] || !MIAGE_DATA[level][semester]) {
    return res.status(404).json({ 
      error: 'Not found',
      message: `No modules found for ${level} ${semester}`
    });
  }
  
  res.json(MIAGE_DATA[level][semester]);
});

// API 2: Calculate grades
app.post('/api/calculate', (req, res) => {
  const { level, modules } = req.body;
  
  if (!level || !modules) {
    return res.status(400).json({ error: 'Level and modules are required' });
  }
  
  let totalPoints = 0;
  let totalCoeff = 0;
  const results = [];
  
  modules.forEach(module => {
    const { exam, td, tp, coefficient, hasExam, hasTD, hasTP } = module;
    
    // Validate grades (0-20)
    if (exam < 0 || exam > 20) {
      return res.status(400).json({ error: `Invalid exam grade for module ${module.id}` });
    }
    
    // Calculate based on level and checkboxes
    let moduleAverage = 0;
    let distribution = '';
    
    if (level === 'L1') {
      // L1 Rules
      if (hasExam && !hasTD && !hasTP) {
        // Exam only
        moduleAverage = exam;
        distribution = '100% Exam';
      } else if (hasExam && hasTD && !hasTP) {
        // Exam + TD
        moduleAverage = (exam * 0.5) + (td * 0.5);
        distribution = '50% Exam, 50% TD';
      } else if (hasExam && !hasTD && hasTP) {
        // Exam + TP
        moduleAverage = (exam * 0.5) + (tp * 0.5);
        distribution = '50% Exam, 50% TP';
      } else if (hasExam && hasTD && hasTP) {
        // Exam + TD + TP
        moduleAverage = (exam * 0.5) + (td * 0.25) + (tp * 0.25);
        distribution = '50% Exam, 25% TD, 25% TP';
      }
    } else if (level === 'L2') {
      // L2 Rules
      if (hasExam && !hasTD && !hasTP) {
        // Exam only
        moduleAverage = exam;
        distribution = '100% Exam';
      } else if (hasExam && hasTD && !hasTP) {
        // Exam + TD
        moduleAverage = (exam * 0.6) + (td * 0.4);
        distribution = '60% Exam, 40% TD';
      } else if (hasExam && !hasTD && hasTP) {
        // Exam + TP
        moduleAverage = (exam * 0.6) + (tp * 0.4);
        distribution = '60% Exam, 40% TP';
      } else if (hasExam && hasTD && hasTP) {
        // Exam + TD + TP
        moduleAverage = (exam * 0.6) + (td * 0.2) + (tp * 0.2);
        distribution = '60% Exam, 20% TD, 20% TP';
      }
    }
    
    const modulePoints = moduleAverage * coefficient;
    totalPoints += modulePoints;
    totalCoeff += coefficient;
    
    results.push({
      moduleId: module.id,
      moduleAverage: parseFloat(moduleAverage.toFixed(2)),
      distribution,
      points: parseFloat(modulePoints.toFixed(2))
    });
  });
  
  const semesterAverage = totalCoeff > 0 ? totalPoints / totalCoeff : 0;
  
  res.json({
    level,
    moduleResults: results,
    semesterAverage: parseFloat(semesterAverage.toFixed(2)),
    totalCoeff,
    totalPoints: parseFloat(totalPoints.toFixed(2)),
    isPassing: semesterAverage >= 10
  });
});

// API 3: Feedback
app.post('/api/feedback', (req, res) => {
  const { content, rating, language } = req.body;
  
  if (!content || !rating) {
    return res.status(400).json({ error: 'Content and rating are required' });
  }
  
  console.log('📝 New Feedback:', { content, rating, language, timestamp: new Date() });
  
  res.json({
    success: true,
    message: 'Thank you for your feedback!',
    feedbackId: Date.now().toString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 MIAGE Calculator Backend Started!');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📚 Programmed by: DOUBLE-A`);
  console.log(`📅 ${new Date().toLocaleString()}`);
});