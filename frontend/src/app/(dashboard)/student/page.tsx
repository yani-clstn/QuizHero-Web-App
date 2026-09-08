"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import QuizBrowser from "@/components/QuizBrowser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.role !== "student") {
      router.push("/teacher");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || user?.role !== "student") return null;

  return (
    <QuizBrowser
      onSelectQuiz={(id) => router.push(`/quiz/${id}`)}
      onViewGrades={() => router.push("/grades")}
    />
  );
}

