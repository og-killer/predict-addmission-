import React from 'react';
import {
  Sparkles,
  Calculator,
  Compass,
  BookOpen,
  UserCheck,
  Building2,
  Bot,
  GraduationCap
} from 'lucide-react';
import { ActiveTab, StudentMarks } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  studentProfile: StudentMarks;
  onOpenProfileModal: () => void;
  onOpenAiAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studentProfile,
  onOpenProfileModal,
  onOpenAiAssistant
}) => {
  const hasMarks = studentProfile.fscObtained > 0;
  const fscPct = hasMarks
    ? ((studentProfile.fscObtained / studentProfile.fscTotal) * 100).toFixed(1)
    : null;

  return (
    <header className="sticky top-0 z-30 bg-slate-950 text-white shadow-lg border-b border-slate-800">
      {/* Top Institutional Ribbon */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="font-medium text-slate-300">
              National Higher Education Admissions Intelligence System
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">HEC Recognized Standard</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:inline text-slate-400">Academic Intake 2026–2027</span>
            <span className="text-blue-400 font-semibold flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              11 Top Universities Verified
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo Zone */}
          <div
            onClick={() => setActiveTab('predictor')}
            className="cursor-pointer group flex items-center"
          >
            <BrandLogo variant="light" />
          </div>

          {/* Desktop Navigation Links (Zone 2) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('predictor')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wide transition-all rounded-lg ${
                activeTab === 'predictor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-400" />
              Admission Predictor
            </button>

            <button
              onClick={() => setActiveTab('universities')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wide transition-all rounded-lg ${
                activeTab === 'universities'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              Universities &amp; Merits
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wide transition-all rounded-lg ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 text-blue-400" />
              Merit Calculator
            </button>

            <button
              onClick={() => setActiveTab('entry-tests')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wide transition-all rounded-lg ${
                activeTab === 'entry-tests'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              Entry Tests &amp; MCQs
            </button>
          </nav>

          {/* Right Action Items (Zone 3) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Academic Profile Trigger */}
            <button
              onClick={onOpenProfileModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                hasMarks
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
              title="Click to view or edit academic profile"
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              <div className="text-left hidden sm:block">
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                  Profile
                </span>
                <span className="font-bold text-white">
                  {hasMarks ? `FSc ${fscPct}%` : 'Set Marks'}
                </span>
              </div>
              <span className="sm:hidden font-bold">
                {hasMarks ? `${fscPct}%` : 'Profile'}
              </span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4 text-blue-200" />
              <span className="hidden sm:inline">UniPathway AI Advisor</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('predictor')}
            className={`py-1.5 px-2.5 rounded-lg ${
              activeTab === 'predictor' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Predictor
          </button>
          <button
            onClick={() => setActiveTab('universities')}
            className={`py-1.5 px-2.5 rounded-lg ${
              activeTab === 'universities' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Universities
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-1.5 px-2.5 rounded-lg ${
              activeTab === 'calculator' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('entry-tests')}
            className={`py-1.5 px-2.5 rounded-lg ${
              activeTab === 'entry-tests' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Tests
          </button>
        </div>
      </div>
    </header>
  );
};
