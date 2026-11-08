import React, { useState, useEffect } from 'react';
import { MultipleChoiceQuestion, SubjectiveQuestion, Era } from '../types';
import {
  Timer,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Pause,
} from 'lucide-react';

interface MockExamViewProps {
  era: Era;
  mcqQuestions: MultipleChoiceQuestion[];
  subjectiveQuestions: SubjectiveQuestion[];
}

type ExamType = 'standard' | 'mcq_focus' | 'hard_focus';

export const MockExamView: React.FC<MockExamViewProps> = ({
  era,
  mcqQuestions,
  subjectiveQuestions,
}) => {
  const [examType, setExamType] = useState<ExamType>('standard');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(40 * 60);

  // Selected questions for this exam session
  const [sessionMcqs, setSessionMcqs] = useState<MultipleChoiceQuestion[]>([]);
  const [sessionSubs, setSessionSubs] = useState<SubjectiveQuestion[]>([]);

  // User answers in this mock exam session
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [subAnswers, setSubAnswers] = useState<Record<number, string>>({});

  // Start exam
  const handleStartExam = (type: ExamType) => {
    setExamType(type);
    let mcqList: MultipleChoiceQuestion[] = [];
    let subList: SubjectiveQuestion[] = [];
    let durationMinutes = 40;

    if (type === 'standard') {
      // 25 MCQs evenly sampled across pages + 5 Subjective questions
      mcqList = mcqQuestions.filter((_, i) => i % 2 === 0).slice(0, 25);
      subList = subjectiveQuestions.filter((_, i) => i % 6 === 0).slice(0, 5);
      durationMinutes = 40;
    } else if (type === 'mcq_focus') {
      // 30 MCQs
      mcqList = mcqQuestions.slice(0, 30);
      subList = [];
      durationMinutes = 30;
    } else {
      // Hard focus: 심화/표준 위주 15 MCQs + 서술형 5
      mcqList = mcqQuestions.filter((q) => q.difficulty === '심화' || q.difficulty === '표준').slice(0, 15);
      subList = subjectiveQuestions.filter((q) => q.type === '서술형').slice(0, 5);
      durationMinutes = 30;
    }

    setSessionMcqs(mcqList);
    setSessionSubs(subList);
    setExamAnswers({});
    setSubAnswers({});
    setRemainingSeconds(durationMinutes * 60);
    setIsStarted(true);
    setIsFinished(false);
    setIsPaused(false);
  };

  // Timer countdown
  useEffect(() => {
    if (!isStarted || isFinished || isPaused) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, isFinished, isPaused]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submit and Finish
  const handleSubmitExam = () => {
    const unansweredCount = sessionMcqs.filter((q) => examAnswers[q.id] === undefined).length;
    if (unansweredCount > 0) {
      if (!window.confirm(`아직 풀지 않은 객관식 문제가 ${unansweredCount}개 있습니다. 정말 시험을 종료하고 채점하시겠습니까?`)) {
        return;
      }
    }
    setIsFinished(true);
  };

  // Grade calculation
  const totalMcqScore = sessionMcqs.reduce((acc, q) => {
    return acc + (examAnswers[q.id] === q.answer ? 1 : 0);
  }, 0);
  const mcqPercentage = sessionMcqs.length > 0 ? Math.round((totalMcqScore / sessionMcqs.length) * 100) : 0;

  // Breakdown by section
  const sectionGroups: Record<string, { total: number; correct: number }> = era === 'goryeo'
    ? {
        '89쪽 (문벌 동요·서경 천도)': { total: 0, correct: 0 },
        '92~93쪽 (다원적 질서·거란 격퇴)': { total: 0, correct: 0 },
        '94~95쪽 (여진 정벌·벽란도 무역)': { total: 0, correct: 0 },
        '96~97쪽 (몽골 침략·대몽 항쟁)': { total: 0, correct: 0 },
        '100~101쪽 (공민왕 개혁·신흥 무인)': { total: 0, correct: 0 },
      }
    : {
        '116쪽 (국가 기틀 확립·경국대전)': { total: 0, correct: 0 },
        '122~123쪽 (사림의 등장·4대 사화)': { total: 0, correct: 0 },
        '124~125쪽 (서원·향약·붕당 형성)': { total: 0, correct: 0 },
        '132~135쪽 (임진왜란 극복·무기 분석)': { total: 0, correct: 0 },
        '136~139쪽 (호란·중립외교·북벌·문화교류)': { total: 0, correct: 0 },
      };

  sessionMcqs.forEach((q) => {
    let key = '';
    if (era === 'goryeo') {
      key = '89쪽 (문벌 동요·서경 천도)';
      if (q.page === 92 || q.page === 93) key = '92~93쪽 (다원적 질서·거란 격퇴)';
      else if (q.page === 94 || q.page === 95) key = '94~95쪽 (여진 정벌·벽란도 무역)';
      else if (q.page === 96 || q.page === 97) key = '96~97쪽 (몽골 침략·대몽 항쟁)';
      else if (q.page === 100 || q.page === 101) key = '100~101쪽 (공민왕 개혁·신흥 무인)';
    } else {
      key = '116쪽 (국가 기틀 확립·경국대전)';
      if (q.page === 122 || q.page === 123) key = '122~123쪽 (사림의 등장·4대 사화)';
      else if (q.page === 124 || q.page === 125) key = '124~125쪽 (서원·향약·붕당 형성)';
      else if (q.page >= 132 && q.page <= 135) key = '132~135쪽 (임진왜란 극복·무기 분석)';
      else if (q.page >= 136) key = '136~139쪽 (호란·중립외교·북벌·문화교류)';
    }

    if (sectionGroups[key]) {
      sectionGroups[key].total += 1;
      if (examAnswers[q.id] === q.answer) {
        sectionGroups[key].correct += 1;
      }
    }
  });

  const optionNumbers = ['①', '②', '③', '④', '⑤'];

  return (
    <div className="space-y-6">
      {!isStarted ? (
        /* Exam Selection Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              실전 대비 모의고사 모드
            </span>
            <h2 className="text-2xl font-black text-white mt-2">
              고려 시대 시험 범위 실전 시뮬레이션
            </h2>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              실제 내신 및 중간·기말고사와 동일한 제한 시간과 OMR 채점 방식으로 실력을 점검하고 취약 파트를 분석합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Exam Option 1 */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    추천 모드
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" /> 40분
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">모의고사 A형 (표준 실전)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  전 범위에서 골고루 추출된 객관식 25문항과 핵심 서술형 5문항으로 구성된 학교 시험 표준 구성입니다.
                </p>
              </div>
              <button
                onClick={() => handleStartExam('standard')}
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-4 h-4 fill-current" /> 시험 시작하기
              </button>
            </div>

            {/* Exam Option 2 */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 hover:border-sky-500/50 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                    객관식 집중
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" /> 30분
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">모의고사 B형 (객관식 30제)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  객관식 정답률을 극대화하기 위해 30개의 5지선다 문제를 집중적으로 풀이하고 자동 OMR 채점을 진행합니다.
                </p>
              </div>
              <button
                onClick={() => handleStartExam('mcq_focus')}
                className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-4 h-4 fill-current" /> 시험 시작하기
              </button>
            </div>

            {/* Exam Option 3 */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 hover:border-rose-500/50 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    1등급 목표
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" /> 30분
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">모의고사 C형 (고난도 심화)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  사료 분석형 심화 문제 15문항과 변별력 있는 고배점 서술형 5문항으로 만점을 목표로 훈련합니다.
                </p>
              </div>
              <button
                onClick={() => handleStartExam('hard_focus')}
                className="w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-4 h-4 fill-current" /> 시험 시작하기
              </button>
            </div>
          </div>
        </div>
      ) : isFinished ? (
        /* Results & Diagnostic Screen */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                  모의고사 채점 완료 리포트
                </span>
                <h2 className="text-2xl font-black text-white mt-2">
                  시험 결과: {totalMcqScore} / {sessionMcqs.length}문항 ({mcqPercentage}점)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  제출 소요 시간: {formatTime(40 * 60 - remainingSeconds)} | 완료 시각: 지금
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStarted(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 다른 모의고사 풀기
                </button>
              </div>
            </div>

            {/* Diagnostic Breakdown by textbook pages */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" /> 교과서 파트별 성취도 분석
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(sectionGroups).map(([name, stat], idx) => {
                  if (stat.total === 0) return null;
                  const rate = Math.round((stat.correct / stat.total) * 100);
                  const isWeak = rate < 70;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border ${
                        isWeak
                          ? 'bg-rose-950/20 border-rose-500/30'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-200">{name}</span>
                        <span className={`font-bold ${isWeak ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {stat.correct}/{stat.total} ({rate}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isWeak ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      {isWeak && (
                        <p className="text-[11px] text-rose-300 mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> 복습 권장 파트
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Answers Review */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white">문항별 정오답 및 해설 검토</h3>
              <div className="space-y-4">
                {sessionMcqs.map((q, idx) => {
                  const userAnswer = examAnswers[q.id];
                  const isCorrect = userAnswer === q.answer;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs sm:text-sm ${
                        isCorrect
                          ? 'bg-slate-950/50 border-slate-800/80'
                          : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">
                            {idx + 1}번 (원문항 {q.id}번 / {q.page}쪽)
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-semibold ${
                              isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {isCorrect ? '정답' : '오답'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          선택: {userAnswer ? optionNumbers[userAnswer - 1] : '미선택'} | 정답: {optionNumbers[q.answer - 1]}
                        </div>
                      </div>

                      <p className="font-semibold text-slate-200 mb-2">{q.question}</p>
                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Ongoing Exam Screen */
        <div className="space-y-6">
          {/* Sticky Timer Bar */}
          <div className="sticky top-24 z-30 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                  remainingSeconds < 300
                    ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">남은 시간</p>
                <p
                  className={`text-lg sm:text-xl font-mono font-black ${
                    remainingSeconds < 300 ? 'text-rose-400' : 'text-white'
                  }`}
                >
                  {formatTime(remainingSeconds)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                풀이 완료: {Object.keys(examAnswers).length} / {sessionMcqs.length}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                {isPaused ? '계속하기' : '일시정지'}
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
              >
                답안 제출 및 채점
              </button>
            </div>
          </div>

          {/* Questions Container */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              [제 1 영역] 객관식 문항 ({sessionMcqs.length}문항)
            </h3>

            {sessionMcqs.map((q, idx) => (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-amber-400">문항 {idx + 1}</span>
                  <span>[{q.page}쪽] {q.section}</span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                  {q.question}
                </h4>

                {q.passage && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {q.passage}
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const optNumber = optIdx + 1;
                    const isSelected = examAnswers[q.id] === optNumber;

                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          setExamAnswers((prev) => ({
                            ...prev,
                            [q.id]: optNumber,
                          }))
                        }
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-semibold ring-1 ring-amber-500/30'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="font-semibold text-slate-400 shrink-0">
                          {optionNumbers[optIdx]}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Subjective questions if any */}
            {sessionSubs.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-800">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                  [제 2 영역] 서술형 문항 ({sessionSubs.length}문항)
                </h3>

                {sessionSubs.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-indigo-400">서술형 {idx + 1}</span>
                      <span>[{sub.page}쪽] {sub.section}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                      {sub.question}
                    </h4>

                    {sub.passage && (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {sub.passage}
                      </div>
                    )}

                    <textarea
                      rows={4}
                      value={subAnswers[sub.id] || ''}
                      onChange={(e) =>
                        setSubAnswers((prev) => ({
                          ...prev,
                          [sub.id]: e.target.value,
                        }))
                      }
                      placeholder="답안을 서술하세요..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 resize-y"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
