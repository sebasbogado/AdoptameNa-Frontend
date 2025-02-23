import Image from "next/image";
import Link from "next/link";


export default function Navbar() {
    return (
        <header className="w-full border-b">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
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
                <div className="flex space-x-4">
                    <Link href="/signup">
                        <button className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                            Crear Cuenta
                        </button>
                    </Link>
                    <Link href="/login">
                        <button className="bg-white text-primary border border-primary px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                            Iniciar Sesión
                        </button>
                    </Link>
                </div>
            </nav>
        </header>
    )
}