export interface DegreeProgram {
  id: string;
  name: string;
  code: string;
  discipline: 'Computing & IT' | 'Engineering' | 'Medical & Health' | 'Business & Management' | 'Natural Sciences' | 'Social Sciences';
  durationYears: number;
  eligibility: {
    minFscPercentage: number;
    requiredSubjects: string[];
    description: string;
  };
  previousClosingMerits: {
    year2024: number;
    year2023: number;
    year2022?: number;
  };
  seatsOpenMerit?: number;
}

export interface EntryTestInfo {
  testName: string;
  conductingBody: string;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: boolean;
  subjectsBreakdown: { subject: string; mcqs: number; weightPercentage: number }[];
  description: string;
  officialSamplePaperUrl: string;
  recommendedBooks: string[];
}

export interface ScholarshipInfo {
  id: string;
  name: string;
  type: 'Need-Based' | 'Merit-Based' | 'Full-Ride / Endowment' | 'Government / Quota';
  coverage: string; // e.g. "100% Tuition Waiver + Monthly Stipend"
  eligibility: string;
  deadlineOrCycle: string;
  applicationMethod: string;
  officialLink?: string;
  donorOrFund?: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  province: 'Islamabad' | 'Punjab' | 'Sindh' | 'KPK' | 'Balochistan' | 'AJK';
  sector: 'Public' | 'Private' | 'Autonomous';
  ranking: string;
  website: string;
  admissionPortalUrl: string;
  samplePapersUrl: string;
  isVerified: boolean; // clearly distinguish verified official info vs demo data
  dataStatusNotice: string;
  meritFormula: {
    id: string;
    description: string;
    weights: {
      matric: number;
      fsc: number;
      entryTest: number;
    };
    explanation: string;
  };
  acceptedEntryTests: string[];
  entryTestDetails?: EntryTestInfo;
  scholarships?: ScholarshipInfo[];
  programs: DegreeProgram[];
  feePerSemesterPkr?: string;
  hostelAvailable: boolean;
}

export const PAK_UNIVERSITIES: University[] = [
  {
    id: 'nust-islamabad',
    name: 'National University of Sciences & Technology',
    shortName: 'NUST',
    city: 'Islamabad',
    province: 'Islamabad',
    sector: 'Public',
    ranking: '#1 Engineering & Technology in Pakistan (QS World Top 350)',
    website: 'https://nust.edu.pk',
    admissionPortalUrl: 'https://nust.edu.pk/admissions/undergraduate/',
    samplePapersUrl: 'https://nust.edu.pk/admissions/undergraduate/net-instructions-sample-papers/',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on NUST Undergraduate Prospectus 2024-2025.',
    meritFormula: {
      id: 'nust-formula',
      description: 'NET 75% + FSc 15% + Matric 10%',
      weights: { matric: 10, fsc: 15, entryTest: 75 },
      explanation: 'NUST weights the Entry Test (NET) heavily at 75%. Intermediate (Part-1 or complete) carries 15% and Matriculation/O-Levels carries 10%.'
    },
    acceptedEntryTests: ['NET (Series 1, 2, 3, 4)', 'SAT / ACT (International stream)'],
    entryTestDetails: {
      testName: 'NUST Entry Test (NET - Engineering & Computing)',
      conductingBody: 'NUST Admission Directorate',
      totalMarks: 200,
      durationMinutes: 180,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'Mathematics / Biology', mcqs: 80, weightPercentage: 40 },
        { subject: 'Physics', mcqs: 60, weightPercentage: 30 },
        { subject: 'Chemistry / Computer Science', mcqs: 30, weightPercentage: 15 },
        { subject: 'English', mcqs: 20, weightPercentage: 10 },
        { subject: 'Intelligence & Analytical', mcqs: 10, weightPercentage: 5 }
      ],
      description: 'Computer-based test conducted at NUST H-12 Islamabad campus and paper-based in Karachi & Quetta.',
      officialSamplePaperUrl: 'https://nust.edu.pk/admissions/undergraduate/net-instructions-sample-papers/',
      recommendedBooks: ['KIPS FUNG Series', 'Punjab Textbook Board (PTB) Math & Physics', 'NUST OET Past MCQ Books']
    },
    programs: [
      {
        id: 'nust-cs',
        name: 'BS Computer Science',
        code: 'CS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics', 'Chemistry or Computer Science'],
          description: 'Minimum 60% aggregate in SSC and HSSC (Pre-Engineering, Pre-Medical with Additional Math, or ICS).'
        },
        previousClosingMerits: { year2024: 78.45, year2023: 77.90, year2022: 77.10 }
      },
      {
        id: 'nust-se',
        name: 'BS Software Engineering',
        code: 'SE',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics', 'Chemistry or Computer Science'],
          description: 'Offered at SEECS Islamabad and MCS Rawalpindi.'
        },
        previousClosingMerits: { year2024: 79.15, year2023: 78.60, year2022: 78.00 }
      },
      {
        id: 'nust-ai',
        name: 'BS Artificial Intelligence',
        code: 'AI',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'HSSC Pre-Engineering, ICS or equivalent with minimum 60% marks.'
        },
        previousClosingMerits: { year2024: 77.60, year2023: 77.10 }
      },
      {
        id: 'nust-ds',
        name: 'BS Data Science',
        code: 'DS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'Minimum 60% marks in both SSC and HSSC.'
        },
        previousClosingMerits: { year2024: 76.85, year2023: 76.20 }
      },
      {
        id: 'nust-ee',
        name: 'BS Electrical Engineering',
        code: 'EE',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'FSc Pre-Engineering with 60% minimum.'
        },
        previousClosingMerits: { year2024: 70.80, year2023: 71.40, year2022: 72.10 }
      },
      {
        id: 'nust-me',
        name: 'BS Mechanical Engineering',
        code: 'ME',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'SMME Islamabad Campus.'
        },
        previousClosingMerits: { year2024: 68.90, year2023: 69.80, year2022: 70.50 }
      }
    ],
    feePerSemesterPkr: '185,000 - 215,000 PKR',
    hostelAvailable: true
  },
  {
    id: 'fast-nuces',
    name: 'National University of Computer and Emerging Sciences',
    shortName: 'FAST-NUCES',
    city: 'Islamabad / Lahore / Karachi / Peshawar / CFD',
    province: 'Islamabad',
    sector: 'Private',
    ranking: 'Top Tier Computing Institution in Pakistan (Industry Preferred)',
    website: 'https://www.nu.edu.pk',
    admissionPortalUrl: 'https://nu.edu.pk/admissions',
    samplePapersUrl: 'https://nu.edu.pk/Admissions/TestPattern',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on FAST-NUCES 2024 admissions guidelines.',
    meritFormula: {
      id: 'fast-formula',
      description: 'NU Entry Test 50% + HSSC/Intermediate 50%',
      weights: { matric: 0, fsc: 50, entryTest: 50 },
      explanation: 'FAST calculates merit primarily as 50% NU Test and 50% FSc Part-1/Intermediate. Matriculation is not factored in NU test aggregate calculation.'
    },
    acceptedEntryTests: ['NU Online Admission Test', 'NTS NAT-IE/ICS', 'SAT-I'],
    entryTestDetails: {
      testName: 'FAST NU Admission Test',
      conductingBody: 'FAST-NUCES Examination Wing',
      totalMarks: 100,
      durationMinutes: 120,
      negativeMarking: true,
      subjectsBreakdown: [
        { subject: 'Advanced Mathematics', mcqs: 50, weightPercentage: 50 },
        { subject: 'Basic Mathematics', mcqs: 20, weightPercentage: 20 },
        { subject: 'Analytical Reasoning & IQ', mcqs: 20, weightPercentage: 20 },
        { subject: 'English', mcqs: 30, weightPercentage: 10 }
      ],
      description: 'Computer-based test with sectional time limits and -0.25 negative marking for incorrect answers.',
      officialSamplePaperUrl: 'https://nu.edu.pk/Admissions/TestPattern',
      recommendedBooks: ['KIPS Math Book', 'Dogar FAST Test Guide', 'Pre-Engineering Inter Part 1 & 2 Textbooks']
    },
    programs: [
      {
        id: 'fast-cs-isb',
        name: 'BS Computer Science (Islamabad Campus)',
        code: 'BSCS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'At least 50% marks in Intermediate (HSSC) with Mathematics as a major subject.'
        },
        previousClosingMerits: { year2024: 74.80, year2023: 73.60, year2022: 72.80 }
      },
      {
        id: 'fast-se-isb',
        name: 'BS Software Engineering (Islamabad Campus)',
        code: 'BSSE',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'Minimum 50% marks in FSc Pre-Eng, ICS or General Science with Maths.'
        },
        previousClosingMerits: { year2024: 73.20, year2023: 72.40, year2022: 71.90 }
      },
      {
        id: 'fast-ai-isb',
        name: 'BS Artificial Intelligence',
        code: 'BSAI',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'Offered across Islamabad, Lahore, and Karachi campuses.'
        },
        previousClosingMerits: { year2024: 73.50, year2023: 72.80 }
      },
      {
        id: 'fast-cs-lhr',
        name: 'BS Computer Science (Lahore Campus)',
        code: 'BSCS-LHR',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'Minimum 50% in Intermediate with Mathematics.'
        },
        previousClosingMerits: { year2024: 76.40, year2023: 75.10, year2022: 74.30 }
      },
      {
        id: 'fast-cs-khi',
        name: 'BS Computer Science (Karachi Campus)',
        code: 'BSCS-KHI',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'Minimum 50% in Intermediate with Mathematics.'
        },
        previousClosingMerits: { year2024: 69.80, year2023: 68.90, year2022: 67.50 }
      }
    ],
    feePerSemesterPkr: '210,000 - 240,000 PKR',
    hostelAvailable: false
  },
  {
    id: 'uet-lahore',
    name: 'University of Engineering and Technology, Lahore',
    shortName: 'UET Lahore',
    city: 'Lahore',
    province: 'Punjab',
    sector: 'Public',
    ranking: 'Oldest & Premier Public Engineering University in Punjab',
    website: 'https://uet.edu.pk',
    admissionPortalUrl: 'https://admission.uet.edu.pk',
    samplePapersUrl: 'https://admission.uet.edu.pk/Modules/EntryTest/Default.aspx',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on UET Lahore Undergraduate Prospectus 2024.',
    meritFormula: {
      id: 'uet-formula',
      description: 'ECAT 33% + FSc 50% + Matric 17%',
      weights: { matric: 17, fsc: 50, entryTest: 33 },
      explanation: 'UET Lahore calculates aggregate using ECAT Entry Test (33%), FSc Pre-Engineering/ICS (50%), and Matriculation (17%).'
    },
    acceptedEntryTests: ['Combined Entry Test (ECAT)'],
    entryTestDetails: {
      testName: 'ECAT (Engineering College Admission Test)',
      conductingBody: 'UET Lahore for Punjab Engineering Colleges',
      totalMarks: 400,
      durationMinutes: 100,
      negativeMarking: true,
      subjectsBreakdown: [
        { subject: 'Mathematics', mcqs: 30, weightPercentage: 30 },
        { subject: 'Physics', mcqs: 30, weightPercentage: 30 },
        { subject: 'Chemistry / Computer Science / Statistics', mcqs: 30, weightPercentage: 30 },
        { subject: 'English', mcqs: 10, weightPercentage: 10 }
      ],
      description: 'Computer-based test with 100 questions (4 marks for correct, -1 mark for wrong answer). Total 400 marks.',
      officialSamplePaperUrl: 'https://admission.uet.edu.pk',
      recommendedBooks: ['KIPS ECAT Preparatory Modules', 'Punjab Textbook Board Inter Textbooks']
    },
    programs: [
      {
        id: 'uet-cs',
        name: 'BS Computer Science',
        code: 'CS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'FSc Pre-Engineering or ICS with minimum 60% marks.'
        },
        previousClosingMerits: { year2024: 81.35, year2023: 80.20, year2022: 79.40 }
      },
      {
        id: 'uet-se',
        name: 'BS Software Engineering',
        code: 'SE',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'Minimum 60% in FSc Pre-Eng or ICS.'
        },
        previousClosingMerits: { year2024: 79.80, year2023: 78.90, year2022: 77.80 }
      },
      {
        id: 'uet-ee',
        name: 'BSc Electrical Engineering',
        code: 'EE',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'FSc Pre-Engineering with 60% minimum.'
        },
        previousClosingMerits: { year2024: 73.40, year2023: 74.20, year2022: 75.10 }
      },
      {
        id: 'uet-me',
        name: 'BSc Mechanical Engineering',
        code: 'ME',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'Main Campus Lahore Open Merit.'
        },
        previousClosingMerits: { year2024: 71.10, year2023: 72.30, year2022: 73.50 }
      },
      {
        id: 'uet-ce',
        name: 'BSc Civil Engineering',
        code: 'CE',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'Department of Civil Engineering.'
        },
        previousClosingMerits: { year2024: 67.90, year2023: 69.10, year2022: 70.80 }
      }
    ],
    feePerSemesterPkr: '65,000 - 85,000 PKR (Subsidized Public Sector)',
    hostelAvailable: true
  },
  {
    id: 'ned-karachi',
    name: 'NED University of Engineering & Technology',
    shortName: 'NED UET',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Public',
    ranking: 'Premier Engineering & Technological University of Sindh',
    website: 'https://www.neduet.edu.pk',
    admissionPortalUrl: 'https://www.neduet.edu.pk/admission',
    samplePapersUrl: 'https://www.neduet.edu.pk/pre-admission-entry-test',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on NED Prospectus 2024-2025.',
    meritFormula: {
      id: 'ned-formula',
      description: 'NED Entry Test 50% + Intermediate (HSC-I) 50%',
      weights: { matric: 0, fsc: 50, entryTest: 50 },
      explanation: 'NED University calculates aggregate as 50% NED Pre-Admission Entry Test and 50% HSC Part-1 (or complete HSC for previous year pass-outs).'
    },
    acceptedEntryTests: ['NED Pre-Admission Entry Test'],
    entryTestDetails: {
      testName: 'NED Pre-Admission Entry Test',
      conductingBody: 'NED University of Engineering & Technology',
      totalMarks: 100,
      durationMinutes: 120,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'Mathematics', mcqs: 35, weightPercentage: 35 },
        { subject: 'Physics', mcqs: 35, weightPercentage: 35 },
        { subject: 'Chemistry / Computer Science', mcqs: 20, weightPercentage: 20 },
        { subject: 'English', mcqs: 10, weightPercentage: 10 }
      ],
      description: 'Computer-based test held on NED Main Campus. Passing marks: 50 out of 100.',
      officialSamplePaperUrl: 'https://www.neduet.edu.pk',
      recommendedBooks: ['Sindh Textbook Board Inter Textbooks', 'Anees Hussain NED Prep Guide']
    },
    programs: [
      {
        id: 'ned-cs',
        name: 'BS Computer Science (BCIT)',
        code: 'CSIT',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'HSC Pre-Engineering, Pre-Medical with Additional Math, or Computer Science.'
        },
        previousClosingMerits: { year2024: 84.60, year2023: 83.80, year2022: 82.50 }
      },
      {
        id: 'ned-se',
        name: 'BE Software Engineering',
        code: 'SE',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics', 'Chemistry'],
          description: 'PEC Accredited Software Engineering program.'
        },
        previousClosingMerits: { year2024: 83.40, year2023: 82.50, year2022: 81.20 }
      },
      {
        id: 'ned-ai',
        name: 'BS Artificial Intelligence',
        code: 'AI',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'HSC with at least 60% marks.'
        },
        previousClosingMerits: { year2024: 82.80, year2023: 81.90 }
      },
      {
        id: 'ned-ee',
        name: 'BE Electrical Engineering',
        code: 'EE',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'Regular Karachi Domicile Seat.'
        },
        previousClosingMerits: { year2024: 76.50, year2023: 77.20, year2022: 78.00 }
      },
      {
        id: 'ned-me',
        name: 'BE Mechanical Engineering',
        code: 'ME',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'Mechanical Engineering Department.'
        },
        previousClosingMerits: { year2024: 74.20, year2023: 75.30, year2022: 76.10 }
      }
    ],
    feePerSemesterPkr: '48,000 - 65,000 PKR (Affordable Public Sector)',
    hostelAvailable: true
  },
  {
    id: 'comsats-islamabad',
    name: 'COMSATS University Islamabad',
    shortName: 'CUI',
    city: 'Islamabad / Lahore / Abbottabad / Wah / Attock / Sahiwal',
    province: 'Islamabad',
    sector: 'Public',
    ranking: 'Top 3 General / IT Public University in Pakistan',
    website: 'https://www.comsats.edu.pk',
    admissionPortalUrl: 'https://admissions.comsats.edu.pk',
    samplePapersUrl: 'https://admissions.comsats.edu.pk/Home/TestPattern',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on COMSATS Admissions 2024-2025.',
    meritFormula: {
      id: 'comsats-formula',
      description: 'NTS NAT 50% + FSc 40% + Matric 10%',
      weights: { matric: 10, fsc: 40, entryTest: 50 },
      explanation: 'COMSATS uses NTS NAT (50%), Intermediate/HSSC (40%), and Matric/SSC (10%) to formulate aggregate for all undergraduate computing and engineering degrees.'
    },
    acceptedEntryTests: ['NTS NAT-IE / NAT-ICS / NAT-IM', 'CUI In-house NTS Test'],
    entryTestDetails: {
      testName: 'NTS National Aptitude Test (NAT)',
      conductingBody: 'National Testing Service (NTS)',
      totalMarks: 100,
      durationMinutes: 120,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'English (Verbal)', mcqs: 20, weightPercentage: 20 },
        { subject: 'Analytical Reasoning', mcqs: 20, weightPercentage: 20 },
        { subject: 'Quantitative (Math)', mcqs: 20, weightPercentage: 20 },
        { subject: 'Subject Knowledge (Math/Phys/Chem/CS)', mcqs: 30, weightPercentage: 30 }
      ],
      description: 'Multiple choice test conducted monthly throughout Pakistan.',
      officialSamplePaperUrl: 'https://www.nts.org.pk',
      recommendedBooks: ['Dogar NTS NAT Book', 'Caravan NTS Guide']
    },
    programs: [
      {
        id: 'cui-cs-isb',
        name: 'BS Computer Science (Islamabad)',
        code: 'BSCS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'Intermediate or equivalent with Mathematics having minimum 50% marks.'
        },
        previousClosingMerits: { year2024: 83.60, year2023: 82.70, year2022: 81.90 }
      },
      {
        id: 'cui-se-isb',
        name: 'BS Software Engineering (Islamabad)',
        code: 'BSSE',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'Minimum 50% marks in Intermediate with Math.'
        },
        previousClosingMerits: { year2024: 82.10, year2023: 81.20, year2022: 80.50 }
      },
      {
        id: 'cui-ai-isb',
        name: 'BS Artificial Intelligence',
        code: 'BSAI',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'HSSC with Mathematics at least 50% marks.'
        },
        previousClosingMerits: { year2024: 81.40, year2023: 80.50 }
      },
      {
        id: 'cui-cs-lhr',
        name: 'BS Computer Science (Lahore)',
        code: 'BSCS-LHR',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'Lahore Defence Road Campus.'
        },
        previousClosingMerits: { year2024: 82.20, year2023: 81.10, year2022: 80.20 }
      }
    ],
    feePerSemesterPkr: '125,000 - 145,000 PKR',
    hostelAvailable: true
  },
  {
    id: 'giki-swabi',
    name: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    shortName: 'GIKI',
    city: 'Topi, Swabi',
    province: 'KPK',
    sector: 'Private',
    ranking: 'Top Private Engineering & Technology Institute in Pakistan',
    website: 'https://giki.edu.pk',
    admissionPortalUrl: 'https://admissions.giki.edu.pk',
    samplePapersUrl: 'https://giki.edu.pk/admissions/admissions-undergraduates/ugrad-sample-paper/',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on GIKI Prospectus 2024.',
    meritFormula: {
      id: 'giki-formula',
      description: 'GIKI Entry Test 85% + HSSC-I 15%',
      weights: { matric: 0, fsc: 15, entryTest: 85 },
      explanation: 'GIKI places the highest emphasis on its own admission test (85%), with HSSC-I/O-Level performance contributing the remaining 15%.'
    },
    acceptedEntryTests: ['GIKI Admission Test', 'SAT / ACT'],
    entryTestDetails: {
      testName: 'GIKI Admission Test',
      conductingBody: 'GIKI Admissions Office',
      totalMarks: 200,
      durationMinutes: 120,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'Mathematics', mcqs: 30, weightPercentage: 50 },
        { subject: 'Physics', mcqs: 30, weightPercentage: 40 },
        { subject: 'English', mcqs: 20, weightPercentage: 10 }
      ],
      description: 'Challenging test focusing on conceptual depth in Mathematics and Physics.',
      officialSamplePaperUrl: 'https://giki.edu.pk/admissions/admissions-undergraduates/ugrad-sample-paper/',
      recommendedBooks: ['A-Level Physics/Maths topical papers', 'Advanced PTB Concepts']
    },
    programs: [
      {
        id: 'giki-cs',
        name: 'BS Computer Science',
        code: 'CS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'HSSC Pre-Engineering, Pre-Medical with Add. Math, or ICS with 60% marks.'
        },
        previousClosingMerits: { year2024: 77.20, year2023: 76.50, year2022: 75.80 }
      },
      {
        id: 'giki-ai',
        name: 'BS Artificial Intelligence',
        code: 'AI',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'Minimum 60% marks in FSc Pre-Engineering / ICS.'
        },
        previousClosingMerits: { year2024: 76.40, year2023: 75.60 }
      },
      {
        id: 'giki-me',
        name: 'BS Mechanical Engineering',
        code: 'ME',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'Faculty of Mechanical Engineering.'
        },
        previousClosingMerits: { year2024: 67.50, year2023: 68.80, year2022: 69.90 }
      }
    ],
    feePerSemesterPkr: '425,000 - 460,000 PKR (Residential)',
    hostelAvailable: true
  },
  {
    id: 'kemu-uhs-medical',
    name: 'King Edward Medical University / UHS Public Medical Colleges',
    shortName: 'KEMU / MDCAT Punjab',
    city: 'Lahore',
    province: 'Punjab',
    sector: 'Public',
    ranking: '#1 Medical College in Punjab & Pakistan',
    website: 'https://kemu.edu.pk',
    admissionPortalUrl: 'https://uhs.edu.pk',
    samplePapersUrl: 'https://pmdc.pk',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria under Pakistan Medical & Dental Council (PM&DC) regulations.',
    meritFormula: {
      id: 'pmdc-formula',
      description: 'MDCAT 50% + FSc Pre-Medical 40% + Matric 10%',
      weights: { matric: 10, fsc: 40, entryTest: 50 },
      explanation: 'Statutory formula mandated by PM&DC for all public and private MBBS/BDS admissions across Pakistan: MDCAT (50%), FSc Pre-Medical (40%), and Matriculation (10%).'
    },
    acceptedEntryTests: ['MDCAT (Medical & Dental College Admission Test)'],
    entryTestDetails: {
      testName: 'MDCAT (PM&DC Standardized Test)',
      conductingBody: 'PM&DC through Provincial Admitting Universities (UHS, DUHS, KMU, BUMHS, SZABMU)',
      totalMarks: 200,
      durationMinutes: 210,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'Biology', mcqs: 68, weightPercentage: 34 },
        { subject: 'Chemistry', mcqs: 54, weightPercentage: 27 },
        { subject: 'Physics', mcqs: 54, weightPercentage: 27 },
        { subject: 'English', mcqs: 18, weightPercentage: 9 },
        { subject: 'Logical Reasoning', mcqs: 6, weightPercentage: 3 }
      ],
      description: 'Mandatory single entrance exam for all medical and dental colleges across Pakistan.',
      officialSamplePaperUrl: 'https://pmdc.pk',
      recommendedBooks: ['National MDCAT Syllabus by PMDC', 'KIPS MDCAT Prep', 'Step by PGC Pre-Med Modules']
    },
    programs: [
      {
        id: 'kemu-mbbs',
        name: 'MBBS (King Edward Medical University)',
        code: 'MBBS',
        discipline: 'Medical & Health',
        durationYears: 5,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Biology', 'Chemistry', 'Physics'],
          description: 'Minimum 60% in FSc Pre-Medical and minimum 55% in MDCAT for MBBS.'
        },
        previousClosingMerits: { year2024: 93.85, year2023: 93.45, year2022: 92.95 }
      },
      {
        id: 'aimc-mbbs',
        name: 'MBBS (Allama Iqbal Medical College)',
        code: 'AIMC-MBBS',
        discipline: 'Medical & Health',
        durationYears: 5,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Biology', 'Chemistry', 'Physics'],
          description: 'Open merit Punjab seats.'
        },
        previousClosingMerits: { year2024: 92.92, year2023: 92.50, year2022: 92.10 }
      },
      {
        id: 'punjab-lowest-mbbs',
        name: 'MBBS (Punjab Public Sector Lowest Cutoff)',
        code: 'PUNJAB-MIN-MBBS',
        discipline: 'Medical & Health',
        durationYears: 5,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Biology', 'Chemistry', 'Physics'],
          description: 'Last public medical college seat in Punjab (e.g. DG Khan / Sahiwal).'
        },
        previousClosingMerits: { year2024: 91.45, year2023: 91.10, year2022: 90.75 }
      },
      {
        id: 'punjab-public-bds',
        name: 'BDS (Punjab Public Sector Cutoff)',
        code: 'BDS',
        discipline: 'Medical & Health',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Biology', 'Chemistry', 'Physics'],
          description: 'De\'Montmorency College of Dentistry and allied institutes.'
        },
        previousClosingMerits: { year2024: 91.10, year2023: 90.70, year2022: 90.25 }
      }
    ],
    feePerSemesterPkr: '35,000 - 55,000 PKR / year (Heavily subsidized by Government)',
    hostelAvailable: true
  },
  {
    id: 'duhs-karachi',
    name: 'Dow University of Health Sciences',
    shortName: 'DUHS',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Public',
    ranking: 'Top Medical University in Sindh',
    website: 'https://www.duhs.edu.pk',
    admissionPortalUrl: 'https://www.duhs.edu.pk/admissions',
    samplePapersUrl: 'https://www.duhs.edu.pk',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on Sindh Admitting Authority regulations.',
    meritFormula: {
      id: 'duhs-pmdc-formula',
      description: 'MDCAT 50% + HSC Pre-Med 40% + SSC 10%',
      weights: { matric: 10, fsc: 40, entryTest: 50 },
      explanation: 'Follows PM&DC statutory regulations: MDCAT (50%), HSC Pre-Medical (40%), and SSC (10%).'
    },
    acceptedEntryTests: ['Sindh MDCAT (DUHS)'],
    entryTestDetails: {
      testName: 'Sindh MDCAT',
      conductingBody: 'Dow University of Health Sciences (Admitting Body for Sindh)',
      totalMarks: 200,
      durationMinutes: 210,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'Biology', mcqs: 68, weightPercentage: 34 },
        { subject: 'Chemistry', mcqs: 54, weightPercentage: 27 },
        { subject: 'Physics', mcqs: 54, weightPercentage: 27 },
        { subject: 'English', mcqs: 18, weightPercentage: 9 },
        { subject: 'Logical Reasoning', mcqs: 6, weightPercentage: 3 }
      ],
      description: 'Conducted for all public and private medical colleges in Sindh.',
      officialSamplePaperUrl: 'https://www.duhs.edu.pk',
      recommendedBooks: ['Sindh Textbook Board Biology & Chemistry']
    },
    programs: [
      {
        id: 'duhs-dmc-mbbs',
        name: 'MBBS (Dow Medical College, Karachi)',
        code: 'DMC-MBBS',
        discipline: 'Medical & Health',
        durationYears: 5,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Biology', 'Chemistry', 'Physics'],
          description: 'Karachi Domicile Open Merit.'
        },
        previousClosingMerits: { year2024: 90.65, year2023: 90.15, year2022: 89.70 }
      },
      {
        id: 'duhs-dimc-mbbs',
        name: 'MBBS (Dow International Medical College)',
        code: 'DIMC-MBBS',
        discipline: 'Medical & Health',
        durationYears: 5,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Biology', 'Chemistry', 'Physics'],
          description: 'Local and Overseas stream.'
        },
        previousClosingMerits: { year2024: 87.40, year2023: 86.80 }
      }
    ],
    feePerSemesterPkr: '45,000 - 65,000 PKR / year',
    hostelAvailable: true
  },
  {
    id: 'iba-karachi',
    name: 'Institute of Business Administration',
    shortName: 'IBA Karachi',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Public',
    ranking: '#1 Business School in Pakistan (AACSB & NBEAC Accredited)',
    website: 'https://www.iba.edu.pk',
    admissionPortalUrl: 'https://admissions.iba.edu.pk',
    samplePapersUrl: 'https://www.iba.edu.pk/sample-test-papers.php',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on IBA Karachi Undergraduate Admissions 2024.',
    meritFormula: {
      id: 'iba-formula',
      description: 'IBA Aptitude Test / SAT Cutoffs + Interview',
      weights: { matric: 0, fsc: 0, entryTest: 100 },
      explanation: 'IBA conducts a standardized aptitude test with strict section cutoffs in Mathematics and English. Candidates clearing test cutoffs are either admitted directly or shortlisted for an interview.'
    },
    acceptedEntryTests: ['IBA Aptitude Test (Round 1 & Round 2)', 'SAT-I (Min 600 Math & 600 EBRW for exemption)'],
    entryTestDetails: {
      testName: 'IBA Karachi Aptitude Test',
      conductingBody: 'IBA Testing Service',
      totalMarks: 200,
      durationMinutes: 120,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'Mathematics (Basic + Advanced)', mcqs: 50, weightPercentage: 50 },
        { subject: 'English (Reading Comprehension & Grammar)', mcqs: 50, weightPercentage: 50 }
      ],
      description: 'Sectional cutoff test. Failing either Math or English section leads to disqualification regardless of total marks.',
      officialSamplePaperUrl: 'https://www.iba.edu.pk/sample-test-papers.php',
      recommendedBooks: ['Barron\'s SAT Math & Critical Reading', 'IBA Past Papers by Anees Hussain']
    },
    programs: [
      {
        id: 'iba-bba',
        name: 'Bachelor of Business Administration (BBA)',
        code: 'BBA',
        discipline: 'Business & Management',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 65,
          requiredSubjects: ['Any stream'],
          description: 'HSSC / A-Levels with at least 65% marks.'
        },
        previousClosingMerits: { year2024: 73.0, year2023: 71.5, year2022: 70.0 }
      },
      {
        id: 'iba-cs',
        name: 'BS Computer Science',
        code: 'BSCS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics'],
          description: 'Intermediate / A-Levels with Mathematics having at least 60% marks.'
        },
        previousClosingMerits: { year2024: 71.5, year2023: 70.2, year2022: 69.0 }
      }
    ],
    feePerSemesterPkr: '340,000 - 390,000 PKR',
    hostelAvailable: true
  },
  {
    id: 'pieas-islamabad',
    name: 'Pakistan Institute of Engineering and Applied Sciences',
    shortName: 'PIEAS',
    city: 'Islamabad (Nilore)',
    province: 'Islamabad',
    sector: 'Public',
    ranking: 'Top Nuclear & Applied Engineering Institute (PAEC)',
    website: 'https://pieas.edu.pk',
    admissionPortalUrl: 'https://admissions.pieas.edu.pk',
    samplePapersUrl: 'https://admissions.pieas.edu.pk/sample_paper.html',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on PIEAS Admissions 2024-2025.',
    meritFormula: {
      id: 'pieas-formula',
      description: 'PIEAS Written Test 60% + FSc 25% + Matric 15%',
      weights: { matric: 15, fsc: 25, entryTest: 60 },
      explanation: 'PIEAS awards 60% weight to its written admission test, 25% to FSc, and 15% to Matriculation.'
    },
    acceptedEntryTests: ['PIEAS Written Admission Test'],
    entryTestDetails: {
      testName: 'PIEAS Written Admission Test',
      conductingBody: 'PIEAS Examination Directorate',
      totalMarks: 100,
      durationMinutes: 180,
      negativeMarking: true,
      subjectsBreakdown: [
        { subject: 'Mathematics', mcqs: 30, weightPercentage: 30 },
        { subject: 'Physics', mcqs: 30, weightPercentage: 30 },
        { subject: 'Chemistry / Computer Science', mcqs: 30, weightPercentage: 30 },
        { subject: 'General Knowledge & English', mcqs: 10, weightPercentage: 10 }
      ],
      description: 'Pen-and-paper test with negative marking (-1 for incorrect answer).',
      officialSamplePaperUrl: 'https://admissions.pieas.edu.pk/sample_paper.html',
      recommendedBooks: ['PIEAS Guide by Dogar', 'PTB FSc Physics and Mathematics Textbooks']
    },
    programs: [
      {
        id: 'pieas-cs',
        name: 'BS Computer Science',
        code: 'BSCS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'At least 60% in both Matric and FSc Pre-Engineering / ICS.'
        },
        previousClosingMerits: { year2024: 78.10, year2023: 77.20 }
      },
      {
        id: 'pieas-ee',
        name: 'BS Electrical Engineering',
        code: 'BSEE',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics', 'Chemistry'],
          description: 'PEC recognized degree.'
        },
        previousClosingMerits: { year2024: 72.80, year2023: 73.50 }
      }
    ],
    feePerSemesterPkr: '110,000 - 130,000 PKR',
    hostelAvailable: true
  },
  {
    id: 'lums-lahore',
    name: 'Lahore University of Management Sciences',
    shortName: 'LUMS',
    city: 'Lahore',
    province: 'Punjab',
    sector: 'Private',
    ranking: 'Pakistan’s Leading Premier Private University (AACSB Accredited)',
    website: 'https://lums.edu.pk',
    admissionPortalUrl: 'https://lums.edu.pk/admissions',
    samplePapersUrl: 'https://lums.edu.pk/admissions/undergraduate',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on LUMS Admissions 2024-2025.',
    meritFormula: {
      id: 'lums-holistic',
      description: 'Holistic Review: SAT/LCAT + Academic Record + Extracurriculars',
      weights: { matric: 20, fsc: 20, entryTest: 60 },
      explanation: 'LUMS uses a holistic review process: Academic grades (Matric/O-Level min 80%), SAT score (target 1350+ for SBASSE CS), personal statement, and leadership profile.'
    },
    acceptedEntryTests: ['SAT-I', 'LCAT (LUMS Common Admission Test)', 'ACT'],
    programs: [
      {
        id: 'lums-cs',
        name: 'BS Computer Science (SBASSE)',
        code: 'BSCS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 70,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'Syed Babar Ali School of Science and Engineering (SBASSE).'
        },
        previousClosingMerits: { year2024: 85.50, year2023: 84.80 }
      },
      {
        id: 'lums-acct-fin',
        name: 'BSc (Hons) Accounting and Finance (SDSB)',
        code: 'ACF',
        discipline: 'Business & Management',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 70,
          requiredSubjects: ['Any stream'],
          description: 'Suleman Dawood School of Business.'
        },
        previousClosingMerits: { year2024: 83.20, year2023: 82.50 }
      }
    ],
    feePerSemesterPkr: '580,000 - 640,000 PKR (Generous financial aid & NOP available)',
    hostelAvailable: true
  },
  {
    id: 'buitems-quetta',
    name: 'Balochistan University of Information Technology, Engineering and Management Sciences',
    shortName: 'BUITEMS',
    city: 'Quetta',
    province: 'Balochistan',
    sector: 'Public',
    ranking: 'Premier IT & Engineering University in Balochistan (HEC Ranked)',
    website: 'https://www.buitms.edu.pk',
    admissionPortalUrl: 'https://buitms.edu.pk/admissions',
    samplePapersUrl: 'https://buitms.edu.pk/admissions',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on BUITEMS Undergraduate Prospectus 2024.',
    meritFormula: {
      id: 'buitems-formula',
      description: 'NTS-NAT / BUITEMS Test 50% + FSc 40% + Matric 10%',
      weights: { matric: 10, fsc: 40, entryTest: 50 },
      explanation: 'BUITEMS weights entry test (NAT or institutional test) at 50%, Intermediate at 40%, and Matriculation at 10%.'
    },
    acceptedEntryTests: ['NTS NAT-IE / NAT-ICS', 'BUITEMS Pre-Admission Entry Test'],
    entryTestDetails: {
      testName: 'BUITEMS Admission & NTS NAT Test',
      conductingBody: 'National Testing Service (NTS) / BUITEMS',
      totalMarks: 100,
      durationMinutes: 120,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'Analytical & Quantitative Reasoning', mcqs: 40, weightPercentage: 40 },
        { subject: 'Subject Specific (Maths/Physics)', mcqs: 40, weightPercentage: 40 },
        { subject: 'English', mcqs: 20, weightPercentage: 20 }
      ],
      description: 'Paper-based standardized test assessing academic preparedness and problem-solving.',
      officialSamplePaperUrl: 'https://nts.org.pk',
      recommendedBooks: ['Dogar NTS NAT Guide', 'Textbook Board Balochistan / Punjab']
    },
    programs: [
      {
        id: 'buitems-cs',
        name: 'BS Computer Science',
        code: 'BSCS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'HSSC with Mathematics or Pre-Engineering / ICS with minimum 50% marks.'
        },
        previousClosingMerits: { year2024: 68.20, year2023: 67.50 }
      },
      {
        id: 'buitems-se',
        name: 'BS Software Engineering',
        code: 'BSSE',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 50,
          requiredSubjects: ['Mathematics'],
          description: 'NCEAC recognized program.'
        },
        previousClosingMerits: { year2024: 66.80, year2023: 65.90 }
      }
    ],
    feePerSemesterPkr: '65,000 - 85,000 PKR (Subsidized Public Higher Education)',
    hostelAvailable: true
  },
  {
    id: 'uet-peshawar',
    name: 'University of Engineering and Technology, Peshawar',
    shortName: 'UET Peshawar',
    city: 'Peshawar',
    province: 'KPK',
    sector: 'Public',
    ranking: 'Leading Public Engineering Institution in Khyber Pakhtunkhwa',
    website: 'https://www.uetpeshawar.edu.pk',
    admissionPortalUrl: 'https://enggentrancetest.pk',
    samplePapersUrl: 'https://etea.edu.pk',
    isVerified: true,
    dataStatusNotice: 'Verified official criteria based on UET Peshawar & ETEA 2024 Prospectus.',
    meritFormula: {
      id: 'uet-pesh-formula',
      description: 'ETEA Test 33% + FSc 50% + Matric 17%',
      weights: { matric: 17, fsc: 50, entryTest: 33 },
      explanation: 'UET Peshawar calculates entrance aggregate using KPK ETEA Test (33%), FSc (50%), and Matriculation (17%).'
    },
    acceptedEntryTests: ['ETEA Engineering Entrance Test'],
    entryTestDetails: {
      testName: 'ETEA Engineering Entrance Test',
      conductingBody: 'Educational Testing and Evaluation Agency (ETEA) KPK',
      totalMarks: 100,
      durationMinutes: 120,
      negativeMarking: false,
      subjectsBreakdown: [
        { subject: 'Mathematics', mcqs: 40, weightPercentage: 40 },
        { subject: 'Physics', mcqs: 35, weightPercentage: 35 },
        { subject: 'Chemistry / Computer Science', mcqs: 15, weightPercentage: 15 },
        { subject: 'English', mcqs: 10, weightPercentage: 10 }
      ],
      description: 'Standardized entrance examination for engineering universities across Khyber Pakhtunkhwa.',
      officialSamplePaperUrl: 'https://etea.edu.pk',
      recommendedBooks: ['KPK Textbook Board Physics & Mathematics', 'ETEA Engineering Past MCQs by Dogar']
    },
    programs: [
      {
        id: 'uet-pesh-cs',
        name: 'BS Computer Science',
        code: 'BSCS',
        discipline: 'Computing & IT',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Mathematics', 'Physics'],
          description: 'FSc Pre-Engineering or ICS with 60% minimum marks.'
        },
        previousClosingMerits: { year2024: 73.40, year2023: 72.80 }
      },
      {
        id: 'uet-pesh-civil',
        name: 'BSc Civil Engineering',
        code: 'CE',
        discipline: 'Engineering',
        durationYears: 4,
        eligibility: {
          minFscPercentage: 60,
          requiredSubjects: ['Physics', 'Chemistry', 'Mathematics'],
          description: 'Peshawar Main Campus Open Merit.'
        },
        previousClosingMerits: { year2024: 69.50, year2023: 70.80 }
      }
    ],
    feePerSemesterPkr: '70,000 - 90,000 PKR',
    hostelAvailable: true
  }
];

import { PAK_SCHOLARSHIPS } from './scholarships';

// Hydrate scholarships for each university
PAK_UNIVERSITIES.forEach((uni) => {
  uni.scholarships = PAK_SCHOLARSHIPS.filter((s) => s.universityId === uni.id);
});

