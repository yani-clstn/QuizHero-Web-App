"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizDetail, submitQuiz } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";
import QuizPlayer from "@/features/quiz-player/components/QuizPlayer";
import ResultsScreen from "@/features/quiz-player/components/ResultsScreen";
import { AnswerDetail } from "@/types/quiz";

export default function QuizPage() {
  const params = useParams();
  const quizId = params.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<"quiz" | "results">("quiz");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);

  const { data: quizDetail, isLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => fetchQuizDetail(quizId),
    enabled: !!quizId,
  });

  if (isLoading) return <div className="p-8 text-center text-cvsu-green animate-pulse font-medium">Loading Assessment...</div>;
  if (error || !quizDetail) return <div className="p-8 text-center text-red-500 font-medium">Failed to load assessment.</div>;

  const handleQuizComplete = (finalScore: number, finalAnswers: AnswerDetail[]) => {
    setScore(finalScore);
    setAnswers(finalAnswers);
    setView("results");
  };

  const handleSubmitAndContinue = async () => {
    if (user && quizDetail) {
      await submitQuiz(
        user.full_name,
        user.email,
        quizDetail.id,
        quizDetail.topic,
        score,
        quizDetail.question_count,
        answers
      );
    }
    router.push(user?.role === "teacher" ? "/teacher" : "/student");
  };

  return (
    <div className="view-transition">
      {view === "quiz" ? (
        <QuizPlayer
          quizId={quizDetail.id}
          questions={quizDetail.questions}
          quizType={quizDetail.quiz_type}
          onComplete={handleQuizComplete}
        />
      ) : (
        <ResultsScreen
          topic={quizDetail.topic}
          score={score}
          totalQuestions={quizDetail.question_count}
          answers={answers}
          onSubmitAndContinue={handleSubmitAndContinue}
        />
      )}
    </div>
  );
}

