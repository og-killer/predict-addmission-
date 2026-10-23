import React, { useState } from 'react';
import { X, Check, Award, BookOpen, ShieldCheck } from 'lucide-react';
import { StudentMarks } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentMarks;
  onSaveProfile: (profile: StudentMarks) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<StudentMarks>({ ...profile });

  if (!isOpen) return null;

  const matricPct =
    formData.matricTotal > 0
      ? ((formData.matricObtained / formData.matricTotal) * 100).toFixed(2)
      : '0.00';
  const fscPct =
    formData.fscTotal > 0
      ? ((formData.fscObtained / formData.fscTotal) * 100).toFixed(2)
      : '0.00';
  const testPct =
    formData.testTotal && formData.testTotal > 0 && formData.testObtained !== undefined
      ? ((formData.testObtained / formData.testTotal) * 100).toFixed(2)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const setSampleMarks = (type: 'cs-aspirant' | 'med-aspirant' | 'eng-aspirant') => {
    if (type === 'cs-aspirant') {
      setFormData({
        matricObtained: 975,
        matricTotal: 1100,
        fscObtained: 445,
        fscTotal: 520, // Part-1 ~85.5%
        testObtained: 152,
        testTotal: 200,
        targetTest: 'NUST NET',
        fscGroup: 'ICS',
        domicile: 'Punjab'
      });
    } else if (type === 'med-aspirant') {
      setFormData({
        matricObtained: 1020,
        matricTotal: 1100,
        fscObtained: 1015,
        fscTotal: 1100, // ~92.2%
        testObtained: 178,
        testTotal: 200,
        targetTest: 'MDCAT',
        fscGroup: 'Pre-Medical',
        domicile: 'Punjab'
      });
    } else {
      setFormData({
        matricObtained: 920,
        matricTotal: 1100,
        fscObtained: 890,
        fscTotal: 1100,
        testObtained: 72,
        testTotal: 100,
        targetTest: 'FAST NU',
        fscGroup: 'Pre-Engineering',
        domicile: 'Sindh'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">Student Academic Profile</h2>
              <p className="text-xs text-slate-300">
                Personalizes admission predictions and Gemini AI Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick sample fillers */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Quick Presets:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSampleMarks('cs-aspirant')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              Computing (ICS)
            </button>
            <button
              type="button"
              onClick={() => setSampleMarks('med-aspirant')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              Medical (MDCAT)
            </button>
            <button
              type="button"
              onClick={() => setSampleMarks('eng-aspirant')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              Engineering
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Live percentages preview */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="block text-[11px] text-slate-500 font-medium">Matric (SSC)</span>
              <span className="text-base font-extrabold text-blue-700">{matricPct}%</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="block text-[11px] text-slate-500 font-medium">FSc / HSSC</span>
              <span className="text-base font-extrabold text-blue-700">{fscPct}%</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="block text-[11px] text-slate-500 font-medium">Entry Test</span>
              <span className="text-base font-extrabold text-blue-700">
                {testPct ? `${testPct}%` : 'Optional'}
              </span>
            </div>
          </div>

          {/* Group & Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                FSc / Intermediate Stream
              </label>
              <select
                value={formData.fscGroup || 'Pre-Engineering'}
                onChange={(e) =>
                  setFormData({ ...formData, fscGroup: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="Pre-Engineering">Pre-Engineering (Math, Phys, Chem)</option>
                <option value="ICS">ICS (Math, Phys/Stats, Computer)</option>
                <option value="Pre-Medical">Pre-Medical (Bio, Chem, Phys)</option>
                <option value="General Science">General Science</option>
                <option value="Commerce">Commerce / I.Com</option>
                <option value="Arts">Humanities / Arts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Domicile / Province
              </label>
              <select
                value={formData.domicile || 'Punjab'}
                onChange={(e) => setFormData({ ...formData, domicile: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh (Karachi / Rural)</option>
                <option value="Islamabad">Islamabad (Federal)</option>
                <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
                <option value="Balochistan">Balochistan</option>
                <option value="AJK">Azad Jammu &amp; Kashmir (AJK)</option>
              </select>
            </div>
          </div>

          {/* Matriculation */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Matriculation (SSC / O-Levels)
              </span>
              <span className="text-xs text-slate-500">Usually 10% to 17% aggregate weight</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Marks Obtained
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.matricTotal}
                  value={formData.matricObtained || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, matricObtained: Number(e.target.value) })
                  }
                  placeholder="e.g. 950"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.matricTotal || 1100}
                  onChange={(e) =>
                    setFormData({ ...formData, matricTotal: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Intermediate / FSc */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Intermediate (HSSC Part-1 or Complete)
              </span>
              <span className="text-xs text-slate-500">15% to 50% aggregate weight</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Marks Obtained
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.fscTotal}
                  value={formData.fscObtained || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, fscObtained: Number(e.target.value) })
                  }
                  placeholder="e.g. 440 (Part-1) or 920 (Total)"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.fscTotal || 1100}
                  onChange={(e) =>
                    setFormData({ ...formData, fscTotal: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Entry Test */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                Target Entry Test Score (Actual or Projected)
              </span>
              <span className="text-xs text-slate-500">33% to 75% aggregate weight</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Test Name
                </label>
                <select
                  value={formData.targetTest || 'NUST NET'}
                  onChange={(e) => {
                    const test = e.target.value;
                    let total = 200;
                    if (test === 'FAST NU' || test === 'NTS NAT') total = 100;
                    if (test === 'ECAT') total = 400;
                    setFormData({
                      ...formData,
                      targetTest: test,
                      testTotal: total
                    });
                  }}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                >
                  <option value="NUST NET">NUST NET (200)</option>
                  <option value="FAST NU">FAST NU Test (100)</option>
                  <option value="ECAT">ECAT Punjab (400)</option>
                  <option value="MDCAT">MDCAT (200)</option>
                  <option value="NED Test">NED Test (100)</option>
                  <option value="NTS NAT">NTS NAT (100)</option>
                  <option value="GIKI Test">GIKI Test (200)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Marks Obtained
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.testTotal || 200}
                  value={formData.testObtained !== undefined ? formData.testObtained : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, testObtained: Number(e.target.value) })
                  }
                  placeholder="e.g. 145"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.testTotal || 200}
                  onChange={(e) =>
                    setFormData({ ...formData, testTotal: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              Your profile is stored locally and securely. It directly personalizes aggregate formulas and Gemini AI guidance.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              Save &amp; Personalize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
