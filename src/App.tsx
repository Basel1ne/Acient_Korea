import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { SummarySection } from './components/SummarySection';
import { MultipleChoiceView } from './components/MultipleChoiceView';
import { SubjectiveView } from './components/SubjectiveView';
import { MockExamView } from './components/MockExamView';
import { PrintExamModal } from './components/PrintExamModal';
import { multipleChoiceQuestions } from './data/multipleChoiceQuestions';
import { subjectiveQuestions } from './data/subjectiveQuestions';
import { PageRange } from './types';
import { BookOpen, CheckCircle, GraduationCap, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [mcqPageFilter, setMcqPageFilter] = useState<PageRange | 'all'>('all');

  // Local storage persisted state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('goryeo_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('goryeo_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userTextAnswers, setUserTextAnswers] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('goryeo_sub_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userGrades, setUserGrades] = useState<Record<number, 'correct' | 'partial' | 'wrong'>>(() => {
    try {
      const saved = localStorage.getItem('goryeo_sub_grades');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('goryeo_mcq_answers', JSON.stringify(userAnswers));
    } catch (e) {
      console.error(e);
    }
  }, [userAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('goryeo_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('goryeo_sub_answers', JSON.stringify(userTextAnswers));
    } catch (e) {
      console.error(e);
    }
  }, [userTextAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('goryeo_sub_grades', JSON.stringify(userGrades));
    } catch (e) {
      console.error(e);
    }
  }, [userGrades]);

  // Handlers
  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleToggleBookmark = (questionId: number) => {
    setBookmarks((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSaveTextAnswer = (id: number, text: string) => {
    setUserTextAnswers((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const handleSetGrade = (id: number, grade: 'correct' | 'partial' | 'wrong') => {
    setUserGrades((prev) => ({
      ...prev,
      [id]: grade,
    }));
  };

  const handleResetProgress = () => {
    setUserAnswers({});
    setBookmarks([]);
    setUserTextAnswers({});
    setUserGrades({});
    localStorage.removeItem('goryeo_mcq_answers');
    localStorage.removeItem('goryeo_bookmarks');
    localStorage.removeItem('goryeo_sub_answers');
    localStorage.removeItem('goryeo_sub_grades');
  };

  const handleStartQuizWithPage = (page: PageRange) => {
    setMcqPageFilter(page);
    setActiveTab('mcq');
  };

  const solvedMcqCount = Object.keys(userAnswers).length;
  const solvedSubCount = Object.values(userTextAnswers).filter((t) => t && t.trim().length > 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        solvedMcqCount={solvedMcqCount}
        totalMcqCount={multipleChoiceQuestions.length}
        solvedSubCount={solvedSubCount}
        totalSubCount={subjectiveQuestions.length}
        onResetProgress={handleResetProgress}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'summary' && (
          <SummarySection onStartQuizWithPage={handleStartQuizWithPage} />
        )}

        {activeTab === 'mcq' && (
          <MultipleChoiceView
            questions={multipleChoiceQuestions}
            userAnswers={userAnswers}
            onSelectAnswer={handleSelectAnswer}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            initialPageFilter={mcqPageFilter}
          />
        )}

        {activeTab === 'subjective' && (
          <SubjectiveView
            questions={subjectiveQuestions}
            userTextAnswers={userTextAnswers}
            onSaveTextAnswer={handleSaveTextAnswer}
            userGrades={userGrades}
            onSetGrade={handleSetGrade}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            initialPageFilter={mcqPageFilter}
          />
        )}

        {activeTab === 'mock' && (
          <MockExamView
            mcqQuestions={multipleChoiceQuestions}
            subjectiveQuestions={subjectiveQuestions}
          />
        )}

        {activeTab === 'print' && (
          <PrintExamModal
            mcqQuestions={multipleChoiceQuestions}
            subjectiveQuestions={subjectiveQuestions}
          />
        )}
      </main>

      {/* Footer (Hidden on print) */}
      <footer className="print:hidden border-t border-slate-900 bg-slate-950/80 text-slate-500 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-slate-300">
              고려 시대 시험 대비 문제 은행 (89쪽 · 92~97쪽 · 100~101쪽)
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
