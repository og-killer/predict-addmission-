import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Minimize2,
  Maximize2,
  AlertTriangle,
  User,
  GraduationCap,
  BrainCircuit,
  Compass,
  GitCompare,
  FileCheck
} from 'lucide-react';
import { ChatMessage, StudentMarks, GeminiAiMode } from '../types';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  studentProfile: StudentMarks;
  onOpenProfileModal: () => void;
  externalPrompt?: string | null;
  externalMode?: string | null;
  onClearExternalPrompt?: () => void;
}

const AI_MODES: Array<{
  id: GeminiAiMode;
  name: string;
  shortLabel: string;
  icon: any;
  description: string;
  welcomeSnippet: string;
  sampleQuestions: string[];
}> = [
  {
    id: 'admissions',
    name: 'Admissions & Aggregate Advisor',
    shortLabel: 'Admissions',
    icon: Compass,
    description: 'Calculates aggregate, evaluates 2024 closing merits, and recommends programs.',
    welcomeSnippet: 'I am in **Admissions & Aggregate Mode**. I compare your marks with 2024 closing merits across Pakistan (NUST, FAST, UET, NED, MDCAT) using exact statutory formulas.',
    sampleQuestions: [
      'Find universities for my marks',
      'Explain my aggregate',
      'What are my admission chances for BS CS?',
      'Which universities offer BS Computer Science in Sindh?'
    ]
  },
  {
    id: 'tutor',
    name: 'Entry Test Tutor & MCQ Solver',
    shortLabel: 'Test Tutor',
    icon: BrainCircuit,
    description: 'Solves complex Math/Physics/Bio problems, teaches speed shortcuts, and generates practice questions.',
    welcomeSnippet: 'I am in **Test Tutor Mode** ⚡. Ask me to solve any past paper question, explain difficult concepts in Physics/Math/Biology, or generate practice questions with solutions.',
    sampleQuestions: [
      'Generate a practice MCQ for NUST NET Math',
      'Teach me calculus derivatives speed shortcuts',
      'Explain Le Chatelier principle with MDCAT examples',
      'How to manage negative marking in FAST NU test?'
    ]
  },
  {
    id: 'roadmap',
    name: 'Study Roadmap Architect',
    shortLabel: 'Roadmap',
    icon: GraduationCap,
    description: 'Designs customized 30-day/60-day study timetables targeting your weak subjects.',
    welcomeSnippet: 'I am in **Roadmap Architect Mode** 🗺️. Tell me your target test (NET, ECAT, MDCAT, FAST) and weak areas to receive a structured daily revision plan.',
    sampleQuestions: [
      'Create a 30-day NUST NET preparation plan',
      'How to revise FSc Physics in 2 weeks?',
      'High-weightage chapters for Punjab ECAT',
      'Daily timetable for MDCAT repeater'
    ]
  },
  {
    id: 'comparator',
    name: 'University & Degree Comparator',
    shortLabel: 'Comparator',
    icon: GitCompare,
    description: 'Objective side-by-side comparison of fees, hostels, faculty, and industry reputation.',
    welcomeSnippet: 'I am in **University Comparator Mode** ⚖️. I provide unbiased, verified comparisons between Pakistani universities, curriculum differences, and job market demand.',
    sampleQuestions: [
      'Compare NUST vs FAST for BS Computer Science',
      'GIKI vs UET Lahore for Mechanical Engineering',
      'Public Medical Colleges vs Private MBBS in Punjab',
      'NED BCIT vs FAST Karachi CS curriculum'
    ]
  },
  {
    id: 'interview',
    name: 'Interview & Document Coach',
    shortLabel: 'Interview & SOP',
    icon: FileCheck,
    description: 'Guides on IBA/Medical interviews, Statements of Purpose, IBCC equivalency, and quotas.',
    welcomeSnippet: 'I am in **Interview & Document Mode** 📝. Ask about IBCC equivalency, required matric/FSc attestations, quota seat criteria, or admission interview practice.',
    sampleQuestions: [
      'What questions are asked in IBA admission interviews?',
      'How to get IBCC equivalency for O/A-Levels?',
      'Quota seats rules for rural Sindh & Balochistan',
      'Tips for writing a personal statement for LUMS'
    ]
  }
];

export const AiAssistant: React.FC<AiAssistantProps> = ({
  isOpen,
  onClose,
  onOpen,
  studentProfile,
  onOpenProfileModal,
  externalPrompt,
  externalMode,
  onClearExternalPrompt
}) => {
  const [activeMode, setActiveMode] = useState<GeminiAiMode>('admissions');

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('unipathway_chat_history_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `**Assalam-o-Alaikum!** I'm your **UniPathway AI Advisor** 🤖

I am connected directly to Pakistan's verified database of higher education institutions, statutory merit formulas, and official closing cutoffs.

You can switch between specialized **Gemini AI Modes** at any time:
* **Admissions**: Evaluate your chances & merit formulas against official 2024 closing cutoffs.
* **Test Tutor**: Step-by-step problem solver and practice MCQs with speed shortcuts.
* **Roadmap**: Week-by-week structured timetables for NET, ECAT, MDCAT, and FAST NU.
* **Comparator**: Unbiased side-by-side comparative matrices of universities & programs.
* **Interview & Docs**: IBCC equivalency, quota criteria, and interview preparation.

Select a specialized mode or choose a question below to begin!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'admissions'
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentModeConfig = AI_MODES.find((m) => m.id === activeMode) || AI_MODES[0];

  useEffect(() => {
    try {
      localStorage.setItem('pak_admission_chat_history_v2', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (externalPrompt) {
      if (externalMode && AI_MODES.some((m) => m.id === externalMode)) {
        setActiveMode(externalMode as GeminiAiMode);
      }
      onOpen();
      handleSendMessage(externalPrompt, (externalMode as GeminiAiMode) || activeMode);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt, externalMode]);

  const handleSendMessage = async (textToSend?: string, modeOverride?: GeminiAiMode) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const currentMode = modeOverride || activeMode;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: currentMode
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode: currentMode,
          history: historyPayload,
          studentProfile: {
            matricObtained: studentProfile.matricObtained,
            matricTotal: studentProfile.matricTotal,
            fscObtained: studentProfile.fscObtained,
            fscTotal: studentProfile.fscTotal,
            testObtained: studentProfile.testObtained,
            testTotal: studentProfile.testTotal,
            fscGroup: studentProfile.fscGroup,
            domicile: studentProfile.domicile
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am ready to help with your Pakistani university admission query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedUniversities: data.matchedUniversities,
        notice: data.notice,
        mode: currentMode
      };

      if (data.notice) {
        setApiNotice(data.notice);
      }

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        role: 'assistant',
        content: `Connection interrupted while contacting the Gemini AI engine. Showing verified university database fallback below.\n\n*You can also inspect verified formula specifications and historical closing merits directly in the **Universities & Merits** tab.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: currentMode
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleModeChange = (newMode: GeminiAiMode) => {
    setActiveMode(newMode);
    const modeObj = AI_MODES.find((m) => m.id === newMode);
    if (!modeObj) return;

    const noticeMsg: ChatMessage = {
      id: `mode-switch-${Date.now()}`,
      role: 'assistant',
      content: `Switched to **${modeObj.name}** mode.\n\n${modeObj.welcomeSnippet}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: newMode
    };
    setMessages((prev) => [...prev, noticeMsg]);
  };

  const clearChat = () => {
    if (window.confirm('Clear conversation history?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: `Conversation cleared. I am ready in **${currentModeConfig.name}** mode. What would you like to explore?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: activeMode
        }
      ]);
      localStorage.removeItem('pak_admission_chat_history_v2');
    }
  };

  const hasStudentMarks = studentProfile.fscObtained > 0;
  const fscPct = hasStudentMarks
    ? ((studentProfile.fscObtained / studentProfile.fscTotal) * 100).toFixed(1)
    : null;

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed break-words font-sans">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-extrabold text-sm text-slate-900 mt-2.5 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-black text-base text-slate-900 mt-3 mb-1">
                {line.replace('## ', '')}
              </h3>
            );
          }

          if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) {
            const raw = line.slice(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-blue-600 font-bold leading-5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(raw) }} />
              </div>
            );
          }

          if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+\.)\s(.*)$/);
            if (match) {
              return (
                <div key={idx} className="flex items-start gap-2 pl-1">
                  <span className="font-bold text-blue-700 min-w-[16px]">{match[1]}</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(match[2]) }} />
                </div>
              );
            }
          }

          if (line.includes('AI-generated practice question') || line.includes('AI Practice Note')) {
            return (
              <div key={idx} className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5 my-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
              </div>
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text: string) => {
    let out = text;
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>');
    out = out.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');
    out = out.replace(
      /\[(.*?)\]\((https?:\/\/.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 font-bold underline inline-flex items-center gap-0.5">$1 ↗</a>'
    );
    return out;
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Open Gemini AI Assistant"
          className="fixed bottom-5 right-5 z-40 group flex items-center gap-3 p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white shadow-xl hover:shadow-2xl border border-blue-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full border-2 border-slate-950" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">
                Gemini AI Advisor
              </span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-xs font-black tracking-tight text-white block">
              UniPathway Advisor
            </span>
          </div>
        </button>
      )}

      {/* Modern Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 flex flex-col bg-white shadow-2xl border border-slate-200 overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-6 rounded-2xl'
              : 'bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-[460px] h-[95vh] sm:h-[680px] max-h-[95vh] rounded-t-2xl sm:rounded-2xl'
          }`}
        >
          {/* Executive Header in Midnight Navy */}
          <div className="px-4 py-3 bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs border border-blue-400/30 shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight">
                    UniPathway AI Advisor
                  </h3>
                  <span className="text-[9px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Gemini 3.1
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>National Admissions Intelligence</span>
                </div>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear Conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore Size' : 'Expand'}
                className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                title="Close Assistant"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Gemini AI Mode Switcher Strip */}
          <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap pl-1 pr-1">
              AI Mode:
            </span>
            {AI_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={mode.description}
                >
                  <Icon className="w-3 h-3" />
                  <span>{mode.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Active Mode Notification Bar */}
          <div className="px-4 py-1.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1.5 text-blue-950 font-medium">
              <currentModeConfig.icon className="w-3.5 h-3.5 text-blue-600" />
              <span>
                <strong>Mode:</strong> {currentModeConfig.name}
              </span>
            </div>
            {hasStudentMarks ? (
              <span className="text-[11px] text-blue-800 font-semibold hidden sm:inline">
                FSc {fscPct}% · Matric {studentProfile.matricObtained}/{studentProfile.matricTotal}
              </span>
            ) : (
              <button
                onClick={onOpenProfileModal}
                className="text-[11px] font-bold text-blue-700 underline hover:text-blue-900"
              >
                Set Marks
              </button>
            )}
          </div>

          {/* API notice if present */}
          {apiNotice && (
            <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="line-clamp-1">{apiNotice}</span>
              </div>
              <button
                onClick={() => setApiNotice(null)}
                className="text-amber-700 hover:text-amber-950 font-bold ml-2 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-700 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-2xs ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}

                    {!isUser && msg.matchedUniversities && msg.matchedUniversities.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold block w-full mb-0.5">
                          Verified Official Portals:
                        </span>
                        {msg.matchedUniversities.map((uni) => (
                          <a
                            key={uni.id}
                            href={uni.admissionPortalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200 transition-colors"
                          >
                            {uni.shortName} Admissions
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isUser ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-2 animate-pulse">
                <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-2xs flex items-center gap-1.5">
                  <span className="text-xs text-slate-600 font-medium">Gemini AI is consulting university database</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Mode-Specific Suggested Questions */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Suggested for {currentModeConfig.shortLabel}:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {currentModeConfig.sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-3 py-1 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-900 text-xs font-semibold transition-all shadow-2xs active:scale-[0.98] disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Send Area */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${currentModeConfig.shortLabel} AI (e.g. marks, formulas, test prep)...`}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-60 transition-colors"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm transition-all active:scale-[0.98] shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-center text-slate-400 mt-1.5">
              Powered by Google Gemini &amp; Verified National Admissions Grounding.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
