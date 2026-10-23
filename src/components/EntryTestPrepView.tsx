import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Calendar,
  BrainCircuit,
  GraduationCap,
  Award,
  Search,
  Building2,
  ExternalLink,
  FileText,
  DollarSign,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { PAK_UNIVERSITIES, University } from '../data/universities';
import { PAK_SCHOLARSHIPS, getScholarshipsForUniversity, UniversityScholarshipItem } from '../data/scholarships';
import { SAMPLE_PRACTICE_QUESTIONS, generateStudyPlan, PracticeMCQ } from '../utils/admissions';

interface EntryTestPrepViewProps {
  onAskAi: (promptText: string, mode?: string) => void;
}

export const EntryTestPrepView: React.FC<EntryTestPrepViewProps> = ({ onAskAi }) => {
  // Selected University & Test State
  const [selectedUniId, setSelectedUniId] = useState<string>('nust-islamabad');
  const [searchUniQuery, setSearchUniQuery] = useState<string>('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('All');
  const [scholarshipFilterType, setScholarshipFilterType] = useState<string>('All');
  const [showAllScholarshipsModal, setShowAllScholarshipsModal] = useState<boolean>(false);

  // Find currently selected university
  const selectedUni = useMemo(() => {
    return PAK_UNIVERSITIES.find((u) => u.id === selectedUniId) || PAK_UNIVERSITIES[0];
  }, [selectedUniId]);

  // Selected test label based on selected university
  const currentTestName = useMemo(() => {
    if (selectedUni.entryTestDetails?.testName) {
      return selectedUni.entryTestDetails.testName;
    }
    if (selectedUni.acceptedEntryTests && selectedUni.acceptedEntryTests.length > 0) {
      return `${selectedUni.shortName} (${selectedUni.acceptedEntryTests[0]})`;
    }
    return `${selectedUni.shortName} Entrance Examination`;
  }, [selectedUni]);

  // Filtered universities list for the selector
  const filteredUniversities = useMemo(() => {
    return PAK_UNIVERSITIES.filter((uni) => {
      if (selectedProvinceFilter !== 'All' && uni.province !== selectedProvinceFilter) {
        return false;
      }
      if (!searchUniQuery.trim()) return true;
      const q = searchUniQuery.toLowerCase();
      return (
        uni.name.toLowerCase().includes(q) ||
        uni.shortName.toLowerCase().includes(q) ||
        uni.city.toLowerCase().includes(q) ||
        (uni.entryTestDetails?.testName && uni.entryTestDetails.testName.toLowerCase().includes(q)) ||
        uni.acceptedEntryTests.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchUniQuery, selectedProvinceFilter]);

  // Scholarships for currently selected university
  const universityScholarships = useMemo(() => {
    const list = getScholarshipsForUniversity(selectedUni.id);
    if (scholarshipFilterType === 'All') return list;
    return list.filter((s) => s.type === scholarshipFilterType);
  }, [selectedUni.id, scholarshipFilterType]);

  // MCQ state
  const initialMcq = useMemo(() => {
    const matching = SAMPLE_PRACTICE_QUESTIONS.filter((q) =>
      q.test.toLowerCase().includes(selectedUni.shortName.toLowerCase()) ||
      (selectedUni.entryTestDetails && q.test.toLowerCase().includes(selectedUni.entryTestDetails.testName.toLowerCase()))
    );
    return matching.length > 0 ? matching[0] : SAMPLE_PRACTICE_QUESTIONS[0];
  }, [selectedUni]);

  const [currentMcq, setCurrentMcq] = useState<PracticeMCQ>(initialMcq);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isLoadingNewMcq, setIsLoadingNewMcq] = useState<boolean>(false);

  // Study plan state
  const [studyPlanDays, setStudyPlanDays] = useState<number>(30);
  const [weakSubjectsInput, setWeakSubjectsInput] = useState<string>('Mathematics, Conic Sections & Calculus');

  const studyPlan = useMemo(() => {
    return generateStudyPlan(
      currentTestName,
      studyPlanDays,
      weakSubjectsInput.split(',').map((s) => s.trim()).filter(Boolean)
    );
  }, [currentTestName, studyPlanDays, weakSubjectsInput]);

  const handleUniversityChange = (uniId: string) => {
    setSelectedUniId(uniId);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);

    const uni = PAK_UNIVERSITIES.find((u) => u.id === uniId);
    if (uni) {
      const matching = SAMPLE_PRACTICE_QUESTIONS.filter((q) =>
        q.test.toLowerCase().includes(uni.shortName.toLowerCase()) ||
        (uni.entryTestDetails && q.test.toLowerCase().includes(uni.entryTestDetails.testName.toLowerCase()))
      );
      if (matching.length > 0) {
        setCurrentMcq(matching[0]);
      } else {
        // Fallback default
        setCurrentMcq(SAMPLE_PRACTICE_QUESTIONS[0]);
      }
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOptionIndex === null) return;
    setIsAnswerSubmitted(true);
  };

  const fetchNewMcq = async () => {
    setIsLoadingNewMcq(true);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);

    try {
      let subj = 'Mathematics';
      if (selectedUni.shortName.includes('KEMU') || selectedUni.shortName.includes('DUHS')) {
        subj = 'Biology';
      } else if (selectedUni.shortName.includes('IBA')) {
        subj = 'Analytical & English';
      } else if (selectedUni.entryTestDetails?.subjectsBreakdown?.length) {
        subj = selectedUni.entryTestDetails.subjectsBreakdown[0].subject;
      }

      const res = await fetch('/api/generate-mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName: currentTestName,
          subject: subj,
          difficulty: 'Medium'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mcq) {
          setCurrentMcq(data.mcq);
          return;
        }
      }
      throw new Error('Fallback to curated');
    } catch {
      const filtered = SAMPLE_PRACTICE_QUESTIONS.filter((q) =>
        q.test.toLowerCase().includes(selectedUni.shortName.toLowerCase())
      );
      const chosen =
        filtered.length > 0
          ? filtered[Math.floor(Math.random() * filtered.length)]
          : SAMPLE_PRACTICE_QUESTIONS[Math.floor(Math.random() * SAMPLE_PRACTICE_QUESTIONS.length)];
      setCurrentMcq(chosen);
    } finally {
      setIsLoadingNewMcq(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/student_study_desk_1792742450064.jpg"
            alt="Student studying in university library"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
              <BrainCircuit className="w-4 h-4" />
              <span>National Testing &amp; Scholarships Center</span>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span>All Universities in Pakistan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Entry Tests, Practice MCQs &amp; University Scholarships
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Select any university in Pakistan to access verified entry test formats, high-yield practice MCQs with step-by-step solutions, personalized 30-day study roadmaps, and official university scholarships &amp; financial aid schemes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAllScholarshipsModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 shadow-sm transition-all"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Browse All 25+ Scholarships
            </button>

            <button
              onClick={() =>
                onAskAi(
                  `Can you create a customized preparation strategy and review scholarship eligibility for ${selectedUni.name} (${selectedUni.shortName})? The entrance test is ${currentTestName}.`,
                  'tutor'
                )
              }
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Gemini Test &amp; Scholarship Tutor
            </button>
          </div>
        </div>

        {/* University Quick Chips Bar */}
        <div className="relative z-10 px-6 sm:px-10 pb-5 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Quick Select Target University:
            </span>
            <span className="text-[11px] text-blue-300 font-semibold">
              {PAK_UNIVERSITIES.length} Universities Available
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PAK_UNIVERSITIES.slice(0, 10).map((uni) => {
              const isSelected = selectedUniId === uni.id;
              return (
                <button
                  key={uni.id}
                  onClick={() => handleUniversityChange(uni.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {uni.shortName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comprehensive University & Test Selector Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Search by university name or entrance test */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUniQuery}
              onChange={(e) => setSearchUniQuery(e.target.value)}
              placeholder="Search all universities in Pakistan (e.g. LUMS, GIKI, ECAT, MDCAT)..."
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          {/* Region / Province Filter */}
          <div>
            <select
              value={selectedProvinceFilter}
              onChange={(e) => setSelectedProvinceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Provinces &amp; Regions</option>
              <option value="Islamabad">Islamabad (Federal Capital)</option>
              <option value="Punjab">Punjab</option>
              <option value="Sindh">Sindh</option>
              <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
              <option value="Balochistan">Balochistan</option>
            </select>
          </div>

          {/* Direct Pick University Dropdown */}
          <div>
            <select
              value={selectedUniId}
              onChange={(e) => handleUniversityChange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-blue-900 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600"
            >
              {filteredUniversities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.shortName} · {uni.name} ({uni.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected University Badge Details */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-slate-900">
              {selectedUni.name} ({selectedUni.shortName})
            </span>
            <span className="font-semibold text-slate-500">·</span>
            <span className="font-medium text-slate-600">{selectedUni.city}, {selectedUni.province}</span>
            <span className="font-semibold text-slate-500">·</span>
            <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-lg border border-blue-200">
              {selectedUni.ranking}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Official Exam:</span>
            <span className="font-bold text-blue-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {currentTestName}
            </span>
          </div>
        </div>
      </div>

      {/* University Entry Test Overview Card */}
      {selectedUni.entryTestDetails && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{selectedUni.shortName} Entry Test Specifications</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {selectedUni.entryTestDetails.testName}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                Total Marks: {selectedUni.entryTestDetails.totalMarks}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                Duration: {selectedUni.entryTestDetails.durationMinutes} mins
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  selectedUni.entryTestDetails.negativeMarking
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                Negative Marking: {selectedUni.entryTestDetails.negativeMarking ? 'Yes (-0.25)' : 'No Negative Marking'}
              </span>
            </div>
          </div>

          {/* Subjects breakdown & links */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Subject Breakdown &amp; MCQ Weightage:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedUni.entryTestDetails.subjectsBreakdown.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-bold text-slate-800">{s.subject}</span>
                    <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {s.mcqs} MCQs ({s.weightPercentage}%)
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {selectedUni.entryTestDetails.description}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Recommended Resources:
              </span>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                {selectedUni.entryTestDetails.recommendedBooks.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-200/80">
                <a
                  href={selectedUni.samplePapersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-bold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Official Sample Papers &amp; Syllabus
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* University Scholarships & Financial Aid Showcase */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-blue-600" />
              <span>University Financial Aid &amp; Tuition Grants</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Scholarships &amp; Financial Assistance at {selectedUni.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified institutional grants, donor endowments, merit fee waivers, and government scholarships available for admitted students.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={scholarshipFilterType}
              onChange={(e) => setScholarshipFilterType(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Scholarship Types</option>
              <option value="Need-Based">Need-Based Assistance</option>
              <option value="Merit-Based">Merit-Based Awards</option>
              <option value="Full-Ride / Endowment">Full-Ride / Endowments</option>
              <option value="Government / Quota">Government / Quota</option>
            </select>
          </div>
        </div>

        {/* Scholarships Cards Grid */}
        {universityScholarships.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No scholarships matching this filter for {selectedUni.shortName}.</p>
            <p className="text-[11px] text-slate-500 mt-1">Try switching to "All Scholarship Types" or explore national HEC Ehsaas and PEEF grants.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {universityScholarships.map((sch) => {
              let badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
              if (sch.type === 'Full-Ride / Endowment') badgeColor = 'bg-amber-50 text-amber-900 border-amber-300 font-extrabold';
              if (sch.type === 'Need-Based') badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
              if (sch.type === 'Merit-Based') badgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-200';

              return (
                <div
                  key={sch.id}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-bold ${badgeColor}`}>
                        {sch.type}
                      </span>
                      {sch.donorOrFund && (
                        <span className="text-[10px] text-slate-500 font-medium truncate max-w-[180px]">
                          {sch.donorOrFund}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {sch.name}
                    </h3>

                    {/* Coverage Highlight */}
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                        <span>Coverage &amp; Financial Benefit:</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">
                        {sch.coverage}
                      </p>
                    </div>

                    {/* Eligibility & Method */}
                    <div className="text-xs text-slate-600 space-y-1 pt-1">
                      <div>
                        <strong className="text-slate-800">Eligibility:</strong> {sch.eligibility}
                      </div>
                      <div>
                        <strong className="text-slate-800">Timeline / Cycle:</strong> {sch.deadlineOrCycle}
                      </div>
                      <div>
                        <strong className="text-slate-800">How to Apply:</strong> {sch.applicationMethod}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        onAskAi(
                          `Please explain the scholarship program "${sch.name}" at ${selectedUni.name} (${selectedUni.shortName}). What documents (income affidavit, salary slips, utility bills) are required and how should I apply to maximize my chances?`,
                          'interview'
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Inquire via AI Assistant
                    </button>

                    {sch.officialLink && (
                      <a
                        href={sch.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg"
                      >
                        Official Page <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Interactive MCQ & Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice MCQ Arena */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                  {currentMcq.test}
                </span>
                <span className="font-bold text-slate-800">
                  {currentMcq.subject}
                </span>
                <span className="text-slate-400">({currentMcq.topic})</span>
              </div>

              <button
                onClick={fetchNewMcq}
                disabled={isLoadingNewMcq}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold disabled:opacity-50 transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoadingNewMcq ? 'animate-spin' : ''}`} />
                {isLoadingNewMcq ? 'Generating...' : 'Next MCQ'}
              </button>
            </div>

            {/* Question Text */}
            <div className="my-5">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {currentMcq.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentMcq.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCorrect = idx === currentMcq.correctAnswerIndex;
                let optionStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                  } else {
                    optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-3.5 text-left rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row & Explanation */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                onClick={handleAnswerSubmit}
                disabled={selectedOptionIndex === null}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm active:scale-[0.98]"
              >
                Submit Answer
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-xs text-slate-900 block mb-1">
                    Method &amp; Conceptual Solution:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentMcq.explanation}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      onAskAi(
                        `Explain this practice question in depth for ${currentMcq.test}: "${currentMcq.question}". Correct answer is "${currentMcq.options[currentMcq.correctAnswerIndex]}". Can you teach me the core formula and solve 1 similar variation?`,
                        'tutor'
                      )
                    }
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 py-1.5 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Explain with Gemini Tutor
                  </button>

                  <button
                    onClick={fetchNewMcq}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                  >
                    Next Question →
                  </button>
                </div>
              </div>
            )}

            {/* Mandatory AI Practice Disclaimer */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Official Notice:</strong> AI-generated practice questions are for concept revision and speed training. They are not official confidential university exam papers.
              </span>
            </div>
          </div>
        </div>

        {/* 30-Day Preparation Plan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Personalized 30-Day Roadmap
              </span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                Target: {selectedUni.shortName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Structured preparation schedule to systematically master textbooks and past paper cycles for {currentTestName}.
            </p>
          </div>

          {/* Weak subjects customize */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block">
              Prioritize Your Weak Chapters or Subjects:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={weakSubjectsInput}
                onChange={(e) => setWeakSubjectsInput(e.target.value)}
                placeholder="e.g. Conic Sections, Organic Chemistry, English Grammar"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
              />
              <button
                onClick={() =>
                  onAskAi(
                    `I am preparing for ${currentTestName} at ${selectedUni.name} and my weak areas are: ${weakSubjectsInput}. Can you create a step-by-step daily revision schedule and recommend free online resources?`,
                    'roadmap'
                  )
                }
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
              >
                AI Roadmap
              </button>
            </div>
          </div>

          {/* Weekly Schedule Timeline */}
          <div className="space-y-3">
            {studyPlan.weeklySchedule.map((week) => (
              <div
                key={week.week}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="text-blue-900">
                    Week {week.week}: {week.focus}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {week.dailyHours}
                  </span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {week.milestones.map((m, mIdx) => (
                    <li key={mIdx}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Key Strategies */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1">
            <span className="font-bold block text-[11px] uppercase tracking-wider text-blue-900">
              Exam Hall Strategy:
            </span>
            {studyPlan.keyStrategies.map((strat, sIdx) => (
              <div key={sIdx} className="flex items-start gap-1.5 text-[11px]">
                <span className="text-blue-700 font-bold">✓</span>
                <span>{strat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Browse All 25+ University Scholarships in Pakistan */}
      {showAllScholarshipsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>National University Scholarships Directory</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Pakistani Universities Scholarships &amp; Financial Aid Register
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Full compilation of verified scholarships across NUST, FAST, LUMS, GIKI, IBA, UET, NED, COMSATS, PIEAS, KEMU, DUHS, QAU, BUITEMS &amp; Provincial Endowments.
                </p>
              </div>

              <button
                onClick={() => setShowAllScholarshipsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PAK_SCHOLARSHIPS.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                        {item.universityShortName} · {item.city}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {item.type}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 text-sm leading-snug">
                      {item.name}
                    </h4>

                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-blue-900">
                      Coverage: <span className="font-medium text-slate-700">{item.coverage}</span>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Eligibility:</strong> {item.eligibility}
                    </p>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setShowAllScholarshipsModal(false);
                          handleUniversityChange(item.universityId);
                        }}
                        className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
                      >
                        Select {item.universityShortName} Prep <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {item.officialLink && (
                        <a
                          href={item.officialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1"
                        >
                          Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                Showing {PAK_SCHOLARSHIPS.length} Verified Pakistani University Scholarship Programs
              </span>
              <button
                onClick={() => setShowAllScholarshipsModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
