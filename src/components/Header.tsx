import React from 'react';
import { BookOpen, CheckCircle2, FileText, Printer, Timer, RotateCcw } from 'lucide-react';
import { Era } from '../types';

export type ActiveTab = 'summary' | 'mcq' | 'subjective' | 'mock' | 'print';

interface HeaderProps {
  era: Era;
  setEra: (era: Era) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  solvedMcqCount: number;
  totalMcqCount: number;
  solvedSubCount: number;
  totalSubCount: number;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  era,
  setEra,
  activeTab,
  setActiveTab,
  solvedMcqCount,
  totalMcqCount,
  solvedSubCount,
  totalSubCount,
  onResetProgress,
}) => {
  const totalSolved = solvedMcqCount + solvedSubCount;
  const totalQuestions = totalMcqCount + totalSubCount;
  const overallPercentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  const isGoryeo = era === 'goryeo';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Era Selector Top Ribbon */}
        <div className="flex items-center justify-between pt-2.5 pb-1 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">시대 선택:</span>
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setEra('goryeo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isGoryeo
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>🏛️ 고려 시대</span>
                <span className="text-[10px] hidden md:inline opacity-85">(89·92~97·100~101쪽)</span>
              </button>

              <button
                onClick={() => setEra('joseon')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  !isGoryeo
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>📜 조선 시대</span>
                <span className="text-[10px] hidden md:inline opacity-85">(116·122~125·132~142쪽)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 flex items-center gap-2.5 text-xs">
              <div>
                <span className="text-slate-400">현재 시대 진도:</span>{' '}
                <span className={`font-semibold ${isGoryeo ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {totalSolved}/{totalQuestions}
                </span>{' '}
                <span className="text-slate-500">({overallPercentage}%)</span>
              </div>
              <div className="w-14 h-2 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                <div
                  className={`h-full transition-all duration-300 ${
                    isGoryeo
                      ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-300'
                  }`}
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm(`현재 ${isGoryeo ? '고려 시대' : '조선 시대'}의 모든 문제 풀이 기록과 오답 노트를 초기화하시겠습니까?`)) {
                  onResetProgress();
                }
              }}
              title="현재 시대 학습 기록 초기화"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title and Scope Badge */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border ${
                isGoryeo
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isGoryeo ? '高' : '朝'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  {isGoryeo ? '고려사 시험대비 완벽 마스터' : '조선사 시험대비 완벽 마스터'}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm text-slate-950 ${
                    isGoryeo ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                >
                  {isGoryeo
                    ? '시험범위: 89쪽 · 92~97쪽 · 100~101쪽'
                    : '시험범위: 116쪽 · 122~125쪽 · 132~142쪽'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                {isGoryeo ? '고려 대외관계 & 후기 정치 변천' : '조선 통치체제 & 사화·붕당 & 왜란·호란'} 객관식 50문항 · 주관식 30문항 완벽 수록
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 pt-1 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'summary'
                ? isGoryeo
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            핵심 요약 정리
          </button>

          <button
            onClick={() => setActiveTab('mcq')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'mcq'
                ? isGoryeo
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            객관식 50제
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full ${
                activeTab === 'mcq'
                  ? 'bg-slate-950/20 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {solvedMcqCount}/50
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subjective')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'subjective'
                ? isGoryeo
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            주관식 30제
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full ${
                activeTab === 'subjective'
                  ? 'bg-slate-950/20 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {solvedSubCount}/30
            </span>
          </button>

          <button
            onClick={() => setActiveTab('mock')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'mock'
                ? isGoryeo
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Timer className="w-4 h-4" />
            실전 모의고사
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ml-auto ${
              activeTab === 'print'
                ? 'bg-sky-500 text-white font-bold shadow'
                : 'text-sky-300 hover:text-white hover:bg-sky-950/40 border border-sky-800/40'
            }`}
          >
            <Printer className="w-4 h-4" />
            시험지 인쇄 / PDF
          </button>
        </nav>
      </div>
    </header>
  );
};
