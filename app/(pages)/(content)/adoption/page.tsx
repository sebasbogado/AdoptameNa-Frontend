import Banners from '@components/banners'
import PetCard from '@components/petCard'

const pets = [
    { id: 1, name: "Firulais", description: "Un perrito muy juguetón" },
    { id: 2, name: "Luna", description: "Dócil y amigable" },
    { id: 3, name: "Max", description: "Le encanta correr" },
    { id: 4, name: "Bella", description: "Muy cariñosa" },
    { id: 5, name: "Rocky", description: "Fuerte y enérgico" },
    { id: 6, name: "Toby", description: "Un poco tímido" },
    { id: 7, name: "Nina", description: "Juguetona y amorosa" },
    { id: 8, name: "Simba", description: "Amante de la naturaleza" },
    { id: 9, name: "Duke", description: "Valiente y leal" },
    { id: 10, name: "Sasha", description: "Pequeña y curiosa" },
    { id: 11, name: "Bobby", description: "Siempre atento" },
    { id: 12, name: "Coco", description: "Le encanta el agua" },
    { id: 13, name: "Thor", description: "Guardián del hogar" },
    { id: 14, name: "Lola", description: "Súper amigable" },
    { id: 15, name: "Zeus", description: "El líder de la manada" },
];

export default function Page() {
    return (
        <div className='flex flex-col gap-5'>
            <Banners />
            <section>
                <h2 className="text-2xl font-bold text-center my-4">Nuestros Perritos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 p-4">
                    {pets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            </section>
        </div>
    )
}