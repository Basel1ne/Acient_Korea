import React, { useState } from 'react';
import { MultipleChoiceQuestion, SubjectiveQuestion } from '../types';
import { Printer, Download, Eye, EyeOff, FileText, CheckCircle, BookOpen } from 'lucide-react';

interface PrintExamModalProps {
  mcqQuestions: MultipleChoiceQuestion[];
  subjectiveQuestions: SubjectiveQuestion[];
}

type PrintMode = 'all_questions' | 'mcq_only' | 'subjective_only' | 'answer_key' | 'full_solution';

export const PrintExamModal: React.FC<PrintExamModalProps> = ({
  mcqQuestions,
  subjectiveQuestions,
}) => {
  const [printMode, setPrintMode] = useState<PrintMode>('all_questions');
  const [includeAnswers, setIncludeAnswers] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const optionNumbers = ['①', '②', '③', '④', '⑤'];

  return (
    <div className="space-y-6">
      {/* Print Controls (Hidden on Print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              시험지 인쇄 및 PDF 저장
            </span>
            <h2 className="text-xl font-bold text-white mt-2">
              실제 종이 시험지 & 정답해설지 인쇄 모드
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              아래 옵션을 선택한 뒤 [인쇄하기]를 누르면 브라우저 인쇄 창이 열리며 PDF로 저장하거나 프린터로 출력할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" /> 지금 인쇄하기 (PDF 저장)
            </button>
          </div>
        </div>

        {/* Print Type Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-semibold mr-1">출력 유형:</span>
          <button
            onClick={() => { setPrintMode('all_questions'); setIncludeAnswers(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              printMode === 'all_questions' && !includeAnswers
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            전체 시험지 (객관식 50 + 주관식 30)
          </button>
          <button
            onClick={() => { setPrintMode('mcq_only'); setIncludeAnswers(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              printMode === 'mcq_only' && !includeAnswers
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            객관식 50제 문제지
          </button>
          <button
            onClick={() => { setPrintMode('subjective_only'); setIncludeAnswers(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              printMode === 'subjective_only' && !includeAnswers
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            주관식 30제 문제지
          </button>
          <button
            onClick={() => { setPrintMode('answer_key'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              printMode === 'answer_key'
                ? 'bg-emerald-500 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            빠른 정답표
          </button>
          <button
            onClick={() => { setPrintMode('full_solution'); setIncludeAnswers(true); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              printMode === 'full_solution'
                ? 'bg-indigo-500 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            정답 및 상세 해설지
          </button>
        </div>
      </div>

      {/* Printable Sheet Viewport */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-md print:p-0 print:shadow-none print:rounded-none max-w-4xl mx-auto border border-slate-200 print:border-none">
        {/* Test Paper Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>2026학년도 역사과 평가 대비</span>
            <span>교과서 89쪽 · 92~97쪽 · 100~101쪽</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-center text-slate-950 my-2 tracking-tight">
            고려의 대외 관계와 고려 후기 정치 변천 시험 문제지
          </h1>
          <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-300">
            <span>제 2 학년 ( &nbsp;&nbsp;&nbsp;&nbsp; ) 반 ( &nbsp;&nbsp;&nbsp;&nbsp; ) 번</span>
            <span>성명: ____________________</span>
            <span>배점: 100점 만점</span>
          </div>
        </div>

        {/* Quick Answer Key View */}
        {printMode === 'answer_key' ? (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b pb-2 text-slate-950">
              [빠른 정답표]
            </h2>

            <div>
              <h3 className="font-bold text-sm mb-2 text-slate-800">■ 객관식 50문항 정답표</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-center text-xs">
                {mcqQuestions.map((q) => (
                  <div key={q.id} className="border border-slate-300 p-1.5 rounded">
                    <span className="block font-bold text-slate-600">{q.id}</span>
                    <span className="block font-bold text-blue-700 text-sm">
                      {optionNumbers[q.answer - 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-sm mb-2 text-slate-800">■ 주관식 30문항 정답 요약</h3>
              <div className="space-y-2 text-xs">
                {subjectiveQuestions.map((q) => (
                  <div key={q.id} className="border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-800 mr-2">[주{q.id}] ({q.page}쪽)</span>
                    <span className="font-medium text-slate-900">{q.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Multiple Choice Section */}
            {(printMode === 'all_questions' || printMode === 'mcq_only' || printMode === 'full_solution') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1">
                  <h2 className="text-base font-black text-slate-900">
                    [제 1 부] 5지 선다형 객관식 (1번 ~ 50번)
                  </h2>
                  <span className="text-xs text-slate-600">각 1.4점 ~ 2점</span>
                </div>

                <div className="space-y-6">
                  {mcqQuestions.map((q) => (
                    <div key={q.id} className="text-xs sm:text-sm text-slate-900 space-y-2 break-inside-avoid">
                      <div className="font-bold flex items-start gap-1.5">
                        <span className="shrink-0">{q.id}.</span>
                        <span className="leading-snug">{q.question}</span>
                        <span className="text-[11px] text-slate-500 font-normal shrink-0 ml-1">
                          [{q.page}쪽]
                        </span>
                      </div>

                      {q.passage && (
                        <div className="bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-800 whitespace-pre-line leading-relaxed my-1.5">
                          {q.passage}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-4 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`flex items-start gap-1.5 leading-snug ${
                              printMode === 'full_solution' && q.answer === optIdx + 1
                                ? 'font-bold text-blue-700'
                                : ''
                            }`}
                          >
                            <span className="shrink-0">{optionNumbers[optIdx]}</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>

                      {/* If full solution mode */}
                      {printMode === 'full_solution' && (
                        <div className="bg-blue-50/70 border border-blue-200 rounded p-2 text-xs text-slate-800 mt-2">
                          <span className="font-bold text-blue-800 mr-2">
                            [정답: {optionNumbers[q.answer - 1]}]
                          </span>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subjective Section */}
            {(printMode === 'all_questions' || printMode === 'subjective_only' || printMode === 'full_solution') && (
              <div className="space-y-6 pt-6 border-t-2 border-slate-800">
                <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1">
                  <h2 className="text-base font-black text-slate-900">
                    [제 2 부] 단답형 및 서술형 (주1번 ~ 주30번)
                  </h2>
                  <span className="text-xs text-slate-600">부분 점수 부여</span>
                </div>

                <div className="space-y-6">
                  {subjectiveQuestions.map((q) => (
                    <div key={q.id} className="text-xs sm:text-sm text-slate-900 space-y-2 break-inside-avoid">
                      <div className="font-bold flex items-start gap-1.5">
                        <span className="shrink-0">[주{q.id}]</span>
                        <span className="leading-snug">{q.question}</span>
                        <span className="text-[11px] text-slate-500 font-normal shrink-0 ml-1">
                          ({q.type} / {q.page}쪽)
                        </span>
                      </div>

                      {q.passage && (
                        <div className="bg-slate-50 border border-slate-300 rounded p-2.5 text-xs text-slate-800 whitespace-pre-line leading-relaxed my-1.5">
                          {q.passage}
                        </div>
                      )}

                      {/* Blank Answer Area for standard test paper */}
                      {printMode !== 'full_solution' ? (
                        <div className="h-16 sm:h-20 border border-slate-300 rounded bg-white p-2 text-slate-400 text-xs">
                          [답안 작성란]
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 text-xs text-slate-800 space-y-1">
                          <div>
                            <span className="font-bold text-emerald-800 mr-2">[모범 답안]</span>
                            <span className="font-semibold text-slate-900">{q.answer}</span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            <span className="font-semibold">핵심 채점 기준: </span>
                            {q.keyWords.join(', ')} 포함 여부
                          </div>
                          <p className="text-[11px] text-slate-700 pt-1 border-t border-emerald-100">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
