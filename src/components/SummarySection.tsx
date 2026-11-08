import React, { useState } from 'react';
import { ExamSummarySection, PageRange, Era } from '../types';
import { ChevronRight, Quote } from 'lucide-react';

interface SummarySectionProps {
  era: Era;
  summaryList: ExamSummarySection[];
  onStartQuizWithPage: (page: PageRange) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  era,
  summaryList,
  onStartQuizWithPage,
}) => {
  const [selectedPage, setSelectedPage] = useState<PageRange | 'all'>('all');

  const isGoryeo = era === 'goryeo';
  const filteredData = selectedPage === 'all'
    ? summaryList
    : summaryList.filter((item) => item.page === selectedPage);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className={`border rounded-2xl p-6 shadow-sm transition ${
          isGoryeo
            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/50 border-amber-500/20'
            : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/50 border-emerald-500/20'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                  isGoryeo
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {isGoryeo ? '고려 시대 시험범위 정밀 분석' : '조선 시대 시험범위 정밀 분석'}
              </span>
              <span className="text-xs text-slate-400">
                {isGoryeo ? '89쪽 · 92~97쪽 · 100~101쪽' : '116쪽 · 122~125쪽 · 132~142쪽'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isGoryeo ? '고려 시대 시험 빈출 핵심 개념 총정리' : '조선 시대 시험 빈출 핵심 개념 총정리'}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              교과서 본문 내용, 지도 분석, 핵심 사료(원문), 날개 팁까지 시험에 출제되는 모든 요소를 페이지별로 일목요연하게 정리했습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedPage('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedPage === 'all'
                  ? isGoryeo
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              전체 보기
            </button>
            {summaryList.map((item) => (
              <button
                key={item.page}
                onClick={() => setSelectedPage(item.page)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedPage === item.page
                    ? isGoryeo
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-emerald-500 text-slate-950 font-bold shadow'
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
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                    isGoryeo
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
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
                className={`self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                  isGoryeo
                    ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30'
                }`}
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
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isGoryeo ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        {pt.title}
                      </h4>
                      {pt.badge && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                            isGoryeo
                              ? 'bg-slate-800 text-amber-300 border-slate-700'
                              : 'bg-slate-800 text-emerald-300 border-slate-700'
                          }`}
                        >
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
                            <span
                              className={`font-bold ${
                                isGoryeo ? 'text-amber-400/80' : 'text-emerald-400/80'
                              }`}
                            >
                              •
                            </span>
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
                <div
                  className={`border rounded-xl p-4 space-y-3 ${
                    isGoryeo
                      ? 'bg-amber-950/20 border-amber-500/20'
                      : 'bg-emerald-950/20 border-emerald-500/20'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                      isGoryeo ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    <Quote className="w-4 h-4" />
                    교과서 수록 핵심 사료 & 탐구 자료
                  </div>
                  <div className="space-y-3">
                    {section.quotes.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs space-y-1.5"
                      >
                        <div
                          className={`font-semibold ${
                            isGoryeo ? 'text-amber-300' : 'text-emerald-300'
                          }`}
                        >
                          [{q.source}]
                        </div>
                        <p className="text-slate-300 italic leading-relaxed">"{q.text}"</p>
                        <div className="text-[11px] text-sky-400/90 pt-1 border-t border-slate-800 flex items-center gap-1.5">
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
