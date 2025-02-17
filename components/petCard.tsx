import clsx from 'clsx'
import Link from 'next/link'

export default function PetCard({ className = '', pet }) {
    return (
        <div className={clsx(['rounded-xl bg-[#F8F7F7] flex flex-col overflow-hidden', className])}>
            <div className="relative">
                <img
                    src="https://www.infobae.com/resizer/v2/https%3A%2F%2Fs3.amazonaws.com%2Farc-wordpress-client-uploads%2Finfobae-wp%2Fwp-content%2Fuploads%2F2017%2F04%2F06155038%2Fperro-beso.jpg?auth=7db092219938909c16f466d602dcf2715cb44547bae1b45714fbfc66be4b16e9&smart=true&width=1200&height=900&quality=85"
                    alt="item photo"
                    className="object-cover h-64 w-64"
                />
            </div>
            <div className="px-2 py-1 flex flex-col gap-1">
                <div className="">
                    <span>Nombre del Perrito</span>
                    <p className="text-gray-700 text-sm leading-4">Pequeña descripción del perrito</p>
                </div>
                <div className="flex justify-between items-center border-t-2 border-gray-300 pt-1 mt-1">
                    <span className="font-semibold">Algo</span>
                    <Link href={`/dashboard/${pet?.id}`}>
                    <button className="flex items-center bg-yellow-800 text-white rounded-xl px-2 text-sm">
                        <span>Boton</span>
                    </button>
                    </Link>
                </div>
            </div>
    </div>
)
}