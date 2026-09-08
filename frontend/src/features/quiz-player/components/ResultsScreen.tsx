"use client";

import { AnswerDetail } from "@/types/quiz";
import { IconCheckCircle, IconXCircle, IconArrowRight } from "@/components/icons";

interface Props {
  topic: string;
  score: number;
  totalQuestions: number;
  answers: AnswerDetail[];
  onSubmitAndContinue: () => void;
}

export default function ResultsScreen({
  topic,
  score,
  totalQuestions,
  answers,
  onSubmitAndContinue,
}: Props) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassed = percentage >= 70;
  
  const getLetterGrade = (p: number) => {
    if (p >= 95) return "1.00 (Excellent)";
    if (p >= 90) return "1.25 (Very Good)";
    if (p >= 85) return "1.50 (Very Good)";
    if (p >= 80) return "1.75 (Good)";
    if (p >= 75) return "2.00 (Good)";
    if (p >= 70) return "2.25 (Satisfactory)";
    if (p >= 65) return "2.50 (Passed)";
    if (p >= 60) return "2.75 (Passed)";
    if (p >= 50) return "3.00 (Conditional)";
    return "5.00 (Needs Improvement)";
  };

  return (
    <div className="view-transition space-y-8">
      {/* Assessment Performance Card in Fresh Academic Green */}
      <div className="p-8 bg-cvsu-dark border border-cvsu-vibrant/30 rounded-3xl text-center space-y-4 text-white shadow-xl">
        <div className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cvsu-vibrant text-cvsu-dark shadow-xs">
          CvSU Assessment Evaluation
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{topic}</h2>
        
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-3">
          <div>
            <span className="text-4xl sm:text-5xl font-black text-cvsu-vibrant font-mono">{percentage}%</span>
            <p className="text-xs text-white/70 font-medium mt-1">Calculated Score</p>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div>
            <span className="text-4xl sm:text-5xl font-black text-white font-mono">{score} / {totalQuestions}</span>
            <p className="text-xs text-white/70 font-medium mt-1">Correct Items</p>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div>
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${
              isPassed ? "bg-cvsu-vibrant text-cvsu-dark border-cvsu-vibrant" : "bg-red-500/20 text-red-200 border-red-400/40"
            }`}>
              {getLetterGrade(percentage)}
            </span>
            <p className="text-xs text-white/70 font-medium mt-1.5">Institutional Rating</p>
          </div>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Detailed Item Review ({answers.length} Items)
        </h3>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {answers.map((a, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border text-xs leading-relaxed transition-all ${
                a.is_correct
                  ? "bg-white border-stone-200 hover:border-cvsu-green"
                  : "bg-red-50/40 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="shrink-0 mt-0.5">
                  {a.is_correct ? (
                    <IconCheckCircle size={18} className="text-cvsu-green" />
                  ) : (
                    <IconXCircle size={18} className="text-red-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="font-bold text-[#1C1C1C] text-sm">
                    {idx + 1}. {a.question}
                  </p>

                  {!a.is_correct && (
                    <p className="text-red-700 font-semibold">
                      Your Response: <span className="font-bold">{a.user_answer}</span>
                    </p>
                  )}

                  <p className="text-cvsu-green font-semibold">
                    Verified Correct Answer: <span className="font-bold">{a.correct_answer}</span>
                  </p>

                  {a.ai_feedback && !a.ai_feedback.startsWith("Correct") && (
                    <div className="p-3 bg-[#F7F7F2] border border-stone-200 rounded-xl text-stone-600 mt-2">
                      <span className="font-bold text-stone-700">Evaluation Note: </span>
                      {a.ai_feedback}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation CTA */}
      <button
        type="button"
        onClick={onSubmitAndContinue}
        className="w-full bg-cvsu-green hover:bg-cvsu-dark text-white font-extrabold py-4 px-8 rounded-full text-sm sm:text-base transition-all shadow-lg hover:shadow-xl btn-tactile hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer group border border-cvsu-vibrant/30"
      >
        <span>Submit Score to Academic Record & Return</span>
        <IconArrowRight size={16} className="text-cvsu-vibrant group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
}
