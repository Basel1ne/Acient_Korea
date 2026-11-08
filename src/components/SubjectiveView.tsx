import React, { useState } from 'react';
import { SubjectiveQuestion, PageRange } from '../types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
  AlertCircle,
  Award,
  Send,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SubjectiveViewProps {
  questions: SubjectiveQuestion[];
  userTextAnswers: Record<number, string>;
  onSaveTextAnswer: (id: number, text: string) => void;
  userGrades: Record<number, 'correct' | 'partial' | 'wrong'>;
  onSetGrade: (id: number, grade: 'correct' | 'partial' | 'wrong') => void;
  bookmarks: number[];
  onToggleBookmark: (id: number) => void;
  initialPageFilter?: PageRange | 'all';
}

export const SubjectiveView: React.FC<SubjectiveViewProps> = ({
  questions,
  userTextAnswers,
  onSaveTextAnswer,
  userGrades,
  onSetGrade,
  bookmarks,
  onToggleBookmark,
  initialPageFilter = 'all',
}) => {
  const [selectedPage, setSelectedPage] = useState<PageRange | 'all'>(initialPageFilter);
  const [selectedType, setSelectedType] = useState<'all' | '단답형' | '빈칸 채우기' | '서술형'>('all');
  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedPage !== 'all' && q.page !== selectedPage) return false;
    if (selectedType !== 'all' && q.type !== selectedType) return false;
    return true;
  });

  const toggleReveal = (id: number) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Grade statistics
  const totalCount = questions.length;
  const answeredCount = Object.values(userTextAnswers).filter((t) => t && t.trim().length > 0).length;
  const correctCount = Object.values(userGrades).filter((g) => g === 'correct').length;
  const partialCount = Object.values(userGrades).filter((g) => g === 'partial').length;
  const wrongCount = Object.values(userGrades).filter((g) => g === 'wrong').length;

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              {totalCount}
            </div>
            <div>
              <p className="text-xs text-slate-400">전체 주관식</p>
              <p className="text-sm font-bold text-white">30 문제</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              {answeredCount}
            </div>
            <div>
              <p className="text-xs text-slate-400">답안 작성 완료</p>
              <p className="text-sm font-bold text-sky-400">{answeredCount} / 30</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">완전 정답</p>
              <p className="text-sm font-bold text-emerald-400">{correctCount}개</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">부분 점수</p>
              <p className="text-sm font-bold text-amber-400">{partialCount}개</p>
            </div>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          {/* Page Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> 페이지:
            </span>
            <button
              onClick={() => setSelectedPage('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition whitespace-nowrap ${
                selectedPage === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              전체
            </button>
            {([89, 92, 93, 94, 95, 96, 97, 100, 101] as PageRange[]).map((pg) => (
              <button
                key={pg}
                onClick={() => setSelectedPage(pg)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition whitespace-nowrap ${
                  selectedPage === pg
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {pg}p
              </button>
            ))}
          </div>

          {/* Type Filter & Toggle All */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="bg-slate-800 p-0.5 rounded-lg flex items-center text-xs">
              {(['all', '단답형', '빈칸 채우기', '서술형'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    selectedType === t
                      ? 'bg-slate-950 text-amber-400 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'all' ? '전체 유형' : t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                showAllAnswers
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {showAllAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showAllAnswers ? '전체 정답 숨기기' : '전체 모범답안 보기'}
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q) => {
          const userText = userTextAnswers[q.id] || '';
          const isRevealed = showAllAnswers || !!revealedAnswers[q.id];
          const grade = userGrades[q.id];
          const isBookmarked = bookmarks.includes(q.id);

          // Check keywords present in userText
          const matchedKeywords = q.keyWords.filter((kw) =>
            userText.toLowerCase().includes(kw.toLowerCase())
          );
          const missingKeywords = q.keyWords.filter(
            (kw) => !userText.toLowerCase().includes(kw.toLowerCase())
          );

          return (
            <div
              key={q.id}
              className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 shadow-sm transition ${
                grade === 'correct'
                  ? 'border-emerald-500/40'
                  : grade === 'partial'
                  ? 'border-amber-500/40'
                  : grade === 'wrong'
                  ? 'border-rose-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow">
                    주{q.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                    {q.page}쪽
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {q.type}
                  </span>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    {q.section}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {grade && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        grade === 'correct'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : grade === 'partial'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {grade === 'correct' ? '정답 인정 (100%)' : grade === 'partial' ? '부분 점수' : '오답 / 복습'}
                    </span>
                  )}

                  <button
                    onClick={() => onToggleBookmark(q.id)}
                    className={`p-1.5 rounded-lg border transition ${
                      isBookmarked
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-amber-300'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* Question Body */}
              <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug mb-3">
                {q.question}
              </h3>

              {/* Passage */}
              {q.passage && (
                <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 mb-4 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed border-l-4 border-l-amber-500">
                  {q.passage}
                </div>
              )}

              {/* Answer Input Box */}
              <div className="space-y-2 mb-4">
                <label className="block text-xs font-semibold text-slate-400">
                  답안 작성란:
                </label>
                <textarea
                  rows={q.type === '서술형' ? 4 : 2}
                  value={userText}
                  onChange={(e) => onSaveTextAnswer(q.id, e.target.value)}
                  placeholder={
                    q.type === '단답형' || q.type === '빈칸 채우기'
                      ? '정답 단어나 인물명, 지역명을 입력하세요...'
                      : '조건과 근거를 갖추어 서술형 답안을 작성하세요...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 transition resize-y"
                />
              </div>

              {/* Action Buttons: Reveal Answer / Grade */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => toggleReveal(q.id)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
                >
                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {isRevealed ? '모범답안 접기' : '정답 및 채점기준 확인'}
                </button>

                {/* Self Grading Buttons */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">자가 채점:</span>
                  <button
                    onClick={() => onSetGrade(q.id, 'correct')}
                    className={`px-2.5 py-1 rounded-md transition font-medium ${
                      grade === 'correct'
                        ? 'bg-emerald-600 text-white font-bold shadow'
                        : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/40'
                    }`}
                  >
                    정답 (100%)
                  </button>
                  <button
                    onClick={() => onSetGrade(q.id, 'partial')}
                    className={`px-2.5 py-1 rounded-md transition font-medium ${
                      grade === 'partial'
                        ? 'bg-amber-600 text-white font-bold shadow'
                        : 'bg-amber-950/40 text-amber-400 hover:bg-amber-900/50 border border-amber-800/40'
                    }`}
                  >
                    부분 점수 (50%)
                  </button>
                  <button
                    onClick={() => onSetGrade(q.id, 'wrong')}
                    className={`px-2.5 py-1 rounded-md transition font-medium ${
                      grade === 'wrong'
                        ? 'bg-rose-600 text-white font-bold shadow'
                        : 'bg-rose-950/40 text-rose-400 hover:bg-rose-900/50 border border-rose-800/40'
                    }`}
                  >
                    오답 (0%)
                  </button>
                </div>
              </div>

              {/* Model Answer & Criteria Accordion */}
              {isRevealed && (
                <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
                  {/* Model Answer */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> 모범 답안
                    </span>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-emerald-300 font-semibold leading-relaxed">
                      {q.answer}
                    </div>
                  </div>

                  {/* Keyword analysis if user typed something */}
                  {userText.trim().length > 0 && (
                    <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg space-y-2">
                      <span className="text-[11px] font-bold text-slate-300 block">
                        작성 답안 핵심 키워드 일치 분석:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] flex items-center gap-1 font-medium"
                          >
                            <Check className="w-3 h-3" /> {kw}
                          </span>
                        ))}
                        {missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded text-[11px] flex items-center gap-1 line-through"
                          >
                            {kw} (누락)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scoring Criteria */}
                  {q.criteria && q.criteria.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        채점 기준표:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50">
                        {q.criteria.map((cr, idx) => (
                          <li key={idx} className="leading-snug">{cr}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="border-t border-slate-800 pt-3">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      상세 해설 & 교과서 연계:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {q.explanation}
                    </p>
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
