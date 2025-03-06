export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-screen h-screen flex justify-center items-center relative bg-cover bg-center"
      style={{ backgroundImage: "url('/andrew-s-ouo1hbizWwo-unsplash.jpg')" }} // Reemplaza con la ruta correcta
    >
      <div className="absolute inset-0 bg-[#9747FF] opacity-50"></div>
      <div>
        {children}
      </div>
    </div>
  );
}

