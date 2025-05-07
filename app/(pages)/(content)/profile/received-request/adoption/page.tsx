'use client';

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useAdoptionMode } from "@/contexts/adoption-mode-context";
import ReceivedRequests from "@/components/profile/received-request/received-adoption-request";
import SentRequests from "@/components/profile/received-request/sent-adoption-request";

export default function AdoptionRequestsPage() {
  const { authToken, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { mode } = useAdoptionMode();

  // Redirección por permisos
  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    } 
  }, [authLoading, authToken, user]);

  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen">
      
      {mode === "received" ? <ReceivedRequests /> : <SentRequests />}
    </div>
  );
}