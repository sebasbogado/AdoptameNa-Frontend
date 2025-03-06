'use client';
import dynamic from "next/dynamic";

const VerifyEmailClient = dynamic(() => import("@components/verify-email/verify-email"), {
  ssr: false,
  loading: () => <p className="text-center py-10">Cargando...</p>,
});

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}