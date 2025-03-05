import { NextRequest, NextResponse } from "next/server";


//controller
export async function GET(req: NextRequest) {
    return NextResponse.json(data, { status: 200 })
}

const data = [
    {
        postId: "1",
        postType: "adoption",
        title: "Luna busca un hogar",
        author: "",
        content: "Esta perrita rescatada necesita una familia que la ame y cuide.",
        date: "04/03/2025",
        imageUrl: "1.avif",
        tags: {
            race: "Labrador",
            age: "3 años",
            female: "Hembra"
        }
    },
    {
        postId: "2",
        postType: "missing",
        title: "Gato extraviado en el centro",
        author: "",
        content: "Nuestro gato Tom se perdió cerca de la Plaza Central. Agradecemos cualquier información.",
        date: "02/03/2025",
        imageUrl: "14.avif",
        tags: {
            race: "Siames",
            age: "5 años",
            male: "Macho",
            distance: "2km"
        }
    },
    {
        postId: "3",
        postType: "volunteering",
        title: "Se necesitan voluntarios en refugio",
        author: "",
        content: "El refugio 'Amigos Peludos' busca voluntarios para ayudar con el cuidado de los animales.",
        date: "01/03/2025",
        imageUrl: "3.avif",
        tags: {
            distance: "5km"
        }
    },
    {
        postId: "4",
        postType: "blog",
        title: "Consejos para adoptar un gato",
        author: "Ana Gómez",
        content: "Adoptar una mascota es una gran responsabilidad. Aquí te dejamos algunos consejos útiles.",
        date: "25/02/2025",
        imageUrl: "4.avif",
        tags: {}
    },
    {
        postId: "5",
        postType: "marketplace",
        title: "Jaula para conejos en venta",
        author: "Carlos Pérez",
        content: "Vendo jaula grande para conejos en excelente estado.",
        date: "27/02/2025",
        imageUrl: "jaula.jpg",
        tags: {
            distance: "8km"
        }
    },
    {
        postId: "6",
        postType: "adoption",
        title: "Cachorro busca familia",
        author: "",
        content: "Este pequeño fue rescatado de la calle y busca un hogar donde crecer.",
        date: "28/02/2025",
        imageUrl: "6.avif",
        tags: {
            race: "Mestizo",
            vaccinated: "Vacunado",
            sterilyzed: "Esterilizado",
            age: "6 meses",
            male: "Macho"
        }
    },
    {
        postId: "7",
        postType: "missing",
        title: "Se perdió nuestra perrita Bella",
        author: "",
        content: "Bella desapareció el 26 de febrero en el barrio San Martín. Si la ves, contáctanos.",
        date: "26/02/2025",
        imageUrl: "7.avif",
        tags: {
            race: "Beagle",
            age: "4 años",
            female: "Hembra",
            distance: "1km"
        }
    },
    {
        postId: "8",
        postType: "volunteering",
        title: "Campaña de esterilización",
        author: "",
        content: "Buscamos voluntarios para ayudar en una jornada de esterilización gratuita.",
        date: "22/02/2025",
        imageUrl: "8.avif",
        tags: {
            distance: "10km"
        }
    },
    {
        postId: "9",
        postType: "blog",
        title: "Cómo cuidar a un gato mayor",
        author: "María López",
        content: "Los gatos mayores necesitan cuidados especiales. Aquí te explicamos cómo hacerlo.",
        date: "20/02/2025",
        imageUrl: "9.avif",
        tags: {}
    },
    {
        postId: "10",
        postType: "marketplace",
        title: "Transportadora para perros medianos",
        author: "Luis Ramírez",
        content: "Vendo transportadora en perfecto estado, ideal para perros medianos.",
        date: "18/02/2025",
        imageUrl: "transportadora.jpg",
        tags: {
            distance: "3km"
        }
    },
    {
        postId: "11",
        postType: "adoption",
        title: "Max necesita una familia",
        author: "",
        content: "Max fue rescatado de la calle y busca un hogar donde lo cuiden y amen.",
        date: "05/03/2025",
        imageUrl: "11.avif",
        tags: {
            race: "Pastor Alemán",
            vaccinated: "Vacunado",
            age: "2 años",
            male: "Macho"
        }
    },
    {
        postId: "12",
        postType: "missing",
        title: "Gata perdida en la zona norte",
        author: "",
        content: "Nuestra gata Mía se escapó el 4 de marzo. Tiene un collar rosa con una campana.",
        date: "04/03/2025",
        imageUrl: "12.avif",
        tags: {
            race: "Mestizo",
            age: "3 años",
            female: "Hembra",
            distance: "3km"
        }
    },
    {
        postId: "13",
        postType: "volunteering",
        title: "Se necesitan manos en albergue",
        author: "",
        content: "Ayuda con la limpieza, alimentación y paseos de los perros rescatados.",
        date: "03/03/2025",
        imageUrl: "13.avif",
        tags: {
            distance: "7km"
        }
    },
    {
        postId: "14",
        postType: "blog",
        title: "Beneficios de esterilizar a tu mascota",
        author: "Laura Méndez",
        content: "La esterilización es clave para la salud de tu mascota y el control de la población animal.",
        date: "02/03/2025",
        imageUrl: "2.avif",
        tags: {}
    },
    {
        postId: "15",
        postType: "marketplace",
        title: "Cama ortopédica para perros grandes",
        author: "Jorge Díaz",
        content: "Vendo cama ortopédica nueva, ideal para perros grandes o mayores.",
        date: "01/03/2025",
        imageUrl: "cama.jpeg",
        tags: {
            distance: "4km"
        }
    },
    {
        postId: "16",
        postType: "adoption",
        title: "Pequeño gatito en adopción",
        author: "",
        content: "Este hermoso gatito fue rescatado de la calle y necesita un hogar amoroso.",
        date: "28/02/2025",
        imageUrl: "16.avif",
        tags: {
            race: "Mestizo",
            vaccinated: "Vacunado",
            sterilyzed: "Esterilizado",
            age: "3 meses",
            male: "Macho"
        }
    },
    {
        postId: "17",
        postType: "missing",
        title: "Perro extraviado en el parque central",
        author: "",
        content: "Rocky se perdió el 27 de febrero. Es un Golden Retriever muy amigable.",
        date: "27/02/2025",
        imageUrl: "17.avif",
        tags: {
            race: "Golden Retriever",
            age: "5 años",
            male: "Macho",
            distance: "2km"
        }
    },
    {
        postId: "18",
        postType: "volunteering",
        title: "Apoyo en campaña de adopción",
        author: "",
        content: "Buscamos voluntarios para ayudar en nuestra feria de adopción el 15 de marzo.",
        date: "26/02/2025",
        imageUrl: "adopcion.jpg",
        tags: {
            distance: "6km"
        }
    },
    {
        postId: "19",
        postType: "blog",
        title: "Cómo alimentar a un cachorro",
        author: "Sofía Herrera",
        content: "Los cachorros tienen necesidades especiales. Aprende cómo alimentarlos correctamente.",
        date: "25/02/2025",
        imageUrl: "19.avif",
        tags: {}
    },
    {
        postId: "20",
        postType: "marketplace",
        title: "Rascador para gatos en venta",
        author: "Pedro Martínez",
        content: "Rascador grande para gatos, casi nuevo, en perfecto estado.",
        date: "24/02/2025",
        imageUrl: "rascador.png",
        tags: {
            distance: "5km"
        }
    },
    {
        postId: "21",
        postType: "adoption",
        title: "Nina busca un hogar",
        author: "",
        content: "Nina fue rescatada de la calle y es muy cariñosa. Necesita una familia responsable.",
        date: "06/03/2025",
        imageUrl: "21.avif",
        tags: {
            race: "Mestizo",
            vaccinated: "Vacunado",
            sterilyzed: "Esterilizado",
            age: "1 año",
            female: "Hembra"
        }
    },
    {
        postId: "22",
        postType: "missing",
        title: "Se perdió nuestro perro Toby",
        author: "",
        content: "Toby se extravió en el barrio Los Pinos el 5 de marzo. Si lo ves, por favor avísanos.",
        date: "05/03/2025",
        imageUrl: "22.avif",
        tags: {
            race: "Cocker Spaniel",
            age: "4 años",
            male: "Macho",
            distance: "3km"
        }
    },
    {
        postId: "23",
        postType: "volunteering",
        title: "Ayuda en jornada de vacunación",
        author: "",
        content: "Se necesitan voluntarios para asistir en la jornada de vacunación gratuita.",
        date: "04/03/2025",
        imageUrl: "23.avif",
        tags: {
            distance: "5km"
        }
    },
    {
        postId: "24",
        postType: "blog",
        title: "Cómo socializar a tu perro",
        author: "Andrea López",
        content: "La socialización temprana es clave para que tu perro tenga una buena conducta.",
        date: "03/03/2025",
        imageUrl: "24.avif",
        tags: {}
    },
    {
        postId: "25",
        postType: "marketplace",
        title: "Vendo acuario con accesorios",
        author: "Daniel Fernández",
        content: "Acuario de 50 litros con filtro, luz LED y accesorios incluidos.",
        date: "02/03/2025",
        imageUrl: "acuario.jpg",
        tags: {
            distance: "6km"
        }
    },
    {
        postId: "26",
        postType: "adoption",
        title: "Cachorra en adopción",
        author: "",
        content: "Esta pequeña necesita una familia que la cuide y le brinde amor.",
        date: "01/03/2025",
        imageUrl: "26.avif",
        tags: {
            race: "Mestizo",
            age: "4 meses",
            female: "Hembra"
        }
    },
    {
        postId: "27",
        postType: "missing",
        title: "Buscamos a nuestro gato Oliver",
        author: "",
        content: "Oliver desapareció el 29 de febrero. Tiene ojos verdes y es muy dócil.",
        date: "29/02/2025",
        imageUrl: "27.avif",
        tags: {
            race: "Mestizo",
            age: "2 años",
            male: "Macho",
            distance: "1km"
        }
    },
    {
        postId: "28",
        postType: "volunteering",
        title: "Se necesitan voluntarios en refugio",
        author: "",
        content: "Refugio Esperanza busca ayuda para limpiar y alimentar a los animales.",
        date: "28/02/2025",
        imageUrl: "28.avif",
        tags: {
            distance: "4km"
        }
    },
    {
        postId: "29",
        postType: "blog",
        title: "Errores comunes al entrenar un cachorro",
        author: "Lucas Martínez",
        content: "Evita estos errores al entrenar a tu cachorro para lograr mejores resultados.",
        date: "27/02/2025",
        imageUrl: "29.avif",
        tags: {}
    },
    {
        postId: "30",
        postType: "marketplace",
        title: "Transportadora para gatos a la venta",
        author: "Elena Rodríguez",
        content: "Transportadora en buen estado, ideal para gatos o perros pequeños.",
        date: "26/02/2025",
        imageUrl: "30.avif",
        tags: {
            distance: "3km"
        }
    }
] 
