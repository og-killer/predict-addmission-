import React, { useState, useMemo } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  Filter,
  Search,
  Building2,
  UserPlus
} from 'lucide-react';
import { PAK_UNIVERSITIES, University, DegreeProgram } from '../data/universities';
import { calculateAggregate, checkEligibility, predictChances, StudentMarks } from '../utils/admissions';
import { AcademicQuotesBanner } from './AcademicQuotesBanner';

interface AdmissionPredictorProps {
  studentProfile: StudentMarks;
  onOpenProfileModal: () => void;
  onAskAi: (promptText: string, mode?: string) => void;
}

export const AdmissionPredictor: React.FC<AdmissionPredictorProps> = ({
  studentProfile,
  onOpenProfileModal,
  onAskAi
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const hasEnteredMarks = studentProfile.fscObtained > 0;

  // Calculate chances across all universities and programs
  const predictions = useMemo(() => {
    const list: Array<{
      university: University;
      program: DegreeProgram;
      calculatedAggregate: number;
      closingMerit2024: number;
      diff: number;
      status: 'High Chance' | 'Moderate Chance' | 'Reach / Competitive';
      eligibility: { eligible: boolean; reason: string };
    }> = [];

    for (const uni of PAK_UNIVERSITIES) {
      if (selectedProvince !== 'All' && uni.province !== selectedProvince) {
        continue;
      }

      // Calculate aggregate for this specific university formula
      const testScore = studentProfile.testObtained ?? (uni.meritFormula.id === 'fast-formula' ? 70 : 145);
      const testTotal = studentProfile.testTotal ?? (uni.meritFormula.id === 'fast-formula' ? 100 : 200);

      const agg = calculateAggregate(uni.meritFormula.id, {
        matricObtained: studentProfile.matricObtained || 900,
        matricTotal: studentProfile.matricTotal || 1100,
        fscObtained: studentProfile.fscObtained || 850,
        fscTotal: studentProfile.fscTotal || 1100,
        testObtained: testScore,
        testTotal: testTotal
      });

      for (const prog of uni.programs) {
        if (selectedDiscipline !== 'All' && prog.discipline !== selectedDiscipline) {
          continue;
        }

        if (
          searchQuery &&
          !prog.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !uni.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !uni.shortName.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          continue;
        }

        const eligibility = checkEligibility(studentProfile, prog);
        const chance = predictChances(agg, prog.previousClosingMerits.year2024);

        list.push({
          university: uni,
          program: prog,
          calculatedAggregate: agg,
          closingMerit2024: prog.previousClosingMerits.year2024,
          diff: chance.diff,
          status: chance.status,
          eligibility
        });
      }
    }

    return list.sort((a, b) => {
      const order = { 'High Chance': 1, 'Moderate Chance': 2, 'Reach / Competitive': 3 };
      if (order[a.status] !== order[b.status]) {
        return order[a.status] - order[b.status];
      }
      return b.diff - a.diff;
    });
  }, [studentProfile, selectedDiscipline, selectedProvince, searchQuery]);

  const highChanceCount = predictions.filter((p) => p.status === 'High Chance').length;
  const moderateChanceCount = predictions.filter((p) => p.status === 'Moderate Chance').length;
  const reachCount = predictions.filter((p) => p.status === 'Reach / Competitive').length;

  return (
    <div className="space-y-6">
      {/* Inspirational Academic Wisdom Carousel */}
      <AcademicQuotesBanner />

      {/* Hero Visual Card with High-Res Campus Photography */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/campus_hero_facade_1792742449093.jpg"
            alt="Prestigious University Campus"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
            <Compass className="w-4 h-4" />
            <span>National Admission Engine</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span>2024–2025 Closing Merits</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3 text-balance">
            Predict Your University Admission Standing in Pakistan
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Evaluate your aggregate precisely against historical closing merits across NUST, FAST, UET, NED, COMSATS, GIKI, and MDCAT Medical colleges using statutory formulas.
          </p>

          {/* Quick status bar & Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {hasEnteredMarks ? (
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>
                  Profile Active: FSc {((studentProfile.fscObtained / studentProfile.fscTotal) * 100).toFixed(1)}% · Matric {studentProfile.matricObtained}/{studentProfile.matricTotal}
                </span>
                <button
                  onClick={onOpenProfileModal}
                  className="ml-2 text-blue-400 underline font-bold hover:text-blue-300"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenProfileModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" />
                Enter Marks for Personalized Results
              </button>
            )}

            <button
              onClick={() =>
                onAskAi(
                  hasEnteredMarks
                    ? `What are my best admission options in Pakistan based on my academic marks (FSc ${studentProfile.fscObtained}/${studentProfile.fscTotal}, Matric ${studentProfile.matricObtained}/${studentProfile.matricTotal})?`
                    : 'How does the Pakistani university admission predictor and aggregate calculation work?',
                  'admissions'
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Consult Gemini AI Advisor
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
            Programs Evaluated
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block tabular-nums">
            {predictions.length}
          </span>
          <span className="text-[11px] text-slate-400">across 11 verified universities</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-blue-900 font-bold uppercase tracking-wider block">
              High Chance
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-blue-950 mt-1 block tabular-nums">
            {highChanceCount}
          </span>
          <span className="text-[11px] text-blue-700">&gt;1.5% above closing merit</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-900 font-bold uppercase tracking-wider block">
              Competitive Range
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-950 mt-1 block tabular-nums">
            {moderateChanceCount}
          </span>
          <span className="text-[11px] text-amber-700">within ±1.5% margin</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-700 font-bold uppercase tracking-wider block">
              Reach Programs
            </span>
            <AlertTriangle className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 mt-1 block tabular-nums">
            {reachCount}
          </span>
          <span className="text-[11px] text-slate-500">Requires higher test marks</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs (e.g. Computer Science, Software Engineering, AI, Electrical, MBBS)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Discipline:</span>
          </div>
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Disciplines</option>
            <option value="Computing & IT">Computing &amp; IT</option>
            <option value="Engineering">Engineering</option>
            <option value="Medical & Health">Medical &amp; Health</option>
            <option value="Business & Management">Business &amp; Management</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-1">
            <span>Province:</span>
          </div>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Regions</option>
            <option value="Islamabad">Islamabad (Federal)</option>
            <option value="Punjab">Punjab</option>
            <option value="Sindh">Sindh</option>
            <option value="KPK">Khyber Pakhtunkhwa</option>
          </select>
        </div>
      </div>

      {/* Predictions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((item, idx) => {
          const isHigh = item.status === 'High Chance';
          const isModerate = item.status === 'Moderate Chance';

          return (
            <div
              key={`${item.university.id}-${item.program.id}-${idx}`}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Header Strip */}
                <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-bold text-slate-900">{item.university.shortName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.university.city}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {item.program.name}
                    </h3>
                  </div>

                  {/* Status Indicator (Text + Icon, not an oversized candy pill) */}
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                      isHigh
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : isModerate
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isHigh && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    {isModerate && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {!isHigh && !isModerate && <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />}
                    {item.status}
                  </span>
                </div>

                {/* Aggregate & Closing Merit Row */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
                        Your Aggregate
                      </span>
                      <span className="text-base font-extrabold text-slate-900 tabular-nums">
                        {item.calculatedAggregate.toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate" title={item.university.meritFormula.description}>
                        {item.university.shortName} formula
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
                        2024 Closing
                      </span>
                      <span className="text-base font-extrabold text-slate-700 tabular-nums">
                        {item.closingMerit2024.toFixed(2)}%
                      </span>
                      <span
                        className={`text-[10px] font-bold block tabular-nums ${
                          item.diff >= 0 ? 'text-blue-600' : 'text-rose-600'
                        }`}
                      >
                        {item.diff >= 0 ? `+${item.diff.toFixed(2)}% Above` : `${item.diff.toFixed(2)}% Below`}
                      </span>
                    </div>
                  </div>

                  {/* Eligibility Notice */}
                  {!item.eligibility.eligible && (
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{item.eligibility.reason}</span>
                    </div>
                  )}

                  {/* Program metadata unboxed */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Degree Duration:</span>
                      <span className="font-semibold text-slate-800">{item.program.durationYears} Years (8 Semesters)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Min. FSc Eligibility:</span>
                      <span className="font-semibold text-slate-800">{item.program.eligibility.minFscPercentage}% required</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    onAskAi(
                      `What are my admission chances for ${item.program.name} at ${item.university.name}? My aggregate is ${item.calculatedAggregate.toFixed(2)}% against 2024 closing merit of ${item.closingMerit2024.toFixed(2)}%. How should I prepare?`,
                      'admissions'
                    )
                  }
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 py-1.5 px-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Ask Gemini AI
                </button>

                <a
                  href={item.university.admissionPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 font-medium"
                >
                  Official Portal
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
