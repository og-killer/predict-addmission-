import React, { useState } from 'react';
import { Calculator, Award, Sparkles, ArrowRight } from 'lucide-react';
import { PAK_UNIVERSITIES } from '../data/universities';
import { StudentMarks } from '../utils/admissions';

interface MeritCalculatorViewProps {
  studentProfile: StudentMarks;
  onAskAi: (promptText: string, mode?: string) => void;
}

export const MeritCalculatorView: React.FC<MeritCalculatorViewProps> = ({
  studentProfile,
  onAskAi
}) => {
  const [selectedUniId, setSelectedUniId] = useState<string>('nust-islamabad');

  const [matricObt, setMatricObt] = useState<number>(studentProfile.matricObtained || 950);
  const [matricTot, setMatricTot] = useState<number>(studentProfile.matricTotal || 1100);
  const [fscObt, setFscObt] = useState<number>(studentProfile.fscObtained || 450);
  const [fscTot, setFscTot] = useState<number>(studentProfile.fscTotal || 520);
  const [testObt, setTestObt] = useState<number>(studentProfile.testObtained || 145);

  const selectedUni =
    PAK_UNIVERSITIES.find((u) => u.id === selectedUniId) || PAK_UNIVERSITIES[0];

  const testTotal =
    selectedUni.entryTestDetails?.totalMarks ||
    (selectedUni.meritFormula.id === 'fast-formula' ? 100 : 200);

  const matricPct = matricTot > 0 ? (matricObt / matricTot) * 100 : 0;
  const fscPct = fscTot > 0 ? (fscObt / fscTot) * 100 : 0;
  const testPct = testTotal > 0 ? (testObt / testTotal) * 100 : 0;

  const weights = selectedUni.meritFormula.weights;

  const matricContrib = (matricPct * (weights.matric / 100));
  const fscContrib = (fscPct * (weights.fsc / 100));
  const testContrib = (testPct * (weights.entryTest / 100));

  const totalAggregate = (matricContrib + fscContrib + testContrib).toFixed(2);

  // Target score solver calculation
  const targetRequired = 80;
  const neededFromTest = targetRequired - matricContrib - fscContrib;
  const neededTestPct = weights.entryTest > 0 ? (neededFromTest / (weights.entryTest / 100)) : 0;
  const neededTestMarks = Math.ceil((neededTestPct / 100) * testTotal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">
              <Calculator className="w-4 h-4" />
              <span>Official Formula Engine</span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span>Statutory Weights</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Pakistan University Merit Formulas &amp; Live Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Inspect how university formulas calculate aggregate step-by-step and calculate the test score required to achieve your target admission cutoff.
            </p>
          </div>

          <button
            onClick={() =>
              onAskAi(
                `Explain how ${selectedUni.name} calculates aggregate with formula "${selectedUni.meritFormula.description}". What is a safe NET/entry test score for BS Computer Science?`,
                'admissions'
              )
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Analyze in Gemini AI
          </button>
        </div>

        {/* University Selector Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          {PAK_UNIVERSITIES.map((uni) => (
            <button
              key={uni.id}
              onClick={() => {
                setSelectedUniId(uni.id);
                const tMax = uni.entryTestDetails?.totalMarks || 100;
                if (testObt > tMax) setTestObt(Math.round(tMax * 0.75));
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedUniId === uni.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {uni.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inputs & Sliders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center text-xs border border-blue-200">
                {selectedUni.shortName}
              </span>
              {selectedUni.name}
            </h2>
            <p className="text-xs text-blue-700 font-semibold mt-1">
              Official Formula: {selectedUni.meritFormula.description}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedUni.meritFormula.explanation}
            </p>
          </div>

          {/* 1. Matriculation Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                1. Matriculation / SSC ({weights.matric}% weight)
              </label>
              <span className="text-xs font-extrabold text-blue-700 tabular-nums">
                {matricPct.toFixed(1)}% (Contributes +{matricContrib.toFixed(2)}%)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Marks Obtained</span>
                <input
                  type="number"
                  min="0"
                  max={matricTot}
                  value={matricObt}
                  onChange={(e) => setMatricObt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Total Marks</span>
                <input
                  type="number"
                  min="1"
                  value={matricTot}
                  onChange={(e) => setMatricTot(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. FSc Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                2. Intermediate / HSSC ({weights.fsc}% weight)
              </label>
              <span className="text-xs font-extrabold text-blue-700 tabular-nums">
                {fscPct.toFixed(1)}% (Contributes +{fscContrib.toFixed(2)}%)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Marks Obtained</span>
                <input
                  type="number"
                  min="0"
                  max={fscTot}
                  value={fscObt}
                  onChange={(e) => setFscObt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Total Marks</span>
                <input
                  type="number"
                  min="1"
                  value={fscTot}
                  onChange={(e) => setFscTot(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Entry Test Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                3. {selectedUni.shortName} Entry Test ({weights.entryTest}% weight)
              </label>
              <span className="text-xs font-extrabold text-blue-700 tabular-nums">
                {testPct.toFixed(1)}% (Contributes +{testContrib.toFixed(2)}%)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Test Score Obtained</span>
                <input
                  type="number"
                  min="0"
                  max={testTotal}
                  value={testObt}
                  onChange={(e) => setTestObt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Total Test Marks</span>
                <input
                  type="number"
                  disabled
                  value={testTotal}
                  className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={testTotal}
              value={testObt}
              onChange={(e) => setTestObt(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right 1 Col: Live Result & Target Score */}
        <div className="space-y-4">
          {/* Total Aggregate Card in Midnight Navy */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-lg border border-slate-800 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
              Total Calculated Aggregate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-white tabular-nums">
                {totalAggregate}%
              </span>
            </div>

            {/* Visual Contribution Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
                <div
                  style={{ width: `${(matricContrib / Number(totalAggregate || 1)) * 100}%` }}
                  className="bg-sky-400 h-full"
                  title={`Matric: ${matricContrib.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${(fscContrib / Number(totalAggregate || 1)) * 100}%` }}
                  className="bg-indigo-400 h-full"
                  title={`FSc: ${fscContrib.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${(testContrib / Number(totalAggregate || 1)) * 100}%` }}
                  className="bg-blue-400 h-full"
                  title={`Test: ${testContrib.toFixed(1)}%`}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-300">
                <span>Matric: {matricContrib.toFixed(1)}%</span>
                <span>FSc: {fscContrib.toFixed(1)}%</span>
                <span>Test: {testContrib.toFixed(1)}%</span>
              </div>
            </div>

            {/* Program Comparison Preview */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block text-[11px]">
                {selectedUni.shortName} 2024 Closing Merits:
              </span>
              {selectedUni.programs.slice(0, 3).map((prog) => {
                const diff = (Number(totalAggregate) - prog.previousClosingMerits.year2024).toFixed(2);
                const isAbove = Number(diff) >= 0;
                return (
                  <div key={prog.id} className="flex items-center justify-between py-1 border-b border-slate-800/60 text-[11px]">
                    <span className="text-slate-200 truncate max-w-[140px]">{prog.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold tabular-nums">{prog.previousClosingMerits.year2024}%</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isAbove ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {isAbove ? `+${diff}%` : `${diff}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Score Solver Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              Target Score Estimator (80% Benchmark)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              With your academic record (Matric {matricPct.toFixed(1)}% &amp; FSc {fscPct.toFixed(1)}%), to achieve an aggregate of <span className="font-bold text-slate-900">80.00%</span> at {selectedUni.shortName}:
            </p>
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-center">
              <span className="text-[11px] text-blue-800 block font-medium">
                Required Entry Test Score:
              </span>
              <span className="text-2xl font-black text-blue-950 tabular-nums">
                {neededTestMarks > testTotal
                  ? `> ${testTotal} (Out of reach)`
                  : `${Math.max(0, neededTestMarks)} / ${testTotal} marks`}
              </span>
              <span className="text-[10px] text-blue-700 block mt-0.5">
                ({neededTestPct > 0 ? neededTestPct.toFixed(1) : 0}% test day performance)
              </span>
            </div>

            <button
              onClick={() =>
                onAskAi(
                  `My Matric is ${matricObt}/${matricTot} and FSc is ${fscObt}/${fscTot}. How can I realistically score ${neededTestMarks} on ${selectedUni.shortName} entry test to secure admission in BS Computer Science?`,
                  'roadmap'
                )
              }
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Ask Gemini AI for Study Strategy
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
