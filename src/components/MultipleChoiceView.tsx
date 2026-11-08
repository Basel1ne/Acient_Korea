import React, { useState } from 'react';
import { MultipleChoiceQuestion, PageRange } from '../types';
import {
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  ListFilter,
  Eye,
  Check,
  Award,
} from 'lucide-react';

interface MultipleChoiceViewProps {
  questions: MultipleChoiceQuestion[];
  userAnswers: Record<number, number>;
  onSelectAnswer: (questionId: number, optionIndex: number) => void;
  bookmarks: number[];
  onToggleBookmark: (questionId: number) => void;
  initialPageFilter?: PageRange | 'all';
}

export const MultipleChoiceView: React.FC<MultipleChoiceViewProps> = ({
  questions,
  userAnswers,
  onSelectAnswer,
  bookmarks,
  onToggleBookmark,
  initialPageFilter = 'all',
}) => {
  const [selectedPage, setSelectedPage] = useState<PageRange | 'all'>(initialPageFilter);
  const [filterMode, setFilterMode] = useState<'all' | 'unsolved' | 'wrong' | 'correct' | 'bookmarked'>('all');
  const [viewStyle, setViewStyle] = useState<'list' | 'single'>('list');
  const [currentSingleIndex, setCurrentSingleIndex] = useState<number>(0);
  const [showAllExplanations, setShowAllExplanations] = useState<boolean>(false);

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedPage !== 'all' && q.page !== selectedPage) return false;
    const userAnswer = userAnswers[q.id];
    if (filterMode === 'unsolved') return userAnswer === undefined;
    if (filterMode === 'wrong') return userAnswer !== undefined && userAnswer !== q.answer;
    if (filterMode === 'correct') return userAnswer === q.answer;
    if (filterMode === 'bookmarked') return bookmarks.includes(q.id);
    return true;
  });

  // Stats calculation
  const totalCount = questions.length;
  const solvedCount = Object.keys(userAnswers).length;
  const correctCount = questions.filter((q) => userAnswers[q.id] === q.answer).length;
  const wrongCount = solvedCount - correctCount;

  const currentQ = filteredQuestions[currentSingleIndex] || filteredQuestions[0];

  const optionNumbers = ['①', '②', '③', '④', '⑤'];

  return (
    <div className="space-y-6">
      {/* Top Controls & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Score & Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              {totalCount}
            </div>
            <div>
              <p className="text-xs text-slate-400">전체 문항</p>
              <p className="text-sm font-bold text-white">50 문제</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              {solvedCount}
            </div>
            <div>
              <p className="text-xs text-slate-400">푼 문제</p>
              <p className="text-sm font-bold text-sky-400">{solvedCount} / 50</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">정답</p>
              <p className="text-sm font-bold text-emerald-400">
                {correctCount}개 ({solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0}%)
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              {wrongCount}
            </div>
            <div>
              <p className="text-xs text-slate-400">오답</p>
              <p className="text-sm font-bold text-rose-400">{wrongCount}개</p>
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
              onClick={() => { setSelectedPage('all'); setCurrentSingleIndex(0); }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition whitespace-nowrap ${
                selectedPage === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              전체
            </button>
            {Array.from(new Set(questions.map((q) => q.page))).sort((a, b) => a - b).map((pg) => (
              <button
                key={pg}
                onClick={() => { setSelectedPage(pg); setCurrentSingleIndex(0); }}
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

          {/* Mode Toggles */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Style Switcher */}
            <div className="bg-slate-800 p-0.5 rounded-lg flex items-center text-xs">
              <button
                onClick={() => setViewStyle('list')}
                className={`px-2.5 py-1 rounded-md transition ${
                  viewStyle === 'list'
                    ? 'bg-slate-950 text-amber-400 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                연속 문제지 보기
              </button>
              <button
                onClick={() => setViewStyle('single')}
                className={`px-2.5 py-1 rounded-md transition ${
                  viewStyle === 'single'
                    ? 'bg-slate-950 text-amber-400 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                한 문제씩 풀기
              </button>
            </div>

            {viewStyle === 'list' && (
              <button
                onClick={() => setShowAllExplanations(!showAllExplanations)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                  showAllExplanations
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {showAllExplanations ? '전체 해설 닫기' : '전체 해설 보기'}
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400 flex items-center gap-1 whitespace-nowrap">
            <ListFilter className="w-3.5 h-3.5" /> 상태 필터:
          </span>
          <button
            onClick={() => { setFilterMode('all'); setCurrentSingleIndex(0); }}
            className={`px-2.5 py-1 rounded-md transition ${
              filterMode === 'all'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            전체 ({questions.length})
          </button>
          <button
            onClick={() => { setFilterMode('wrong'); setCurrentSingleIndex(0); }}
            className={`px-2.5 py-1 rounded-md transition ${
              filterMode === 'wrong'
                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold'
                : 'text-rose-400/80 hover:bg-rose-950/20'
            }`}
          >
            오답만 보기 ({wrongCount})
          </button>
          <button
            onClick={() => { setFilterMode('unsolved'); setCurrentSingleIndex(0); }}
            className={`px-2.5 py-1 rounded-md transition ${
              filterMode === 'unsolved'
                ? 'bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold'
                : 'text-sky-400/80 hover:bg-sky-950/20'
            }`}
          >
            안 푼 문제 ({totalCount - solvedCount})
          </button>
          <button
            onClick={() => { setFilterMode('bookmarked'); setCurrentSingleIndex(0); }}
            className={`px-2.5 py-1 rounded-md transition ${
              filterMode === 'bookmarked'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-amber-400/80 hover:bg-amber-950/20'
            }`}
          >
            북마크 ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* Quick Jump Number Palette */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 font-semibold">문항 바로가기 (1 ~ 50)</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 정답</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 오답</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> 미풀이</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const isSolved = userAnswer !== undefined;
            const isCorrect = isSolved && userAnswer === q.answer;
            const isBookmarked = bookmarks.includes(q.id);

            let bgClass = 'bg-slate-800 text-slate-300 hover:bg-slate-700';
            if (isSolved) {
              bgClass = isCorrect
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-rose-600 text-white font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  if (viewStyle === 'single') {
                    const matchIndex = filteredQuestions.findIndex((item) => item.id === q.id);
                    if (matchIndex !== -1) setCurrentSingleIndex(matchIndex);
                    else {
                      setSelectedPage('all');
                      setFilterMode('all');
                      setCurrentSingleIndex(idx);
                    }
                  } else {
                    const el = document.getElementById(`q-${q.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs flex items-center justify-center transition ${bgClass}`}
              >
                {q.id}
                {isBookmarked && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Questions: Single vs List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-base font-semibold text-slate-200">선택한 조건의 문제가 없습니다.</p>
          <p className="text-xs text-slate-500">필터를 '전체'로 변경하거나 다른 페이지를 선택해 보세요.</p>
          <button
            onClick={() => { setSelectedPage('all'); setFilterMode('all'); }}
            className="mt-3 px-4 py-2 bg-amber-500 text-slate-950 font-semibold rounded-lg text-xs"
          >
            필터 초기화
          </button>
        </div>
      ) : viewStyle === 'single' ? (
        /* Single Question Mode */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              선택된 문제 {currentSingleIndex + 1} / {filteredQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentSingleIndex === 0}
                onClick={() => setCurrentSingleIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentSingleIndex === filteredQuestions.length - 1}
                onClick={() => setCurrentSingleIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <QuestionCard
            question={currentQ}
            userAnswer={userAnswers[currentQ.id]}
            onSelectAnswer={(opt) => onSelectAnswer(currentQ.id, opt)}
            isBookmarked={bookmarks.includes(currentQ.id)}
            onToggleBookmark={() => onToggleBookmark(currentQ.id)}
            optionNumbers={optionNumbers}
            forceShowExplanation={false}
          />
        </div>
      ) : (
        /* List Mode */
        <div className="space-y-6">
          {filteredQuestions.map((q) => (
            <div id={`q-${q.id}`} key={q.id}>
              <QuestionCard
                question={q}
                userAnswer={userAnswers[q.id]}
                onSelectAnswer={(opt) => onSelectAnswer(q.id, opt)}
                isBookmarked={bookmarks.includes(q.id)}
                onToggleBookmark={() => onToggleBookmark(q.id)}
                optionNumbers={optionNumbers}
                forceShowExplanation={showAllExplanations}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface QuestionCardProps {
  question: MultipleChoiceQuestion;
  userAnswer?: number;
  onSelectAnswer: (opt: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  optionNumbers: string[];
  forceShowExplanation: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onSelectAnswer,
  isBookmarked,
  onToggleBookmark,
  optionNumbers,
  forceShowExplanation,
}) => {
  const isSolved = userAnswer !== undefined;
  const isCorrect = isSolved && userAnswer === question.answer;

  const difficultyColors = {
    기초: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    표준: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    심화: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 shadow-sm transition ${
        isSolved
          ? isCorrect
            ? 'border-emerald-500/40 bg-slate-900/95'
            : 'border-rose-500/40 bg-slate-900/95'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Meta */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow">
            {question.id}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
            {question.page}쪽
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {question.section}
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
              difficultyColors[question.difficulty]
            }`}
          >
            {question.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSolved && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> 정답
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" /> 오답
                </>
              )}
            </span>
          )}

          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? '북마크 해제' : '북마크 추가'}
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

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug mb-4">
        {question.question}
      </h3>

      {/* Historical Passage / Quote if present */}
      {question.passage && (
        <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 mb-4 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed border-l-4 border-l-amber-500">
          {question.passage}
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          const optionNumber = idx + 1;
          const isSelected = userAnswer === optionNumber;
          const isThisCorrect = question.answer === optionNumber;

          let btnClass = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700';

          if (isSolved) {
            if (isThisCorrect) {
              btnClass = 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200 font-semibold ring-1 ring-emerald-500/30';
            } else if (isSelected && !isThisCorrect) {
              btnClass = 'bg-rose-950/40 border-rose-500/70 text-rose-200 line-through opacity-90';
            } else {
              btnClass = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(optionNumber)}
              className={`w-full text-left p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-start gap-3 ${btnClass}`}
            >
              <span
                className={`font-semibold shrink-0 text-sm mt-0.5 ${
                  isSolved && isThisCorrect
                    ? 'text-emerald-400'
                    : isSelected
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {optionNumbers[idx]}
              </span>
              <span className="leading-snug">{opt}</span>
              {isSolved && isThisCorrect && (
                <span className="ml-auto text-xs font-bold text-emerald-400 shrink-0 bg-emerald-500/20 px-2 py-0.5 rounded">
                  정답
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detailed Explanation */}
      {(isSolved || forceShowExplanation) && (
        <div className="mt-5 bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> 정답: {optionNumbers[question.answer - 1]}번
              </span>
              <span className="text-xs text-slate-400">| 개념: {question.keyConcept}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">교과서 {question.page}쪽</span>
          </div>

          <p className="text-slate-300 leading-relaxed pt-1">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
