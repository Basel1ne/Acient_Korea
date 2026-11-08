import React, { useState } from 'react';
import { summaryData } from '../data/summaryNotes';
import { PageRange } from '../types';
import { BookMarked, ChevronRight, FileCheck, HelpCircle, Layers, Quote, ShieldAlert } from 'lucide-react';

interface SummarySectionProps {
  onStartQuizWithPage: (page: PageRange) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ onStartQuizWithPage }) => {
  const [selectedPage, setSelectedPage] = useState<PageRange | 'all'>('all');

  const filteredData = selectedPage === 'all'
    ? summaryData
    : summaryData.filter((item) => item.page === selectedPage);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-slate-900 to-indigo-950/50 border border-amber-500/20 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-500/30">
                시험범위 정밀 분석 노트
              </span>
              <span className="text-xs text-slate-400">교과서 89쪽 · 92~97쪽 · 100~101쪽</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              고려 시대 시험 빈출 핵심 개념 총정리
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              교과서 본문 내용, 지도 분석, 핵심 사료(원문), 날개 팁까지 시험에 출제되는 모든 요소를 페이지별로 일목요연하게 정리했습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPage('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedPage === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              전체 보기
            </button>
            {summaryData.map((item) => (
              <button
                key={item.page}
                onClick={() => setSelectedPage(item.page)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedPage === item.page
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {item.page}쪽
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        {filteredData.map((section) => (
          <div
            key={section.page}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-slate-700 transition"
          >
            {/* Header */}
            <div className="bg-slate-800/60 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                  {section.page}p
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {section.title}
                  </h3>
                  <p className="text-xs text-slate-400">{section.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => onStartQuizWithPage(section.page)}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition"
              >
                <span>이 파트 문제 풀기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Core Points */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {pt.title}
                      </h4>
                      {pt.badge && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {pt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pt.description}
                    </p>
                    {pt.details && pt.details.length > 0 && (
                      <ul className="mt-2 space-y-1.5 text-xs text-slate-400 border-t border-slate-800/60 pt-2">
                        {pt.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5">
                            <span className="text-amber-400/80 font-bold">•</span>
                            <span className="leading-snug text-slate-300">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Quotes / Historical Sources */}
              {section.quotes && section.quotes.length > 0 && (
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Quote className="w-4 h-4" />
                    교과서 수록 핵심 사료 & 탐구 자료
                  </div>
                  <div className="space-y-3">
                    {section.quotes.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs space-y-1.5"
                      >
                        <div className="font-semibold text-amber-300">[{q.source}]</div>
                        <p className="text-slate-300 italic leading-relaxed">"{q.text}"</p>
                        <div className="text-[11px] text-emerald-400/90 pt-1 border-t border-slate-800 flex items-center gap-1.5">
                          <span className="font-semibold">핵심 분석:</span>
                          <span>{q.meaning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
