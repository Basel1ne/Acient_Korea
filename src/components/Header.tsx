import React from 'react';
import { BookOpen, CheckCircle2, FileText, Printer, Sparkles, Timer, RotateCcw } from 'lucide-react';

export type ActiveTab = 'summary' | 'mcq' | 'subjective' | 'mock' | 'print';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  solvedMcqCount: number;
  totalMcqCount: number;
  solvedSubCount: number;
  totalSubCount: number;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
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
  const overallPercentage = Math.round((totalSolved / totalQuestions) * 100);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Title and Scope Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg shadow-sm">
              高
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  고려사 시험대비 완벽 마스터
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 shadow-sm">
                  시험범위: 89쪽 · 92~97쪽 · 100~101쪽
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                객관식 50문항 · 주관식 30문항 완벽 수록 & 실전 모의고사
              </p>
            </div>
          </div>

          {/* Progress Indicator & Reset */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 flex items-center gap-3 text-xs">
              <div>
                <span className="text-slate-400">총 학습 진도:</span>{' '}
                <span className="font-semibold text-amber-400">
                  {totalSolved}/{totalQuestions}
                </span>{' '}
                <span className="text-slate-500">({overallPercentage}%)</span>
              </div>
              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm('모든 문제 풀이 기록과 오답 노트를 초기화하시겠습니까?')) {
                  onResetProgress();
                }
              }}
              title="학습 기록 초기화"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 pt-1 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'summary'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            핵심 요약 정리
          </button>

          <button
            onClick={() => setActiveTab('mcq')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'mcq'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            객관식 50제
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full ${
                activeTab === 'mcq'
                  ? 'bg-slate-950/20 text-slate-900 font-bold'
                  : 'bg-slate-800 text-amber-300'
              }`}
            >
              {solvedMcqCount}/50
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subjective')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'subjective'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            주관식 30제
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full ${
                activeTab === 'subjective'
                  ? 'bg-slate-950/20 text-slate-900 font-bold'
                  : 'bg-slate-800 text-amber-300'
              }`}
            >
              {solvedSubCount}/30
            </span>
          </button>

          <button
            onClick={() => setActiveTab('mock')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'mock'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Timer className="w-4 h-4" />
            실전 모의고사
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ml-auto ${
              activeTab === 'print'
                ? 'bg-sky-500 text-white font-semibold shadow'
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
