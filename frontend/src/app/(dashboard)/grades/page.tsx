"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import Gradebook from "@/features/gradebook/components/Gradebook";
import { useRouter } from "next/navigation";

export default function GradesPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <Gradebook
      role={user.role}
      studentName={user.full_name}
      studentEmail={user.email}
      onBack={() => router.push(user.role === "teacher" ? "/teacher" : "/student")}
    />
  );
}

