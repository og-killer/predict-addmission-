import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AdmissionPredictor } from './components/AdmissionPredictor';
import { UniversityDirectory } from './components/UniversityDirectory';
import { MeritCalculatorView } from './components/MeritCalculatorView';
import { EntryTestPrepView } from './components/EntryTestPrepView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AiAssistant } from './components/AiAssistant';
import { BrandLogo } from './components/BrandLogo';
import { ActiveTab, StudentMarks } from './types';
import {
  ShieldCheck,
  ExternalLink,
  Bot
} from 'lucide-react';

const DEFAULT_PROFILE: StudentMarks = {
  matricObtained: 960,
  matricTotal: 1100,
  fscObtained: 445,
  fscTotal: 520, // Part-1 ~85.5%
  testObtained: 148,
  testTotal: 200,
  targetTest: 'NUST NET',
  fscGroup: 'Pre-Engineering',
  domicile: 'Punjab'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('predictor');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiExternalPrompt, setAiExternalPrompt] = useState<string | null>(null);
  const [aiExternalMode, setAiExternalMode] = useState<string | null>(null);

  const [studentProfile, setStudentProfile] = useState<StudentMarks>(() => {
    try {
      const saved = localStorage.getItem('pakadmission_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PROFILE;
  });

  const handleSaveProfile = (newProfile: StudentMarks) => {
    setStudentProfile(newProfile);
    try {
      localStorage.setItem('pakadmission_student_profile', JSON.stringify(newProfile));
    } catch (e) {}
  };

  const handleAskAi = (promptText: string, mode?: string) => {
    setAiExternalPrompt(promptText);
    setAiExternalMode(mode || 'admissions');
    setIsAiAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-950">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentProfile={studentProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'predictor' && (
          <AdmissionPredictor
            studentProfile={studentProfile}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onAskAi={handleAskAi}
          />
        )}

        {activeTab === 'universities' && (
          <UniversityDirectory onAskAi={handleAskAi} />
        )}

        {activeTab === 'calculator' && (
          <MeritCalculatorView
            studentProfile={studentProfile}
            onAskAi={handleAskAi}
          />
        )}

        {activeTab === 'entry-tests' && (
          <EntryTestPrepView onAskAi={handleAskAi} />
        )}
      </main>

      {/* Footer in Deep Midnight Navy */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <BrandLogo variant="light" />
              <p className="text-xs text-slate-400 leading-relaxed max-w-md pt-2">
                Empowering Pakistani students with data-driven university admission predictions, statutory aggregate formulas, entrance exam prep (NET, ECAT, MDCAT, FAST), and Gemini AI guidance grounded in verified academic criteria.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-400 pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Formulas Verified · 2024–2025 Admissions Cycle</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-3">
                Recognized Regulatory Bodies
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a
                    href="https://www.hec.gov.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    Higher Education Commission (HEC)
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://pmdc.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    Pakistan Medical &amp; Dental Council (PM&DC)
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.pec.org.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    Pakistan Engineering Council (PEC)
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-3">
                Quick Navigation &amp; AI
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => setActiveTab('predictor')}
                    className="hover:text-white transition-colors"
                  >
                    Admission Chances Predictor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('universities')}
                    className="hover:text-white transition-colors"
                  >
                    Universities Directory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="hover:text-white transition-colors"
                  >
                    Merit Formula Calculator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('entry-tests')}
                    className="hover:text-white transition-colors"
                  >
                    Entry Test MCQs &amp; Plans
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsAiAssistantOpen(true)}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    Launch UniPathway AI Advisor
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>© 2026 UniPathway National Admissions Portal. All rights reserved.</p>
            <p className="text-[11px] max-w-xl text-right">
              Admissions predictions are estimates based on historical closing merit trends and do not constitute an official university admission offer.
            </p>
          </div>
        </div>
      </footer>

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Floating Gemini AI Assistant */}
      <AiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onOpen={() => setIsAiAssistantOpen(true)}
        studentProfile={studentProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        externalPrompt={aiExternalPrompt}
        externalMode={aiExternalMode}
        onClearExternalPrompt={() => {
          setAiExternalPrompt(null);
          setAiExternalMode(null);
        }}
      />
    </div>
  );
}
