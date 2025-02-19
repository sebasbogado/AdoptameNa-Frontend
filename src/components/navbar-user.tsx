import Link from "next/link"
import Image from "next/image"
import UserHeader from "@/components/user-header";

const NavbarUser = () => {
  return (
    <header className="w-full border-b">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/adoptamena.png"
            alt="Adoptamena logo"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-lg font-bold text-black hover:text-secondary">
            Inicio
          </Link>
          <Link href="/voluntariado" className="text-lg font-bold text-black hover:text-secondary">
            Voluntariado
          </Link>
          <Link href="/adopcion" className="text-lg font-bold text-black hover:text-secondary">
            Adopción
          </Link>
          <Link href="/extraviados" className="text-lg font-bold text-black hover:text-secondary">
            Extraviados
          </Link>
          <Link href="/blog" className="text-lg font-bold text-black hover:text-secondary">
            Blog
          </Link>
          <Link href="/tienda" className="text-lg font-bold text-black hover:text-secondary">
            Tienda
          </Link>
        </div>
        <div>
          <UserHeader></UserHeader>
        </div>
      </nav>
    </header>
  );
};

export default NavbarUser;