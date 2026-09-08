"use client";

import { useState, useEffect } from "react";
import { PublishedQuiz, QuizType } from "@/types/quiz";
import { fetchQuizzes } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  IconBarChart,
  IconRefresh,
  IconArrowRight,
  IconList,
  IconToggle,
  IconEdit,
  IconMessage,
  IconSparkles,
  IconAssessmentIllustration,
} from "@/components/icons";

interface Props {
  onSelectQuiz: (quizId: string) => void;
  onViewGrades: () => void;
}

const FORMAT_ICONS: Record<QuizType, React.ReactNode> = {
  "Multiple Choice": <IconList size={14} className="text-cvsu-green" />,
  "True or False": <IconToggle size={14} className="text-cvsu-green" />,
  "Identification": <IconEdit size={14} className="text-cvsu-green" />,
  "Open Ended": <IconMessage size={14} className="text-cvsu-green" />,
  "Mixed Assessment": <IconSparkles size={14} className="text-cvsu-green" />,
};

export default function QuizBrowser({ onSelectQuiz, onViewGrades }: Props) {
  const { data: quizzes = [], isLoading, refetch } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => fetchQuizzes(),
  });

  const loadQuizzes = () => {
    refetch();
  };

  return (
    <div className="view-transition space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#1C1C1C]">Available Class Assessments</h2>
          <p className="text-xs text-stone-500 mt-1">
            Select an assessment to begin. Responses will be evaluated and recorded to your permanent academic profile.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadQuizzes}
            disabled={isLoading}
            className="px-4 py-2 bg-[#F7F7F2] hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs btn-tactile hover:-translate-y-0.5 cursor-pointer"
          >
            <IconRefresh size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={onViewGrades}
            className="px-5 py-2 bg-cvsu-green hover:bg-cvsu-dark text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-md btn-tactile hover:-translate-y-0.5 cursor-pointer border border-cvsu-vibrant/30"
          >
            <IconBarChart size={14} className="text-cvsu-vibrant" />
            <span>My Gradebook</span>
          </button>
        </div>
      </div>

      {/* List / Skeletons / Illustrated Empty State */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 w-full rounded-3xl" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="p-12 text-center bg-[#F7F7F2]/60 border border-dashed border-stone-300 rounded-3xl space-y-3 view-transition">
          <div className="flex justify-center">
            <IconAssessmentIllustration size={80} className="drop-shadow-xs hover:scale-105 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-[#1C1C1C]">No Published Assessments Available</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            There are currently no active curriculum assessments published by faculty. Check back once your instructor releases an evaluation.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={loadQuizzes}
              className="px-5 py-2.5 bg-white hover:bg-[#F7F7F2] border border-stone-300 text-xs font-bold text-cvsu-green rounded-full transition-all inline-flex items-center gap-2 shadow-xs btn-tactile hover:-translate-y-0.5 cursor-pointer"
            >
              <IconRefresh size={13} />
              <span>Check for New Assessments</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              type="button"
              onClick={() => onSelectQuiz(quiz.id)}
              className="w-full text-left p-6 bg-white hover:bg-[#F7F7F2]/60 border border-stone-200 hover:border-cvsu-green rounded-3xl transition-all duration-200 flex items-center justify-between gap-4 group cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="min-w-0 flex-1 space-y-2.5">
                <p className="text-base sm:text-lg font-bold text-[#1C1C1C] group-hover:text-cvsu-green transition-colors truncate tracking-tight">
                  {quiz.topic}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cvsu-light text-cvsu-green font-bold border border-cvsu-green/30">
                    {FORMAT_ICONS[quiz.quiz_type]}
                    <span>{quiz.quiz_type}</span>
                  </span>
                  
                  <span className="text-stone-500 font-medium font-mono text-xs">
                    {quiz.question_count} Questions
                  </span>

                  {quiz.created_by_email && (
                    <span className="text-stone-400 font-mono text-[11px] hidden sm:inline">
                      • Instructor: {quiz.created_by_email}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Arrow Box with Spring Glide */}
              <div className="w-12 h-12 rounded-2xl bg-[#F7F7F2] group-hover:bg-cvsu-green group-hover:text-cvsu-vibrant border border-stone-200 group-hover:border-cvsu-green flex items-center justify-center text-stone-400 transition-all duration-200 shrink-0 shadow-xs group-hover:shadow-sm">
                <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200 ease-out" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
