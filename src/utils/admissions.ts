import { PAK_UNIVERSITIES, University, DegreeProgram } from '../data/universities';

export interface StudentMarks {
  matricObtained: number;
  matricTotal: number;
  fscObtained: number;
  fscTotal: number;
  testObtained?: number;
  testTotal?: number;
  fscGroup?: 'Pre-Engineering' | 'Pre-Medical' | 'ICS' | 'General Science' | 'Commerce' | 'Arts';
  targetTest?: string;
  domicile?: string;
}

export interface ChancePrediction {
  program: DegreeProgram;
  university: University;
  calculatedAggregate: number;
  closingMerit2024: number;
  diff: number; // positive = above closing merit, negative = below
  status: 'High Chance' | 'Moderate Chance' | 'Reach / Competitive' | 'Ineligible';
  eligibilityMet: boolean;
  notes: string;
}

/**
 * Calculates aggregate percentage based on specific university merit formulas.
 */
export function calculateAggregate(
  formulaId: string,
  marks: {
    matricObtained: number;
    matricTotal: number;
    fscObtained: number;
    fscTotal: number;
    testObtained?: number;
    testTotal?: number;
  }
): number {
  const matricPct = marks.matricTotal > 0 ? (marks.matricObtained / marks.matricTotal) * 100 : 0;
  const fscPct = marks.fscTotal > 0 ? (marks.fscObtained / marks.fscTotal) * 100 : 0;
  const testPct = marks.testTotal && marks.testTotal > 0 && marks.testObtained !== undefined
    ? (marks.testObtained / marks.testTotal) * 100
    : 0;

  let aggregate = 0;

  switch (formulaId) {
    case 'nust-formula':
      // NET 75% + FSc 15% + Matric 10%
      aggregate = (testPct * 0.75) + (fscPct * 0.15) + (matricPct * 0.10);
      break;

    case 'fast-formula':
      // NU Test 50% + FSc 50%
      aggregate = (testPct * 0.50) + (fscPct * 0.50);
      break;

    case 'uet-formula':
      // ECAT 33% + FSc 50% + Matric 17%
      aggregate = (testPct * 0.33) + (fscPct * 0.50) + (matricPct * 0.17);
      break;

    case 'ned-formula':
      // NED Test 50% + HSC 50%
      aggregate = (testPct * 0.50) + (fscPct * 0.50);
      break;

    case 'comsats-formula':
      // NTS NAT 50% + FSc 40% + Matric 10%
      aggregate = (testPct * 0.50) + (fscPct * 0.40) + (matricPct * 0.10);
      break;

    case 'giki-formula':
      // GIKI Test 85% + HSSC 15%
      aggregate = (testPct * 0.85) + (fscPct * 0.15);
      break;

    case 'pmdc-formula':
    case 'duhs-pmdc-formula':
      // MDCAT 50% + FSc Pre-Med 40% + Matric 10%
      aggregate = (testPct * 0.50) + (fscPct * 0.40) + (matricPct * 0.10);
      break;

    case 'pieas-formula':
      // PIEAS Test 60% + FSc 25% + Matric 15%
      aggregate = (testPct * 0.60) + (fscPct * 0.25) + (matricPct * 0.15);
      break;

    case 'standard-50-50':
    case 'iba-formula':
    default:
      // Default: If test provided, 50% test + 50% FSc, else 70% FSc + 30% Matric
      if (marks.testTotal && marks.testTotal > 0) {
        aggregate = (testPct * 0.50) + (fscPct * 0.50);
      } else {
        aggregate = (fscPct * 0.70) + (matricPct * 0.30);
      }
      break;
  }

  return Math.round(aggregate * 100) / 100;
}

/**
 * Checks if student marks meet program minimum eligibility
 */
export function checkEligibility(
  studentMarks: StudentMarks,
  program: DegreeProgram
): { eligible: boolean; reason: string } {
  const fscPct = studentMarks.fscTotal > 0
    ? (studentMarks.fscObtained / studentMarks.fscTotal) * 100
    : 0;

  if (fscPct < program.eligibility.minFscPercentage) {
    return {
      eligible: false,
      reason: `Intermediate percentage (${fscPct.toFixed(1)}%) is below the minimum required ${program.eligibility.minFscPercentage}%.`
    };
  }

  // Pre-Med wishing to do CS: HEC allows Pre-Med with deficit math course
  if (program.discipline === 'Engineering' && studentMarks.fscGroup === 'Commerce') {
    return {
      eligible: false,
      reason: 'Engineering programs require FSc Pre-Engineering or ICS with Mathematics and Physics.'
    };
  }

  if (program.discipline === 'Medical & Health' && studentMarks.fscGroup && studentMarks.fscGroup !== 'Pre-Medical') {
    return {
      eligible: false,
      reason: 'MBBS/BDS requires FSc Pre-Medical (Biology, Chemistry, Physics).'
    };
  }

  return { eligible: true, reason: 'Meets minimum academic criteria.' };
}

/**
 * Predicts admission chances comparing aggregate against closing merits.
 * Note: Never promises admission; always labels as estimate.
 */
export function predictChances(aggregate: number, closingMerit2024: number): {
  status: 'High Chance' | 'Moderate Chance' | 'Reach / Competitive';
  diff: number;
  explanation: string;
} {
  const diff = Math.round((aggregate - closingMerit2024) * 100) / 100;

  if (diff >= 1.5) {
    return {
      status: 'High Chance',
      diff,
      explanation: `Your estimated aggregate (${aggregate.toFixed(2)}%) is safely above the 2024 closing merit (${closingMerit2024.toFixed(2)}%) by +${diff.toFixed(2)}%. Admission is favorable based on historical trends.`
    };
  } else if (diff >= -1.5) {
    return {
      status: 'Moderate Chance',
      diff,
      explanation: `Your aggregate (${aggregate.toFixed(2)}%) is close to the 2024 closing merit (${closingMerit2024.toFixed(2)}%). Merit fluctuates slightly each year; this is a competitive zone.`
    };
  } else {
    return {
      status: 'Reach / Competitive',
      diff,
      explanation: `Your aggregate (${aggregate.toFixed(2)}%) is below the 2024 closing merit (${closingMerit2024.toFixed(2)}%) by ${Math.abs(diff).toFixed(2)}%. Consider this a reach option, or aim for higher entry test marks.`
    };
  }
}

/**
 * Search universities and programs by search query, province, and discipline.
 */
export function searchUniversities(
  query: string,
  options?: {
    province?: string;
    discipline?: string;
    maxAggregate?: number;
    minAggregate?: number;
  }
): { university: University; matchingPrograms: DegreeProgram[] }[] {
  const cleanQuery = query.toLowerCase().trim();

  const results: { university: University; matchingPrograms: DegreeProgram[] }[] = [];

  for (const uni of PAK_UNIVERSITIES) {
    // Check province filter
    if (options?.province && options.province !== 'All' && uni.province.toLowerCase() !== options.province.toLowerCase()) {
      continue;
    }

    const matchesUniName =
      cleanQuery === '' ||
      uni.name.toLowerCase().includes(cleanQuery) ||
      uni.shortName.toLowerCase().includes(cleanQuery) ||
      uni.city.toLowerCase().includes(cleanQuery) ||
      uni.province.toLowerCase().includes(cleanQuery);

    const matchingPrograms = uni.programs.filter((prog) => {
      // Check discipline filter
      if (options?.discipline && options.discipline !== 'All' && prog.discipline !== options.discipline) {
        return false;
      }

      if (matchesUniName) return true;

      return (
        prog.name.toLowerCase().includes(cleanQuery) ||
        prog.code.toLowerCase().includes(cleanQuery) ||
        prog.discipline.toLowerCase().includes(cleanQuery)
      );
    });

    if (matchingPrograms.length > 0 || matchesUniName) {
      results.push({
        university: uni,
        matchingPrograms: matchingPrograms.length > 0 ? matchingPrograms : uni.programs
      });
    }
  }

  return results;
}

/**
 * Prepares a structured study plan for entrance tests.
 */
export function generateStudyPlan(
  testName: string,
  targetDays: number = 30,
  weakSubjects: string[] = []
): {
  testName: string;
  durationDays: number;
  weeklySchedule: { week: number; focus: string; dailyHours: string; milestones: string[] }[];
  keyStrategies: string[];
} {
  const isMed = testName.toLowerCase().includes('mdcat');
  const isComputing = testName.toLowerCase().includes('fast') || testName.toLowerCase().includes('net');

  return {
    testName,
    durationDays: targetDays,
    weeklySchedule: [
      {
        week: 1,
        focus: weakSubjects.length > 0 ? `Core Fundamentals & Focus on Weak Areas (${weakSubjects.join(', ')})` : 'Diagnostic Assessment & Foundational Review',
        dailyHours: '4 - 5 hours / day',
        milestones: [
          'Take 1 full-length timed diagnostic test to identify baseline score.',
          'Review high-weightage topics from Punjab / Sindh textbook boards.',
          'Solve 50 topical MCQs daily.'
        ]
      },
      {
        week: 2,
        focus: isMed ? 'In-depth Biology & Chemistry Mechanisms' : 'Advanced Mathematics & Physics Problem Solving',
        dailyHours: '5 - 6 hours / day',
        milestones: [
          'Master formula sheets, shortcut techniques, and speed-solving methods.',
          'Target speed: < 50 seconds per MCQ for computing/math, < 40 seconds for biology.',
          'Analyze every error from practice question banks.'
        ]
      },
      {
        week: 3,
        focus: 'Past Papers & Time Management Under Real Pressure',
        dailyHours: '6 hours / day',
        milestones: [
          'Solve 3 full past papers under strict timer conditions.',
          'Simulate test center environment (no calculators if prohibited).',
          'Review English vocabulary, grammar rules, and logical reasoning shortcuts.'
        ]
      },
      {
        week: 4,
        focus: 'Final Mock Tests & Confidence Consolidation',
        dailyHours: '4 hours / day (avoid burnout)',
        milestones: [
          'Take 2 full computer-based or paper mocks.',
          'Sleep 7-8 hours daily and revise high-yield formula sheets.',
          'Prepare required test admission slips, CNIC/B-form, and stationery.'
        ]
      }
    ],
    keyStrategies: [
      'Focus strictly on Textbook line-by-line reading for Pre-Medical & Physics.',
      'Practice mental arithmetic and shortcuts since calculators are forbidden in NET, ECAT, and MDCAT.',
      'Always eliminate 2 wrong options immediately in tough questions to boost odds.',
      'Track time per question strictly: do not get stuck on a single math puzzle for > 90 seconds.'
    ]
  };
}

export interface PracticeMCQ {
  id: string;
  test: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const SAMPLE_PRACTICE_QUESTIONS: PracticeMCQ[] = [
  {
    id: 'mcq-1',
    test: 'NUST NET',
    subject: 'Mathematics',
    topic: 'Conic Sections',
    difficulty: 'Medium',
    question: 'What is the eccentricity (e) of an ellipse represented by the equation x²/25 + y²/16 = 1?',
    options: ['3/5', '4/5', '5/3', '16/25'],
    correctAnswerIndex: 0,
    explanation: 'Here a² = 25 (a = 5) and b² = 16. In an ellipse, c² = a² - b² = 25 - 16 = 9, so c = 3. Eccentricity e = c / a = 3 / 5 = 0.6.'
  },
  {
    id: 'mcq-2',
    test: 'NUST NET',
    subject: 'Physics',
    topic: 'Electromagnetism',
    difficulty: 'Medium',
    question: 'When a charged particle enters perpendicularly into a uniform magnetic field, what path does it follow?',
    options: ['Straight line', 'Circular path', 'Helical path', 'Parabolic path'],
    correctAnswerIndex: 1,
    explanation: 'The magnetic Lorentz force F = q(v × B) acts perpendicular to the velocity at all times, providing the necessary centripetal force resulting in a uniform circular orbit.'
  },
  {
    id: 'mcq-3',
    test: 'FAST NU',
    subject: 'Advanced Mathematics',
    topic: 'Derivatives & Calculus',
    difficulty: 'Hard',
    question: 'If y = ln(sec(x) + tan(x)), then dy/dx is equal to:',
    options: ['tan(x)', 'sec(x)', 'sec(x)tan(x)', 'cos(x)'],
    correctAnswerIndex: 1,
    explanation: 'dy/dx = 1 / (sec(x) + tan(x)) * d/dx(sec(x) + tan(x)) = (sec(x)tan(x) + sec²(x)) / (sec(x) + tan(x)) = sec(x)(tan(x) + sec(x)) / (sec(x) + tan(x)) = sec(x).'
  },
  {
    id: 'mcq-4',
    test: 'ECAT',
    subject: 'Physics',
    topic: 'Work and Energy',
    difficulty: 'Medium',
    question: 'If the momentum of a body increases by 20%, what is the percentage increase in its kinetic energy?',
    options: ['20%', '40%', '44%', '24%'],
    correctAnswerIndex: 2,
    explanation: 'KE = p² / (2m). New momentum p\' = 1.2p. New KE\' = (1.2p)² / 2m = 1.44 * (p² / 2m) = 1.44 KE. The increase is (1.44 - 1) * 100% = 44%.'
  },
  {
    id: 'mcq-5',
    test: 'MDCAT',
    subject: 'Biology',
    topic: 'Cell Biology & Organelles',
    difficulty: 'Easy',
    question: 'Which cellular organelle is responsible for the synthesis of lipids and detoxification of drugs in hepatic cells?',
    options: ['Rough Endoplasmic Reticulum', 'Smooth Endoplasmic Reticulum', 'Golgi Apparatus', 'Lysosome'],
    correctAnswerIndex: 1,
    explanation: 'Smooth Endoplasmic Reticulum (SER) is specialized for lipid metabolism, steroid hormone synthesis, and detoxification of drugs and poisons, particularly in liver cells.'
  },
  {
    id: 'mcq-6',
    test: 'MDCAT',
    subject: 'Chemistry',
    topic: 'Chemical Equilibrium',
    difficulty: 'Medium',
    question: 'According to Le Chatelier’s principle, what happens to the Haber process (N₂ + 3H₂ ⇌ 2NH₃, ΔH = -92 kJ/mol) when pressure is increased?',
    options: [
      'Equilibrium shifts towards reactants',
      'Equilibrium shifts towards products (more ammonia is formed)',
      'Equilibrium remains unchanged',
      'The rate of backward reaction increases faster than forward'
    ],
    correctAnswerIndex: 1,
    explanation: 'There are 4 moles of gaseous reactants (1 N₂ + 3 H₂) and 2 moles of product (2 NH₃). Increasing pressure shifts the equilibrium towards fewer gas moles (forward reaction to products).'
  },
  {
    id: 'mcq-7',
    test: 'IBA',
    subject: 'Analytical & English',
    topic: 'Sentence Completion & Vocab',
    difficulty: 'Medium',
    question: 'Choose the word most opposite in meaning to EPHEMERAL:',
    options: ['Fleeting', 'Perpetual', 'Evanescent', 'Transient'],
    correctAnswerIndex: 1,
    explanation: 'Ephemeral means lasting for a very short time. Its direct antonym is Perpetual (lasting forever or indefinitely).'
  },
  {
    id: 'mcq-8',
    test: 'GIKI Test',
    subject: 'Physics',
    topic: 'Oscillations & Waves',
    difficulty: 'Hard',
    question: 'A simple pendulum has time period T on Earth. If it is placed in an elevator accelerating upward with acceleration g/2, its new time period will be:',
    options: ['T √(3/2)', 'T √(2/3)', 'T / 2', '2 T'],
    correctAnswerIndex: 1,
    explanation: 'Effective gravity g\' = g + a = g + g/2 = 3g/2. Since T = 2π√(L/g), new T\' = 2π√(L / (3g/2)) = T √(2/3).'
  },
  {
    id: 'mcq-9',
    test: 'LUMS LCAT / SAT',
    subject: 'Quantitative Reasoning',
    topic: 'Combinatorics & Probability',
    difficulty: 'Hard',
    question: 'In how many different ways can 5 distinct books be arranged on a shelf such that 2 specific books are never adjacent?',
    options: ['72', '48', '120', '24'],
    correctAnswerIndex: 0,
    explanation: 'Total unrestricted arrangements = 5! = 120. Arrangements where the 2 specific books are together = (4! × 2!) = 24 × 2 = 48. Arrangements where they are never adjacent = 120 - 48 = 72.'
  },
  {
    id: 'mcq-10',
    test: 'PIEAS Test',
    subject: 'Mathematics',
    topic: 'Definite Integrals',
    difficulty: 'Hard',
    question: 'Evaluate the definite integral ∫ from 0 to π/2 of (sin x) / (sin x + cos x) dx:',
    options: ['π/4', 'π/2', '1', '0'],
    correctAnswerIndex: 0,
    explanation: 'Using king\'s property ∫_0^a f(x)dx = ∫_0^a f(a-x)dx, let I = ∫_0^(π/2) sin x / (sin x + cos x) dx. Then I = ∫_0^(π/2) cos x / (cos x + sin x) dx. Adding both: 2I = ∫_0^(π/2) 1 dx = π/2, so I = π/4.'
  },
  {
    id: 'mcq-11',
    test: 'NED Test',
    subject: 'Mathematics',
    topic: 'Vectors & 3D Geometry',
    difficulty: 'Medium',
    question: 'If vectors a = 2i + 3j - k and b = -i + 2j + 4k, what is the scalar product a · b?',
    options: ['0 (orthogonal)', '4', '-8', '8'],
    correctAnswerIndex: 0,
    explanation: 'a · b = (2)(-1) + (3)(2) + (-1)(4) = -2 + 6 - 4 = 0. The vectors are perpendicular/orthogonal.'
  },
  {
    id: 'mcq-12',
    test: 'NTS-NAT / BUITEMS',
    subject: 'Analytical Reasoning',
    topic: 'Critical Sequences',
    difficulty: 'Medium',
    question: 'Identify the next number in the series: 3, 7, 15, 31, 63, ?',
    options: ['127', '126', '125', '95'],
    correctAnswerIndex: 0,
    explanation: 'Each term is (previous × 2) + 1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1=127. Alternatively, differences are 4, 8, 16, 32, 64 (powers of 2).'
  },
  {
    id: 'mcq-13',
    test: 'ETEA Engineering',
    subject: 'Chemistry',
    topic: 'Electrochemistry',
    difficulty: 'Medium',
    question: 'What is the standard EMF of a Daniel cell (Zn/Zn²⁺ || Cu²⁺/Cu) under standard state conditions (25°C, 1 M)?',
    options: ['1.10 V', '0.76 V', '0.34 V', '1.50 V'],
    correctAnswerIndex: 0,
    explanation: 'E°_cell = E°_cathode - E°_anode = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = +0.34 V - (-0.76 V) = +1.10 V.'
  }
];
