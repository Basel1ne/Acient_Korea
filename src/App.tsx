import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { SummarySection } from './components/SummarySection';
import { MultipleChoiceView } from './components/MultipleChoiceView';
import { SubjectiveView } from './components/SubjectiveView';
import { MockExamView } from './components/MockExamView';
import { PrintExamModal } from './components/PrintExamModal';

// Goryeo Data
import { summaryData as goryeoSummaryData } from './data/summaryNotes';
import { multipleChoiceQuestions as goryeoMcqQuestions } from './data/multipleChoiceQuestions';
import { subjectiveQuestions as goryeoSubQuestions } from './data/subjectiveQuestions';

// Joseon Data
import { joseonSummaryData } from './data/joseonSummaryNotes';
import { joseonMultipleChoiceQuestions } from './data/joseonMultipleChoiceQuestions';
import { joseonSubjectiveQuestions } from './data/joseonSubjectiveQuestions';

import { PageRange, Era } from './types';

export default function App() {
  const [era, setEra] = useState<Era>(() => {
    try {
      const saved = localStorage.getItem('korea_history_era');
      return (saved === 'joseon' || saved === 'goryeo') ? saved : 'joseon';
    } catch {
      return 'joseon';
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [mcqPageFilter, setMcqPageFilter] = useState<PageRange | 'all'>('all');

  // Goryeo persisted state
  const [goryeoMcqAnswers, setGoryeoMcqAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('goryeo_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [goryeoBookmarks, setGoryeoBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('goryeo_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [goryeoSubAnswers, setGoryeoSubAnswers] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('goryeo_sub_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [goryeoSubGrades, setGoryeoSubGrades] = useState<Record<number, 'correct' | 'partial' | 'wrong'>>(() => {
    try {
      const saved = localStorage.getItem('goryeo_sub_grades');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Joseon persisted state
  const [joseonMcqAnswers, setJoseonMcqAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('joseon_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [joseonBookmarks, setJoseonBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('joseon_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [joseonSubAnswers, setJoseonSubAnswers] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('joseon_sub_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [joseonSubGrades, setJoseonSubGrades] = useState<Record<number, 'correct' | 'partial' | 'wrong'>>(() => {
    try {
      const saved = localStorage.getItem('joseon_sub_grades');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save era
  useEffect(() => {
    try {
      localStorage.setItem('korea_history_era', era);
    } catch (e) {
      console.error(e);
    }
  }, [era]);

  // Save Goryeo state
  useEffect(() => {
    try {
      localStorage.setItem('goryeo_mcq_answers', JSON.stringify(goryeoMcqAnswers));
      localStorage.setItem('goryeo_bookmarks', JSON.stringify(goryeoBookmarks));
      localStorage.setItem('goryeo_sub_answers', JSON.stringify(goryeoSubAnswers));
      localStorage.setItem('goryeo_sub_grades', JSON.stringify(goryeoSubGrades));
    } catch (e) {
      console.error(e);
    }
  }, [goryeoMcqAnswers, goryeoBookmarks, goryeoSubAnswers, goryeoSubGrades]);

  // Save Joseon state
  useEffect(() => {
    try {
      localStorage.setItem('joseon_mcq_answers', JSON.stringify(joseonMcqAnswers));
      localStorage.setItem('joseon_bookmarks', JSON.stringify(joseonBookmarks));
      localStorage.setItem('joseon_sub_answers', JSON.stringify(joseonSubAnswers));
      localStorage.setItem('joseon_sub_grades', JSON.stringify(joseonSubGrades));
    } catch (e) {
      console.error(e);
    }
  }, [joseonMcqAnswers, joseonBookmarks, joseonSubAnswers, joseonSubGrades]);

  // Active dataset according to Era
  const isGoryeo = era === 'goryeo';
  const currentMcqs = isGoryeo ? goryeoMcqQuestions : joseonMultipleChoiceQuestions;
  const currentSubs = isGoryeo ? goryeoSubQuestions : joseonSubjectiveQuestions;
  const currentSummaries = isGoryeo ? goryeoSummaryData : joseonSummaryData;

  const currentMcqAnswers = isGoryeo ? goryeoMcqAnswers : joseonMcqAnswers;
  const currentBookmarks = isGoryeo ? goryeoBookmarks : joseonBookmarks;
  const currentSubAnswers = isGoryeo ? goryeoSubAnswers : joseonSubAnswers;
  const currentSubGrades = isGoryeo ? goryeoSubGrades : joseonSubGrades;

  // Handlers
  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (isGoryeo) {
      setGoryeoMcqAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    } else {
      setJoseonMcqAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    }
  };

  const handleToggleBookmark = (questionId: number) => {
    if (isGoryeo) {
      setGoryeoBookmarks((prev) =>
        prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
      );
    } else {
      setJoseonBookmarks((prev) =>
        prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
      );
    }
  };

  const handleSaveTextAnswer = (id: number, text: string) => {
    if (isGoryeo) {
      setGoryeoSubAnswers((prev) => ({ ...prev, [id]: text }));
    } else {
      setJoseonSubAnswers((prev) => ({ ...prev, [id]: text }));
    }
  };

  const handleSetGrade = (id: number, grade: 'correct' | 'partial' | 'wrong') => {
    if (isGoryeo) {
      setGoryeoSubGrades((prev) => ({ ...prev, [id]: grade }));
    } else {
      setJoseonSubGrades((prev) => ({ ...prev, [id]: grade }));
    }
  };

  const handleResetProgress = () => {
    if (isGoryeo) {
      setGoryeoMcqAnswers({});
      setGoryeoBookmarks([]);
      setGoryeoSubAnswers({});
      setGoryeoSubGrades({});
    } else {
      setJoseonMcqAnswers({});
      setJoseonBookmarks([]);
      setJoseonSubAnswers({});
      setJoseonSubGrades({});
    }
  };

  const handleStartQuizWithPage = (page: PageRange) => {
    setMcqPageFilter(page);
    setActiveTab('mcq');
  };

  const solvedMcqCount = Object.keys(currentMcqAnswers).length;
  const solvedSubCount = Object.values(currentSubAnswers).filter((t) => t && t.trim().length > 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        era={era}
        setEra={(newEra) => {
          setEra(newEra);
          setMcqPageFilter('all');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        solvedMcqCount={solvedMcqCount}
        totalMcqCount={currentMcqs.length}
        solvedSubCount={solvedSubCount}
        totalSubCount={currentSubs.length}
        onResetProgress={handleResetProgress}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'summary' && (
          <SummarySection
            key={`${era}-summary`}
            era={era}
            summaryList={currentSummaries}
            onStartQuizWithPage={handleStartQuizWithPage}
          />
        )}

        {activeTab === 'mcq' && (
          <MultipleChoiceView
            key={`${era}-mcq`}
            questions={currentMcqs}
            userAnswers={currentMcqAnswers}
            onSelectAnswer={handleSelectAnswer}
            bookmarks={currentBookmarks}
            onToggleBookmark={handleToggleBookmark}
            initialPageFilter={mcqPageFilter}
          />
        )}

        {activeTab === 'subjective' && (
          <SubjectiveView
            key={`${era}-sub`}
            questions={currentSubs}
            userTextAnswers={currentSubAnswers}
            onSaveTextAnswer={handleSaveTextAnswer}
            userGrades={currentSubGrades}
            onSetGrade={handleSetGrade}
            bookmarks={currentBookmarks}
            onToggleBookmark={handleToggleBookmark}
            initialPageFilter={mcqPageFilter}
          />
        )}

        {activeTab === 'mock' && (
          <MockExamView
            key={`${era}-mock`}
            era={era}
            mcqQuestions={currentMcqs}
            subjectiveQuestions={currentSubs}
          />
        )}

        {activeTab === 'print' && (
          <PrintExamModal
            key={`${era}-print`}
            era={era}
            mcqQuestions={currentMcqs}
            subjectiveQuestions={currentSubs}
          />
        )}
      </main>

      {/* Footer (Hidden on print) */}
      <footer className="print:hidden border-t border-slate-900 bg-slate-950/80 text-slate-500 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isGoryeo ? 'bg-amber-400' : 'bg-emerald-400'}`}
            />
            <span className="font-semibold text-slate-300">
              {isGoryeo
                ? '고려 시대 시험 대비 문제 은행 (89쪽 · 92~97쪽 · 100~101쪽)'
                : '조선 시대 시험 대비 문제 은행 (116쪽 · 122~125쪽 · 132~142쪽)'}
            </span>
          </div>
          <p className="text-center sm:text-right text-slate-500">
            객관식 50문항 · 주관식 30문항 수록 | 완벽한 시험 준비를 응원합니다!
          </p>
        </div>
      </footer>
    </div>
  );
}
