import React, { useState } from 'react';
import {
  Building2,
  CheckCircle,
  ExternalLink,
  FileText,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  Award,
  DollarSign
} from 'lucide-react';
import { PAK_UNIVERSITIES, University } from '../data/universities';
import { getScholarshipsForUniversity } from '../data/scholarships';

interface UniversityDirectoryProps {
  onAskAi: (promptText: string, mode?: string) => void;
}

export const UniversityDirectory: React.FC<UniversityDirectoryProps> = ({ onAskAi }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [expandedUniId, setExpandedUniId] = useState<string | null>(PAK_UNIVERSITIES[0].id);

  const filteredUnis = PAK_UNIVERSITIES.filter((uni) => {
    if (selectedProvince !== 'All' && uni.province !== selectedProvince) return false;
    if (selectedSector !== 'All' && uni.sector !== selectedSector) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      uni.name.toLowerCase().includes(q) ||
      uni.shortName.toLowerCase().includes(q) ||
      uni.city.toLowerCase().includes(q) ||
      uni.programs.some((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">
              <Building2 className="w-4 h-4" />
              <span>National University Register</span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span>HEC / PEC / PM&DC Recognized</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Pakistan Universities, Programs &amp; Official Criteria
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Verified university directory containing statutory merit formulas, 2024 closing merit benchmarks, sample paper links, and admission portals.
            </p>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              Official Criteria Verified · 2024–2025 Prospectus
            </span>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, city, program..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Provinces / Regions</option>
              <option value="Islamabad">Islamabad (Federal)</option>
              <option value="Punjab">Punjab</option>
              <option value="Sindh">Sindh</option>
              <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Sectors</option>
              <option value="Public">Public Sector</option>
              <option value="Private">Private / Chartered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Universities List */}
      <div className="space-y-4">
        {filteredUnis.map((uni) => {
          const isExpanded = expandedUniId === uni.id;

          return (
            <div
              key={uni.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all hover:border-blue-300"
            >
              {/* University Header Row */}
              <div
                onClick={() => setExpandedUniId(isExpanded ? null : uni.id)}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0 border border-slate-700">
                    {uni.shortName.slice(0, 4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-extrabold text-base sm:text-lg text-slate-900">
                        {uni.name}
                      </span>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                        {uni.shortName}
                      </span>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {uni.sector}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {uni.city}, {uni.province}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-800 font-semibold">
                        Formula: {uni.meritFormula.description}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{uni.programs.length} Verified Programs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAi(
                        `Explain admission eligibility, closing merit trends, and the best preparation strategy for ${uni.name} (${uni.shortName}).`,
                        'comparator'
                      );
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    AI Comparison
                  </button>

                  <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-5 animate-fade-in">
                  {/* Merit Formula & Test Specs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Merit Calculation Formula
                      </span>
                      <p className="text-sm font-bold text-blue-900 mb-2">
                        {uni.meritFormula.description}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {uni.meritFormula.explanation}
                      </p>
                      <div className="mt-3 flex gap-2 text-xs">
                        {uni.meritFormula.weights.entryTest > 0 && (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200">
                            Test: {uni.meritFormula.weights.entryTest}%
                          </span>
                        )}
                        {uni.meritFormula.weights.fsc > 0 && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
                            FSc: {uni.meritFormula.weights.fsc}%
                          </span>
                        )}
                        {uni.meritFormula.weights.matric > 0 && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
                            Matric: {uni.meritFormula.weights.matric}%
                          </span>
                        )}
                      </div>
                    </div>

                    {uni.entryTestDetails && (
                      <div className="p-4 bg-white rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                          Entry Test Format
                        </span>
                        <p className="text-sm font-semibold text-slate-900 mb-1">
                          {uni.entryTestDetails.testName} ({uni.entryTestDetails.totalMarks} Total Marks)
                        </p>
                        <p className="text-xs text-slate-600 mb-2">
                          Negative Marking:{' '}
                          <span className="font-bold text-rose-700">
                            {uni.entryTestDetails.negativeMarking ? 'Yes (-0.25 marks)' : 'No'}
                          </span>{' '}
                          | Duration: {uni.entryTestDetails.durationMinutes} mins
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {uni.entryTestDetails.subjectsBreakdown.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              {s.subject} ({s.mcqs} MCQs)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Programs & Closing Merits Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Available Undergraduate Programs &amp; Historical Closing Merits
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Open Merit Benchmarks
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-4">Program Name</th>
                            <th className="py-2.5 px-4">Discipline</th>
                            <th className="py-2.5 px-4">Duration</th>
                            <th className="py-2.5 px-4">Min FSc</th>
                            <th className="py-2.5 px-4 font-bold text-blue-900">2024 Closing Merit</th>
                            <th className="py-2.5 px-4">2023 Closing Merit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {uni.programs.map((prog) => (
                            <tr key={prog.id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-4 font-bold text-slate-900">
                                {prog.name} ({prog.code})
                              </td>
                              <td className="py-2.5 px-4">{prog.discipline}</td>
                              <td className="py-2.5 px-4">{prog.durationYears} Years</td>
                              <td className="py-2.5 px-4">{prog.eligibility.minFscPercentage}%</td>
                              <td className="py-2.5 px-4 font-extrabold text-blue-700 tabular-nums">
                                {prog.previousClosingMerits.year2024}%
                              </td>
                              <td className="py-2.5 px-4 text-slate-500 tabular-nums">
                                {prog.previousClosingMerits.year2023}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Verified University Scholarships & Financial Assistance */}
                  {(() => {
                    const scholarships = getScholarshipsForUniversity(uni.id);
                    if (scholarships.length === 0) return null;
                    return (
                      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-500" />
                            Verified Scholarships &amp; Financial Aid at {uni.shortName}
                          </span>
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                            {scholarships.length} Schemes Available
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {scholarships.map((sch) => (
                            <div
                              key={sch.id}
                              className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-slate-900">{sch.name}</span>
                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                                  {sch.type}
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold text-blue-900 bg-blue-50 p-1.5 rounded border border-blue-200">
                                Coverage: {sch.coverage}
                              </p>
                              <p className="text-[11px] text-slate-600">
                                <strong>Eligibility:</strong> {sch.eligibility}
                              </p>
                              <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500">{sch.deadlineOrCycle}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAskAi(
                                      `Explain eligibility and application steps for "${sch.name}" at ${uni.name}. What documents are needed and what is the deadline?`,
                                      'interview'
                                    );
                                  }}
                                  className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-500" /> Inquire via AI
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Official Links & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <a
                        href={uni.admissionPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Official Admission Portal
                      </a>

                      <a
                        href={uni.samplePapersUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        Official Sample Papers
                      </a>

                      <a
                        href={uni.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 underline"
                      >
                        Main Website
                      </a>
                    </div>

                    <button
                      onClick={() =>
                        onAskAi(
                          `Can you compare ${uni.name} with other Pakistani universities for Computer Science and Engineering in terms of fee, campus life, faculty, and industry reputation?`,
                          'comparator'
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Compare with other universities in Gemini AI →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
