"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import TeacherDashboard from "@/features/assessment-engine/components/TeacherDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeacherPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.role !== "teacher") {
      router.push("/student");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || user?.role !== "teacher") return null;

  return (
    <TeacherDashboard
      currentUser={user}
      onViewGrades={() => router.push("/grades")}
    />
  );
}

