'use client'

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "@/types/auth";
import { Comment } from "@/types/comment";
import CardButtons from "@/components/administration/report/card-button";

export default function Page() {
  const { authToken, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const exampleUser: User = {
    id: 1,
    fullName: "Juan Pérez",
    email: "juan.perez@example.com",
    role: "user",
    isProfileCompleted: true,
    location: {
      lat: -34.603722,
      lon: -58.381592,
      neighborhoodId: "123",
      districtId: "456",
      departmentId: "789",
      neighborhoodName: "Palermo",
      districtName: "Buenos Aires",
      departmentName: "CABA",
    },
  };

  // Comentarios de ejemplo
  const exampleComments: Comment[] = [
    {
      id: 1,
      user: exampleUser,
      content: "Este es un comentario de prueba.",
      createdAt: "2025-05-06T10:00:00Z",
      likesCount: 5,
      liked: true,
      totalReplies: 2,
      nextRepliesCursor: 0,
    },
    {
      id: 2,
      user: {
        id: 2,
        fullName: "María López",
        email: "maria.lopez@example.com",
        role: "admin",
        isProfileCompleted: true,
      },
      content: "Otro comentario para probar el sistema.",
      createdAt: "2025-05-05T15:30:00Z",
      likesCount: 10,
      liked: false,
      totalReplies: 0,
      nextRepliesCursor: 0,
    },
  ];

  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    } else if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [authToken, authLoading, router]);

  return (
    <div className="p-6 flex flex-col gap-11">
      <h1 className="text-xl font-bold mb-4">Comentarios reportados</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exampleComments.map((comment) => (
          <CardButtons
            key={comment.id}
            comment={comment}
            type="comment"
            isReportedPage={false}
            handleAprove={() => console.log(`Aprobado comentario ID: ${comment.id}`)}
            handleDesaprove={() => console.log(`Desaprobado comentario ID: ${comment.id}`)}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exampleComments.map((comment) => (
          <CardButtons
            key={comment.id}
            comment={comment}
            type="comment"
            isReportedPage={true}
            handleAprove={() => console.log(`Aprobado comentario ID: ${comment.id}`)}
            handleDesaprove={() => console.log(`Desaprobado comentario ID: ${comment.id}`)}
          />
        ))}
      </div>
    </div>
  );
}