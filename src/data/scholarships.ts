import type { ScholarshipInfo } from './universities';

export interface UniversityScholarshipItem extends ScholarshipInfo {
  universityId: string;
  universityName: string;
  universityShortName: string;
  city: string;
  province: string;
}

export const PAK_SCHOLARSHIPS: UniversityScholarshipItem[] = [
  // NUST Scholarships
  {
    id: 'nust-need-based',
    universityId: 'nust-islamabad',
    universityName: 'National University of Sciences & Technology',
    universityShortName: 'NUST',
    city: 'Islamabad',
    province: 'Islamabad',
    name: 'NUST Need-Based Financial Aid (Financial Assistance Program)',
    type: 'Need-Based',
    coverage: '100% or Partial Tuition Fee Waiver + Monthly Living Stipend & Hostel Subsidy',
    eligibility: 'Admitted undergraduate students with proven financial need (family income evaluation by Financial Aid Committee).',
    deadlineOrCycle: 'Submitted simultaneously with Undergraduate Admission Application (NET Series 1–4 cycles).',
    applicationMethod: 'Online through NUST Admission Portal under the "Financial Aid Application" tab prior to fee due date.',
    officialLink: 'https://nust.edu.pk/admissions/financial-aid-scholarships/',
    donorOrFund: 'NUST Trust Fund & NUST Alumni Endowment Fund (NAEF)'
  },
  {
    id: 'nust-merit-net',
    universityId: 'nust-islamabad',
    universityName: 'National University of Sciences & Technology',
    universityShortName: 'NUST',
    city: 'Islamabad',
    province: 'Islamabad',
    name: 'NUST High-Achiever Merit Scholarship',
    type: 'Merit-Based',
    coverage: '100% Tuition Fee Waiver for 1st Year (Renewable on maintaining SGPA/CGPA ≥ 3.50)',
    eligibility: 'Top position holders in the overall national NUST Entry Test (NET) merit list across Engineering and Computing streams.',
    deadlineOrCycle: 'Awarded automatically upon publication of the final national merit list in August/September.',
    applicationMethod: 'Automatic consideration upon qualifying among the top national NET merit positions.',
    officialLink: 'https://nust.edu.pk/admissions/financial-aid-scholarships/',
    donorOrFund: 'NUST Academic Council Merit Endowment'
  },
  {
    id: 'nust-hec-ehsaas',
    universityId: 'nust-islamabad',
    universityName: 'National University of Sciences & Technology',
    universityShortName: 'NUST',
    city: 'Islamabad',
    province: 'Islamabad',
    name: 'HEC Benazir / Ehsaas Undergraduate Scholarship at NUST',
    type: 'Government / Quota',
    coverage: '100% Full Tuition Fee Waiver + PKR 50,000 Annual Living Allowance',
    eligibility: 'Low-income family background (gross monthly household income < PKR 45,000), enrolled in regular undergraduate program.',
    deadlineOrCycle: 'Annual cycle announced by HEC (usually October–November).',
    applicationMethod: 'Online via HEC Ehsaas Scholarship Portal and physical document verification at NUST Financial Aid Office.',
    officialLink: 'https://hec.gov.pk',
    donorOrFund: 'Higher Education Commission (HEC) of Pakistan & BISP'
  },

  // FAST-NUCES Scholarships
  {
    id: 'fast-financial-aid',
    universityId: 'fast-nuces',
    universityName: 'National University of Computer and Emerging Sciences',
    universityShortName: 'FAST-NUCES',
    city: 'Islamabad / Lahore / Karachi / Peshawar / CFD',
    province: 'Islamabad',
    name: 'FAST Financial Assistance & Qarz-e-Hasna Scheme',
    type: 'Need-Based',
    coverage: '25% to 100% Tuition Fee Assistance / Interest-Free Loan payable after graduation',
    eligibility: 'Admitted students with verified genuine financial constraints who maintain good academic standing.',
    deadlineOrCycle: 'Within 2 weeks of admission confirmation and beginning of each semester.',
    applicationMethod: 'Download the Financial Aid form from Campus Academic Office and submit with parent/guardian salary slips and utility bills.',
    officialLink: 'https://nu.edu.pk/Admissions/FinancialAid',
    donorOrFund: 'FAST Foundation & Alumni Relief Fund'
  },
  {
    id: 'fast-batch-merit',
    universityId: 'fast-nuces',
    universityName: 'National University of Computer and Emerging Sciences',
    universityShortName: 'FAST-NUCES',
    city: 'Islamabad / Lahore / Karachi / Peshawar / CFD',
    province: 'Islamabad',
    name: 'FAST Semester Batch Position Merit Scholarship',
    type: 'Merit-Based',
    coverage: '1st Position: 100% Tuition Waiver · 2nd Position: 75% · 3rd Position: 50%',
    eligibility: 'Top 3 GPA holders in each academic batch/department completing full credit load with SGPA ≥ 3.67.',
    deadlineOrCycle: 'Awarded automatically at the end of each fall and spring semester examination.',
    applicationMethod: 'Automatic disbursement through the campus Finance Department based on official examination results.',
    officialLink: 'https://nu.edu.pk/Admissions/FinancialAid',
    donorOrFund: 'FAST Academic Merit Grant'
  },
  {
    id: 'fast-ihsan-trust',
    universityId: 'fast-nuces',
    universityName: 'National University of Computer and Emerging Sciences',
    universityShortName: 'FAST-NUCES',
    city: 'Islamabad / Lahore / Karachi / Peshawar / CFD',
    province: 'Islamabad',
    name: 'Ihsan Trust Qarz-e-Hasna (FAST Chapter)',
    type: 'Need-Based',
    coverage: '100% of Semester Tuition Fee paid directly to the university',
    eligibility: 'Meritorious students who cannot afford FAST fee; interest-free repayment starts only after student secures employment.',
    deadlineOrCycle: 'Open year-round prior to semester registration deadlines.',
    applicationMethod: 'Apply directly via Ihsan Trust portal with FAST recommendation letter from Dean/HOD.',
    officialLink: 'https://ihsantrust.org',
    donorOrFund: 'Ihsan Trust (Meezan Bank Subsidiary)'
  },

  // LUMS Scholarships
  {
    id: 'lums-nop',
    universityId: 'lums-lahore',
    universityName: 'Lahore University of Management Sciences',
    universityShortName: 'LUMS',
    city: 'Lahore',
    province: 'Punjab',
    name: 'LUMS National Outreach Programme (NOP) - Full Ride',
    type: 'Full-Ride / Endowment',
    coverage: '100% Tuition Waiver, Free On-Campus Hostel, Monthly Living Stipend, Books Allowance & Travel Grants',
    eligibility: 'High-performing students across Pakistan with ≥80% marks in Matric/FSc and proven financial hardship.',
    deadlineOrCycle: 'Annual intake for Intermediate Part-1 students; summer coaching session conducted in July/August.',
    applicationMethod: 'Online via LUMS NOP Portal; shortlisted candidates attend fully-funded summer coaching camp and LUMS sponsors their SAT/LCAT fees.',
    officialLink: 'https://nop.lums.edu.pk',
    donorOrFund: 'LUMS Endowment & National Outreach Programme Trust'
  },
  {
    id: 'lums-merit-aid',
    universityId: 'lums-lahore',
    universityName: 'Lahore University of Management Sciences',
    universityShortName: 'LUMS',
    city: 'Lahore',
    province: 'Punjab',
    name: 'LUMS 100-Rank Merit Scholarship (SBASSE / SDSB / HSS)',
    type: 'Merit-Based',
    coverage: '100% to 50% Tuition Fee Waiver for the Top Admitted Students',
    eligibility: 'Top 100 ranked applicants in the national admissions pool based on test score (SAT/LCAT) and overall academic profile.',
    deadlineOrCycle: 'Announced together with undergraduate admissions decisions in April–May.',
    applicationMethod: 'Automatic evaluation with general admission application; no separate form required.',
    officialLink: 'https://lums.edu.pk/programmes/financial-aid',
    donorOrFund: 'Syed Babar Ali & LUMS Board of Trustees'
  },
  {
    id: 'lums-general-fa',
    universityId: 'lums-lahore',
    universityName: 'Lahore University of Management Sciences',
    universityShortName: 'LUMS',
    city: 'Lahore',
    province: 'Punjab',
    name: 'LUMS Need-Based Financial Aid & Zakat Support',
    type: 'Need-Based',
    coverage: '20% to 100% Tuition Fee Discount (Over 50% of LUMS student body receives financial assistance)',
    eligibility: 'Any student offered admission whose family finances cannot cover full tuition fees.',
    deadlineOrCycle: 'Submitted with undergraduate admission application in January–February.',
    applicationMethod: 'Complete the Financial Aid section in the LUMS Online Admission Portal with supporting financial disclosures.',
    officialLink: 'https://lums.edu.pk/programmes/financial-aid',
    donorOrFund: 'LUMS Financial Aid Council & Alumni Donations'
  },

  // GIKI Scholarships
  {
    id: 'giki-top-merit',
    universityId: 'giki-topi',
    universityName: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    universityShortName: 'GIKI',
    city: 'Topi (Swabi)',
    province: 'KPK',
    name: 'GIKI Top 14 Entry Test Merit Scholarship',
    type: 'Merit-Based',
    coverage: '100% Tuition Fee Waiver for all 4 years (valued over PKR 3.2 Million)',
    eligibility: 'Top 14 position holders in the nationwide GIKI Undergraduate Admission Written Test.',
    deadlineOrCycle: 'Awarded immediately upon test results declaration in July.',
    applicationMethod: 'Automatic merit award for the highest scoring students in the entrance exam.',
    officialLink: 'https://giki.edu.pk/admissions/financial-assistance/',
    donorOrFund: 'SOPREST (Society for the Promotion of Engineering Sciences & Technology)'
  },
  {
    id: 'giki-alumni-fa',
    universityId: 'giki-topi',
    universityName: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    universityShortName: 'GIKI',
    city: 'Topi (Swabi)',
    province: 'KPK',
    name: 'GIKI Alumni Association (GIKIAA) Financial Assistance',
    type: 'Need-Based',
    coverage: '50% to 100% Tuition Waiver + Free Boarding Assistance',
    eligibility: 'Meritorious admitted students facing sudden financial adversity or limited family earnings.',
    deadlineOrCycle: 'Prior to first-semester fee payment deadline (August).',
    applicationMethod: 'Submit GIKI Financial Aid Form along with parental tax returns to the Office of Student Affairs.',
    officialLink: 'https://giki.edu.pk/admissions/financial-assistance/',
    donorOrFund: 'GIKI Alumni Association Global Chapters (USA, UK, Middle East)'
  },
  {
    id: 'giki-fef-scholarship',
    universityId: 'giki-topi',
    universityName: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    universityShortName: 'GIKI',
    city: 'Topi (Swabi)',
    province: 'KPK',
    name: 'Frontier Education Foundation (FEF) Scholarship at GIKI',
    type: 'Government / Quota',
    coverage: 'Full Tuition Fee Waiver for Domicile Holders of Khyber Pakhtunkhwa',
    eligibility: 'KPK domicile holders securing admission in GIKI engineering and computing programs on open merit.',
    deadlineOrCycle: 'Announced during September orientation.',
    applicationMethod: 'Apply through GIKI Student Welfare Society with KPK domicile certificate.',
    officialLink: 'https://giki.edu.pk',
    donorOrFund: 'Government of Khyber Pakhtunkhwa'
  },

  // IBA Karachi Scholarships
  {
    id: 'iba-nthp',
    universityId: 'iba-karachi',
    universityName: 'Institute of Business Administration',
    universityShortName: 'IBA Karachi',
    city: 'Karachi',
    province: 'Sindh',
    name: 'IBA National Talent Hunt Program (NTHP) - Full Scholarship',
    type: 'Full-Ride / Endowment',
    coverage: '100% Tuition Fee Waiver, Free Hostel Accommodation, Monthly Stipend (PKR 12,000+), Book Allowance & Laptop Grant',
    eligibility: 'Matric/HSSC students from underprivileged districts across Sindh, Punjab, KPK, Balochistan, Gilgit-Baltistan & AJK with ≥70% marks.',
    deadlineOrCycle: 'Annual intake begins in January–February; 2-month fully funded orientation workshop held in summer.',
    applicationMethod: 'Online application at nthp.iba.edu.pk followed by regional assessment tests in 25+ cities.',
    officialLink: 'https://nthp.iba.edu.pk',
    donorOrFund: 'IBA Karachi Endowment, Ihsan Trust & CDGK'
  },
  {
    id: 'iba-need-assistance',
    universityId: 'iba-karachi',
    universityName: 'Institute of Business Administration',
    universityShortName: 'IBA Karachi',
    city: 'Karachi',
    province: 'Sindh',
    name: 'IBA Financial Assistance & Qarz-e-Hasna Scheme',
    type: 'Need-Based',
    coverage: 'Partial to Full Tuition Fee Waiver (IBA ensures no admitted student leaves due to inability to pay)',
    eligibility: 'Admitted students into BS CS, BBA, BS Economics or Data Science with proven financial distress.',
    deadlineOrCycle: 'Within 10 days of receiving the undergraduate admission offer.',
    applicationMethod: 'Submit online Financial Assistance form via IBA ERP portal with income verification.',
    officialLink: 'https://iba.edu.pk/financial-assistance',
    donorOrFund: 'IBA Financial Assistance Committee & Corporate Donors'
  },
  {
    id: 'iba-shell-merit',
    universityId: 'iba-karachi',
    universityName: 'Institute of Business Administration',
    universityShortName: 'IBA Karachi',
    city: 'Karachi',
    province: 'Sindh',
    name: 'Shell Pakistan & Corporate Endowment Merit Grants at IBA',
    type: 'Merit-Based',
    coverage: 'Full Year Tuition Fee Waiver + Summer Internship Opportunity',
    eligibility: 'Top scorers in the IBA Aptitude Admission Test enrolled in undergraduate computing or business degrees.',
    deadlineOrCycle: 'Fall Semester induction (August/September).',
    applicationMethod: 'Awarded on recommendation of IBA Dean based on aptitude test standing.',
    officialLink: 'https://iba.edu.pk',
    donorOrFund: 'Shell Pakistan & Alumni Foundation'
  },

  // UET Lahore Scholarships
  {
    id: 'uet-peef',
    universityId: 'uet-lahore',
    universityName: 'University of Engineering and Technology, Lahore',
    universityShortName: 'UET Lahore',
    city: 'Lahore',
    province: 'Punjab',
    name: 'Punjab Educational Endowment Fund (PEEF) Master & Bachelor Grants at UET',
    type: 'Government / Quota',
    coverage: '100% Tuition Fee Waiver + Monthly Boarding Stipend',
    eligibility: 'Punjab domicile holders with at least 60% marks in Intermediate and parental income < PKR 60,000/month.',
    deadlineOrCycle: 'October–November after the commencement of first-year classes.',
    applicationMethod: 'Form available at UET Financial Aid Directorate; requires verification from local district authorities.',
    officialLink: 'https://peef.org.pk',
    donorOrFund: 'Government of the Punjab PEEF Fund'
  },
  {
    id: 'uet-merit-award',
    universityId: 'uet-lahore',
    universityName: 'University of Engineering and Technology, Lahore',
    universityShortName: 'UET Lahore',
    city: 'Lahore',
    province: 'Punjab',
    name: 'UET University Merit Scholarship for Top ECAT Aggregates',
    type: 'Merit-Based',
    coverage: 'Exemption from Semester Tuition Fees for Top 3 Students in each Engineering Discipline',
    eligibility: 'Top 3 positions on the composite merit list (ECAT + FSc + Matric) in each discipline.',
    deadlineOrCycle: 'Granted automatically at each semester examination result declaration.',
    applicationMethod: 'Disbursed by UET Directorate of Studies without separate application.',
    officialLink: 'https://uet.edu.pk',
    donorOrFund: 'UET Syndicate Academic Excellence Fund'
  },
  {
    id: 'uet-alumni-endowment',
    universityId: 'uet-lahore',
    universityName: 'University of Engineering and Technology, Lahore',
    universityShortName: 'UET Lahore',
    city: 'Lahore',
    province: 'Punjab',
    name: 'UET Alumni Association of North America (UET-ACM) Scholarship',
    type: 'Need-Based',
    coverage: 'Full Academic Year Fees + Hostel Expenses + Project Research Allowance',
    eligibility: 'Deserving engineering students demonstrating academic seriousness and financial constraints.',
    deadlineOrCycle: 'Spring & Fall cycles announced on UET bulletin.',
    applicationMethod: 'Apply through UET Senior Warden / Student Financial Aid Office.',
    officialLink: 'https://uet.edu.pk',
    donorOrFund: 'UET North America Alumni Network'
  },

  // NED University Scholarships
  {
    id: 'ned-seef',
    universityId: 'ned-karachi',
    universityName: 'NED University of Engineering & Technology',
    universityShortName: 'NED UET',
    city: 'Karachi',
    province: 'Sindh',
    name: 'Sindh Educational Endowment Fund (SEEF) Scholarship at NED',
    type: 'Government / Quota',
    coverage: '100% Tuition Fee + Examination Fees paid directly to NED University',
    eligibility: 'Sindh domicile holders admitted on open merit with family income under PKR 1.5 Million per annum.',
    deadlineOrCycle: 'Annual cycle in September–October announced by Sindh College Education Dept.',
    applicationMethod: 'Submit through NED Students Affairs Department with Sindh PRC/Domicile certificate.',
    officialLink: 'https://www.neduet.edu.pk/scholarships',
    donorOrFund: 'Government of Sindh'
  },
  {
    id: 'ned-nedian-alumni',
    universityId: 'ned-karachi',
    universityName: 'NED University of Engineering & Technology',
    universityShortName: 'NED UET',
    city: 'Karachi',
    province: 'Sindh',
    name: 'NEDIAN Alumni Association of North America (NEDIAN-NA) Grant',
    type: 'Need-Based',
    coverage: 'Full Tuition Fee Support for the entire 4-Year Bachelor Degree',
    eligibility: 'Undergraduate engineering and computer science students admitted on regular seats with genuine economic hardship.',
    deadlineOrCycle: 'First month of academic year.',
    applicationMethod: 'Apply through NED Student Affairs Department with verified proof of household income.',
    officialLink: 'https://www.neduet.edu.pk/scholarships',
    donorOrFund: 'NED Alumni Overseas Chapters'
  },

  // COMSATS Scholarships
  {
    id: 'comsats-gpa-topper',
    universityId: 'comsats-isb',
    universityName: 'COMSATS University Islamabad',
    universityShortName: 'CUI',
    city: 'Islamabad / Lahore / Abbottabad / Wah / Attock / Sahiwal / Vehari',
    province: 'Islamabad',
    name: 'COMSATS 100% Tuition Fee Waiver for Semester Toppers',
    type: 'Merit-Based',
    coverage: '100% Tuition Fee Waiver for Semester Academic Toppers (SGPA ≥ 3.75)',
    eligibility: 'Top ranked student in each program and semester across all 7 campuses.',
    deadlineOrCycle: 'Disbursed automatically each semester upon declaration of official grades.',
    applicationMethod: 'Automatic calculation and tuition adjustment by CUI Accounts Division.',
    officialLink: 'https://www.comsats.edu.pk/scholarships',
    donorOrFund: 'CUI Academic Merit Fund'
  },
  {
    id: 'comsats-wwf',
    universityId: 'comsats-isb',
    universityName: 'COMSATS University Islamabad',
    universityShortName: 'CUI',
    city: 'Islamabad / Lahore / Abbottabad / Wah / Attock / Sahiwal / Vehari',
    province: 'Islamabad',
    name: 'Workers Welfare Fund (WWF) Scholarship at COMSATS',
    type: 'Government / Quota',
    coverage: '100% Tuition Fee, Admission Fee, Transport, Hostel Charges & Monthly Living Allowance',
    eligibility: 'Children of registered industrial workers covered under EOBI or Social Security Act.',
    deadlineOrCycle: 'Commences with university admission each semester.',
    applicationMethod: 'Submit WWF application form verified by the Provincial Workers Welfare Board.',
    officialLink: 'https://www.comsats.edu.pk',
    donorOrFund: 'Ministry of Overseas Pakistanis & Human Resource Development'
  },
  {
    id: 'comsats-need-based',
    universityId: 'comsats-isb',
    universityName: 'COMSATS University Islamabad',
    universityShortName: 'CUI',
    city: 'Islamabad / Lahore / Abbottabad / Wah / Attock / Sahiwal / Vehari',
    province: 'Islamabad',
    name: 'CUI Need-Based Financial Support Program',
    type: 'Need-Based',
    coverage: 'Up to 50% Tuition Fee Concession for Deserving Students',
    eligibility: 'Undergraduate students maintaining CGPA ≥ 2.50 whose family finances cannot sustain full university fees.',
    deadlineOrCycle: 'Announced at start of each semester by Student Financial Aid Office (SFAO).',
    applicationMethod: 'Submit SFAO application form with supporting utility bills and salary slips.',
    officialLink: 'https://www.comsats.edu.pk/scholarships',
    donorOrFund: 'COMSATS University Internal Assistance Fund'
  },

  // PIEAS Scholarships
  {
    id: 'pieas-paec-merit',
    universityId: 'pieas-islamabad',
    universityName: 'Pakistan Institute of Engineering and Applied Sciences',
    universityShortName: 'PIEAS',
    city: 'Islamabad (Nilore)',
    province: 'Islamabad',
    name: 'PAEC Fellowship & PIEAS Undergraduate Merit Award',
    type: 'Merit-Based',
    coverage: 'Full Tuition Fee Waiver + Monthly Cash Stipend & Free Boarding at Nilore Campus',
    eligibility: 'Top merit rank holders in the PIEAS National Written Admission Test.',
    deadlineOrCycle: 'Awarded immediately upon finalization of the merit list in August.',
    applicationMethod: 'Directly offered with the admission offer letter based on written test ranking.',
    officialLink: 'https://pieas.edu.pk',
    donorOrFund: 'Pakistan Atomic Energy Commission (PAEC)'
  },
  {
    id: 'pieas-it-endowment',
    universityId: 'pieas-islamabad',
    universityName: 'Pakistan Institute of Engineering and Applied Sciences',
    universityShortName: 'PIEAS',
    city: 'Islamabad (Nilore)',
    province: 'Islamabad',
    name: 'National IT Endowment Fund Scholarship at PIEAS',
    type: 'Government / Quota',
    coverage: '100% Tuition Fees for BS Computer Science students',
    eligibility: 'Students admitted into BSCS on open merit demonstrating financial requirement.',
    deadlineOrCycle: 'Fall induction cycle.',
    applicationMethod: 'Apply through PIEAS Dean of Student Affairs.',
    officialLink: 'https://pieas.edu.pk',
    donorOrFund: 'Ministry of Information Technology and Telecommunication'
  },

  // King Edward Medical University / Punjab MDCAT Scholarships
  {
    id: 'kemu-govt-merit',
    universityId: 'kemu-lahore',
    universityName: 'King Edward Medical University',
    universityShortName: 'KEMU',
    city: 'Lahore',
    province: 'Punjab',
    name: 'Punjab Health Department Merit-cum-Need Medical Grant',
    type: 'Merit-Based',
    coverage: 'Full Tuition Fee Waiver + Hospital Subsidized Accommodation & Stipend',
    eligibility: 'Open merit MBBS students admitted through UHS Punjab centralized medical admissions.',
    deadlineOrCycle: 'Announced following MBBS admission finalization (January/February).',
    applicationMethod: 'Apply through Academic Directorate of KEMU with Punjab Domicile.',
    officialLink: 'https://kemu.edu.pk',
    donorOrFund: 'Specialized Healthcare & Medical Education Department, Punjab'
  },
  {
    id: 'kemu-kemcaana',
    universityId: 'kemu-lahore',
    universityName: 'King Edward Medical University',
    universityShortName: 'KEMU',
    city: 'Lahore',
    province: 'Punjab',
    name: 'KEMCAANA North American Alumni Financial Assistance',
    type: 'Need-Based',
    coverage: 'Annual Tuition Fees + Medical Books Allowance + Equipment/Stethoscope Grants',
    eligibility: 'Meritorious MBBS students facing hardship whose family income cannot cover hostel and academic costs.',
    deadlineOrCycle: 'Annual cycle in first term of academic calendar.',
    applicationMethod: 'Application reviewed and interviewed by KEMCAANA liaison committee at KEMU.',
    officialLink: 'https://kemcaana.org',
    donorOrFund: 'King Edward Medical College Alumni Association of North America'
  },

  // Dow University of Health Sciences Scholarships
  {
    id: 'duhs-seef-medical',
    universityId: 'duhs-karachi',
    universityName: 'Dow University of Health Sciences',
    universityShortName: 'DUHS',
    city: 'Karachi',
    province: 'Sindh',
    name: 'Sindh Health Endowment Medical Grant at DUHS',
    type: 'Government / Quota',
    coverage: '100% Tuition Fees + Clinical Training Fee Subsidies',
    eligibility: 'Sindh domicile holders securing open merit MBBS or BDS admission at Dow Medical College.',
    deadlineOrCycle: 'Conducted during 1st semester orientation.',
    applicationMethod: 'Submit through Dow Financial Aid Committee with father/guardian income tax records.',
    officialLink: 'https://duhs.edu.pk',
    donorOrFund: 'Government of Sindh Health Department'
  },
  {
    id: 'duhs-alumni-aid',
    universityId: 'duhs-karachi',
    universityName: 'Dow University of Health Sciences',
    universityShortName: 'DUHS',
    city: 'Karachi',
    province: 'Sindh',
    name: 'DOW Graduate Association (DOGANA) Financial Aid',
    type: 'Need-Based',
    coverage: 'Tuition Fee Coverage + Stethoscope & Anatomy Reference Books Pack',
    eligibility: 'Deserving medical students with parents earning < PKR 50,000 per month.',
    deadlineOrCycle: 'October each academic year.',
    applicationMethod: 'Direct portal submission via DOGANA Student Welfare Desk.',
    officialLink: 'https://dogana.org',
    donorOrFund: 'Dow Graduates Association of North America'
  },

  // Quaid-i-Azam University Scholarships
  {
    id: 'qau-alumni-need',
    universityId: 'qau-islamabad',
    universityName: 'Quaid-i-Azam University',
    universityShortName: 'QAU',
    city: 'Islamabad',
    province: 'Islamabad',
    name: 'QAU Alumni Association Need-Based Financial Scholarship',
    type: 'Need-Based',
    coverage: 'Full Semester Fee Waiver + Hostel Accommodation Subsidies',
    eligibility: 'Enrolled students in Natural, Computing, and Social Sciences with household income distress.',
    deadlineOrCycle: 'Announced within first month of Fall and Spring semester starts.',
    applicationMethod: 'Submit through Department Chairman to QAU Financial Aid Office.',
    officialLink: 'https://qau.edu.pk',
    donorOrFund: 'Quaid-i-Azam University Global Alumni Association'
  },
  {
    id: 'qau-hec-fata-balochistan',
    universityId: 'qau-islamabad',
    universityName: 'Quaid-i-Azam University',
    universityShortName: 'QAU',
    city: 'Islamabad',
    province: 'Islamabad',
    name: 'HEC Indigenous Scholarship for Erstwhile FATA & Balochistan at QAU',
    type: 'Government / Quota',
    coverage: '100% Tuition Fee + Hostel Charges + Monthly Living Stipend of PKR 15,000',
    eligibility: 'Students from merged tribal districts of KPK and Balochistan admitted under reserved/open seats.',
    deadlineOrCycle: 'Announced annually on HEC Portal.',
    applicationMethod: 'Online through HEC e-portal and verified by QAU Student Affairs.',
    officialLink: 'https://hec.gov.pk',
    donorOrFund: 'Higher Education Commission of Pakistan'
  },

  // BUITEMS Quetta Scholarships
  {
    id: 'buitems-beef',
    universityId: 'buitems-quetta',
    universityName: 'Balochistan University of Information Technology, Engineering and Management Sciences',
    universityShortName: 'BUITEMS',
    city: 'Quetta',
    province: 'Balochistan',
    name: 'Balochistan Education Endowment Fund (BEEF) at BUITEMS',
    type: 'Government / Quota',
    coverage: '100% Tuition Waiver + Annual Living Grant (PKR 60,000 - 100,000)',
    eligibility: 'Balochistan domicile holders with at least 60% marks in intermediate admitted in Engineering, IT or Management.',
    deadlineOrCycle: 'Annual cycle in September/October.',
    applicationMethod: 'Submit BEEF Form through BUITEMS Directorate of Financial Aid.',
    officialLink: 'https://beef.org.pk',
    donorOrFund: 'Government of Balochistan'
  },
  {
    id: 'buitems-merit',
    universityId: 'buitems-quetta',
    universityName: 'Balochistan University of Information Technology, Engineering and Management Sciences',
    universityShortName: 'BUITEMS',
    city: 'Quetta',
    province: 'Balochistan',
    name: 'BUITEMS Chancellor Merit Scholarship',
    type: 'Merit-Based',
    coverage: '100% Tuition Fee Waiver for Semester Top Performers (GPA ≥ 3.80)',
    eligibility: 'Highest CGPA scorer in each department each semester.',
    deadlineOrCycle: 'Semester-end evaluation.',
    applicationMethod: 'Automatic merit credit against semester fee voucher.',
    officialLink: 'https://buitms.edu.pk',
    donorOrFund: 'BUITEMS Syndicate Endowment'
  },

  // UET Peshawar Scholarships
  {
    id: 'uet-pesh-fef',
    universityId: 'uet-peshawar',
    universityName: 'University of Engineering and Technology, Peshawar',
    universityShortName: 'UET Peshawar',
    city: 'Peshawar',
    province: 'KPK',
    name: 'Frontier Education Foundation (FEF) & ETEA Merit Scholarship',
    type: 'Merit-Based',
    coverage: 'Full Tuition Fee Waiver for Top ETEA Engineering Test Position Holders',
    eligibility: 'Top 10 position holders in KPK ETEA Pre-Engineering Entrance Test.',
    deadlineOrCycle: 'Admissions allocation in August.',
    applicationMethod: 'Automatic scholarship awarded upon ETEA entrance test merit determination.',
    officialLink: 'https://uetpeshawar.edu.pk',
    donorOrFund: 'Government of Khyber Pakhtunkhwa & FEF'
  },
  {
    id: 'uet-pesh-alumni',
    universityId: 'uet-peshawar',
    universityName: 'University of Engineering and Technology, Peshawar',
    universityShortName: 'UET Peshawar',
    city: 'Peshawar',
    province: 'KPK',
    name: 'UET Peshawar Alumni Endowment Need-Based Grant',
    type: 'Need-Based',
    coverage: 'Partial to 100% Tuition Fee Assistance for Financially Struggling Students',
    eligibility: 'Enrolled engineering students with family income under PKR 50,000/month.',
    deadlineOrCycle: 'First month of academic semester.',
    applicationMethod: 'Submit to Directorate of Financial Aid, UET Peshawar Main Campus.',
    officialLink: 'https://uetpeshawar.edu.pk',
    donorOrFund: 'UET Peshawar Alumni Foundation'
  }
];

export function getScholarshipsForUniversity(universityIdOrShortName: string): UniversityScholarshipItem[] {
  const query = universityIdOrShortName.toLowerCase();
  return PAK_SCHOLARSHIPS.filter((s) => {
    return (
      s.universityId.toLowerCase() === query ||
      s.universityShortName.toLowerCase() === query ||
      s.universityName.toLowerCase().includes(query) ||
      query.includes(s.universityShortName.toLowerCase())
    );
  });
}

export function getAllScholarships(): UniversityScholarshipItem[] {
  return PAK_SCHOLARSHIPS;
}
