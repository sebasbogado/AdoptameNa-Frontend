import { NextRequest, NextResponse } from "next/server";


//controller
export async function GET(req: NextRequest) {
    return NextResponse.json({hola:data}, {status:200})
}

const data = [
    {
        "tipo": "marketplace",
        "titulo": "Casitas de madera para mascotas",
        "descripcion": "Casas hechas a mano para perros y gatos. Material resistente y de alta calidad.",
        "precio": "250.000 PYG",
        "contacto": "0975 777 777"
    },
    {
        "tipo": "marketplace",
        "titulo": "Rascador para gatos",
        "descripcion": "Rascador grande con múltiples niveles y escondites. Ideal para gatos activos.",
        "precio": "180.000 PYG",
        "contacto": "0982 123 456"
    },
    {
        "tipo": "marketplace",
        "titulo": "Transportadora para perros y gatos",
        "descripcion": "Jaula transportadora de plástico reforzado con ventilación lateral.",
        "precio": "150.000 PYG",
        "contacto": "0961 654 321"
    },
    {
        "tipo": "marketplace",
        "titulo": "Comedero automático para mascotas",
        "descripcion": "Comedero con temporizador y capacidad de 3 litros. Programable.",
        "precio": "200.000 PYG",
        "contacto": "0974 555 888"
    },
    {
        "tipo": "marketplace",
        "titulo": "Cama acolchonada para perros",
        "descripcion": "Cama de tela suave y lavable, disponible en varios tamaños.",
        "precio": "120.000 PYG",
        "contacto": "0991 333 222"
    },
    {
        "tipo": "marketplace",
        "titulo": "Jaula para hámsters con accesorios",
        "descripcion": "Jaula espaciosa con rueda, túneles y casa incluida.",
        "precio": "90.000 PYG",
        "contacto": "0987 444 666"
    },
    {
        "tipo": "marketplace",
        "titulo": "Kit de aseo para perros y gatos",
        "descripcion": "Incluye cepillo, cortaúñas y guante removedor de pelo.",
        "precio": "80.000 PYG",
        "contacto": "0972 666 555"
    },
    {
        "tipo": "marketplace",
        "titulo": "Correa retráctil para perros",
        "descripcion": "Correa de 5 metros con sistema de frenado. Ideal para paseos.",
        "precio": "70.000 PYG",
        "contacto": "0965 777 999"
    },
    {
        "tipo": "marketplace",
        "titulo": "Fuente de agua para mascotas",
        "descripcion": "Fuente automática con filtro de carbón. Mantiene el agua fresca.",
        "precio": "150.000 PYG",
        "contacto": "0993 888 777"
    },
    {
        "tipo": "marketplace",
        "titulo": "Chaleco salvavidas para perros",
        "descripcion": "Chaleco con asas y ajuste seguro. Perfecto para días de playa o piscina.",
        "precio": "130.000 PYG",
        "contacto": "0981 111 222"
    },
    {
        "author": "Vet. Ana Sosa",
        "title": "Alimentos prohibidos para mascotas",
        "content": "Conoce qué alimentos comunes pueden ser peligrosos para la salud de tu perro o gato.",
        "category": "Nutrición",
        "image": "https://ruta-de-la-imagen.com/alimentos-prohibidos.png"
    },
    {
        "author": "Clínica VetCare",
        "title": "Primeros auxilios para mascotas",
        "content": "Aprende cómo actuar rápidamente ante una emergencia con tu mascota.",
        "category": "Salud",
        "image": "https://ruta-de-la-imagen.com/primeros-auxilios.png"
    },
    {
        "author": "Dra. Laura Giménez",
        "title": "Cómo bañar a tu gato sin estrés",
        "content": "Consejos prácticos para lograr que la hora del baño sea tranquila y segura.",
        "category": "Higiene",
        "image": "https://ruta-de-la-imagen.com/banar-gato.png"
    },
    {
        "author": "Pet Lovers",
        "title": "¿Cada cuánto debes desparasitar a tu mascota?",
        "content": "La importancia de las desparasitaciones periódicas y cómo seguir un calendario adecuado.",
        "category": "Salud",
        "image": "https://ruta-de-la-imagen.com/desparasitacion.png"
    },
    {
        "author": "Vet. Carlos Rojas",
        "title": "Señales de estrés en perros",
        "content": "¿Tu perro está ansioso? Aprende a identificar y aliviar el estrés en ellos.",
        "category": "Comportamiento",
        "image": "https://ruta-de-la-imagen.com/estres-perro.png"
    },
    {
        "author": "Vet. Ana Sosa",
        "title": "Ejercicios diarios para perros",
        "content": "Actividades físicas esenciales para mantener a tu perro feliz y saludable.",
        "category": "Ejercicio",
        "image": "https://ruta-de-la-imagen.com/ejercicios-perro.png"
    },
    {
        "author": "Clínica Felina",
        "title": "La importancia de las visitas regulares al veterinario",
        "content": "Chequeos médicos frecuentes aseguran una vida larga y sana para tu mascota.",
        "category": "Salud",
        "image": "https://ruta-de-la-imagen.com/visitas-veterinario.png"
    },
    {
        "author": "Dra. Luisa Gómez",
        "title": "Cuidado dental para mascotas",
        "content": "¿Sabías que el 80% de los perros mayores de 3 años sufren enfermedades dentales? Aprende cómo prevenirlas.",
        "category": "Higiene",
        "image": "https://ruta-de-la-imagen.com/cuidado-dental.png"
    },
    {
        "author": "Pet Friends",
        "title": "Cómo socializar a tu cachorro",
        "content": "Guía paso a paso para que tu cachorro aprenda a interactuar con personas y otros animales.",
        "category": "Comportamiento",
        "image": "https://ruta-de-la-imagen.com/socializar-cachorro.png"
    },
    {
        "author": "Vet. Juan Pérez",
        "title": "Cómo preparar a tu mascota para un viaje",
        "content": "Consejos útiles para garantizar un viaje cómodo y seguro para tu mascota.",
        "category": "Viajes",
        "image": "https://ruta-de-la-imagen.com/viaje-mascota.png"
    },
    {
        "id": 1,
        "tipo": "adopcion",
        "nombre": "Milaneso",
        "imagen": "https://ejemplo.com/imagenes/milaneso.jpg",
        "caracteristicas": {
            "raza": "Mestizo",
            "desparasitado": true,
            "peso": "4.3 Kg",
            "esterilizado": true,
            "genero": "Macho",
            "edad": "2 años"
        },
        "descripcion": "Bigotes fue rescatado de la placita, le encontramos en una caja cuando era un bebé.",
        "favorito": false
    },
    {
        "id": 2,
        "tipo": "adopcion",
        "nombre": "Luna",
        "imagen": "https://ejemplo.com/imagenes/luna.jpg",
        "caracteristicas": {
            "raza": "Labrador",
            "desparasitado": true,
            "peso": "12 Kg",
            "esterilizado": true,
            "genero": "Hembra",
            "edad": "3 años"
        },
        "descripcion": "Luna es una perrita cariñosa que busca un hogar lleno de amor.",
        "favorito": true
    },
    {
        "id": 3,
        "tipo": "adopcion",
        "nombre": "Rex",
        "imagen": "https://ejemplo.com/imagenes/rex.jpg",
        "caracteristicas": {
            "raza": "Pastor Alemán",
            "desparasitado": true,
            "peso": "25 Kg",
            "esterilizado": false,
            "genero": "Macho",
            "edad": "4 años"
        },
        "descripcion": "Rex es un perro protector y fiel, ideal para una familia activa.",
        "favorito": false
    },
    {
        "id": 4,
        "tipo": "adopcion",
        "nombre": "Nala",
        "imagen": "https://ejemplo.com/imagenes/nala.jpg",
        "caracteristicas": {
            "raza": "Golden Retriever",
            "desparasitado": true,
            "peso": "20 Kg",
            "esterilizado": true,
            "genero": "Hembra",
            "edad": "2 años"
        },
        "descripcion": "Nala es muy juguetona y sociable, perfecta para niños.",
        "favorito": true
    },
    {
        "id": 5,
        "tipo": "adopcion",
        "nombre": "Simba",
        "imagen": "https://ejemplo.com/imagenes/simba.jpg",
        "caracteristicas": {
            "raza": "Mestizo",
            "desparasitado": false,
            "peso": "5 Kg",
            "esterilizado": false,
            "genero": "Macho",
            "edad": "1 año"
        },
        "descripcion": "Simba es un cachorro lleno de energía y muy cariñoso.",
        "favorito": false
    },
    {
        "id": 6,
        "tipo": "adopcion",
        "nombre": "Daisy",
        "imagen": "https://ejemplo.com/imagenes/daisy.jpg",
        "caracteristicas": {
            "raza": "Beagle",
            "desparasitado": true,
            "peso": "8 Kg",
            "esterilizado": true,
            "genero": "Hembra",
            "edad": "3 años"
        },
        "descripcion": "Daisy es una perrita muy inteligente y leal.",
        "favorito": true
    },
    {
        "id": 7,
        "tipo": "adopcion",
        "nombre": "Rocky",
        "imagen": "https://ejemplo.com/imagenes/rocky.jpg",
        "caracteristicas": {
            "raza": "Bulldog Francés",
            "desparasitado": true,
            "peso": "10 Kg",
            "esterilizado": false,
            "genero": "Macho",
            "edad": "2 años"
        },
        "descripcion": "Rocky es un perro pequeño pero valiente, le encanta jugar.",
        "favorito": false
    },
    {
        "id": 8,
        "tipo": "adopcion",
        "nombre": "Bella",
        "imagen": "https://ejemplo.com/imagenes/bella.jpg",
        "caracteristicas": {
            "raza": "Cocker Spaniel",
            "desparasitado": true,
            "peso": "9 Kg",
            "esterilizado": true,
            "genero": "Hembra",
            "edad": "5 años"
        },
        "descripcion": "Bella es una perrita muy dulce, le encanta estar con personas.",
        "favorito": true
    },
    {
        "id": 9,
        "tipo": "adopcion",
        "nombre": "Max",
        "imagen": "https://ejemplo.com/imagenes/max.jpg",
        "caracteristicas": {
            "raza": "Husky Siberiano",
            "desparasitado": true,
            "peso": "18 Kg",
            "esterilizado": false,
            "genero": "Macho",
            "edad": "3 años"
        },
        "descripcion": "Max es un perro con mucha energía, ideal para quienes disfrutan de la actividad física.",
        "favorito": false
    },
    {
        "id": 10,
        "tipo": "adopcion",
        "nombre": "Chispa",
        "imagen": "https://ejemplo.com/imagenes/chispa.jpg",
        "caracteristicas": {
            "raza": "Chihuahua",
            "desparasitado": true,
            "peso": "2 Kg",
            "esterilizado": true,
            "genero": "Hembra",
            "edad": "6 años"
        },
        "descripcion": "Chispa es pequeña pero con un gran corazón, perfecta para compañía.",
        "favorito": true
    },
    {
        "id": 1,
        "tipo": "rescate",
        "titulo": "Necesitamos traslado a veterinaria en Hohenau",
        "imagen": "https://ejemplo.com/imagenes/rescate1.jpg",
        "ubicacion": {
            "distancia": "50 mts",
            "direccion": "Hohenau"
        },
        "necesidades": [
            "Traslado",
            "Dinero"
        ],
        "descripcion": "Necesitamos móvil para trasladar a este gato a la veterinaria Dutra en Hohenau, también dinero para pagar su tratamiento."
    },
    {
        "id": 2,
        "tipo": "rescate",
        "titulo": "Perrito herido en la carretera",
        "imagen": "https://ejemplo.com/imagenes/rescate2.jpg",
        "ubicacion": {
            "distancia": "3 km",
            "direccion": "Ruta 1 km 250"
        },
        "necesidades": [
            "Atención veterinaria",
            "Traslado"
        ],
        "descripcion": "Se encontró un perro atropellado al costado de la carretera, necesita atención urgente."
    },
    {
        "id": 3,
        "tipo": "rescate",
        "titulo": "Gatitos abandonados en una caja",
        "imagen": "https://ejemplo.com/imagenes/rescate3.jpg",
        "ubicacion": {
            "distancia": "2 km",
            "direccion": "Plaza Central"
        },
        "necesidades": [
            "Hogar temporal",
            "Leche para gatitos"
        ],
        "descripcion": "Cinco gatitos fueron dejados en una caja, necesitan hogar temporal y alimentación."
    },
    {
        "id": 4,
        "tipo": "rescate",
        "titulo": "Perra con cachorros en un baldío",
        "imagen": "https://ejemplo.com/imagenes/rescate4.jpg",
        "ubicacion": {
            "distancia": "5 km",
            "direccion": "Barrio San Roque"
        },
        "necesidades": [
            "Alimento",
            "Refugio",
            "Atención veterinaria"
        ],
        "descripcion": "Una perra dio a luz en un baldío, los cachorros están expuestos al frío y necesitan ayuda."
    },
    {
        "id": 5,
        "tipo": "rescate",
        "titulo": "Perro desnutrido en la terminal",
        "imagen": "https://ejemplo.com/imagenes/rescate5.jpg",
        "ubicacion": {
            "distancia": "1 km",
            "direccion": "Terminal de Ómnibus"
        },
        "necesidades": [
            "Alimento",
            "Atención veterinaria"
        ],
        "descripcion": "Un perro en estado crítico fue visto en la terminal, necesita comida y tratamiento urgente."
    },
    {
        "id": 6,
        "tipo": "rescate",
        "titulo": "Gato atrapado en un árbol",
        "imagen": "https://ejemplo.com/imagenes/rescate6.jpg",
        "ubicacion": {
            "distancia": "500 mts",
            "direccion": "Parque Municipal"
        },
        "necesidades": [
            "Rescate",
            "Hogar temporal"
        ],
        "descripcion": "Un gato lleva tres días atrapado en un árbol, necesita ayuda para bajarlo y un hogar temporal."
    },
    {
        "id": 7,
        "tipo": "rescate",
        "titulo": "Perro con sarna necesita tratamiento",
        "imagen": "https://ejemplo.com/imagenes/rescate7.jpg",
        "ubicacion": {
            "distancia": "2.5 km",
            "direccion": "Zona Mercado 4"
        },
        "necesidades": [
            "Tratamiento médico",
            "Hogar temporal"
        ],
        "descripcion": "Se encontró un perro con sarna severa, necesita atención médica urgente y un hogar donde pueda recuperarse."
    },
    {
        "id": 8,
        "tipo": "rescate",
        "titulo": "Cachorro abandonado en una bolsa",
        "imagen": "https://ejemplo.com/imagenes/rescate8.jpg",
        "ubicacion": {
            "distancia": "3 km",
            "direccion": "Calle 10 y Mariscal López"
        },
        "necesidades": [
            "Hogar temporal",
            "Leche para cachorro"
        ],
        "descripcion": "Alguien dejó un cachorro dentro de una bolsa de basura"
    },
    {
        "id": 1,
        "tipo": "extraviado",
        "titulo": "Michifu está perdido en zona Avda. Irrazábal",
        "imagen": "https://ejemplo.com/imagenes/perdido1.jpg",
        "ubicacion": {
            "distancia": "2 km",
            "direccion": "Avda. Irrazábal c/ Santa María"
        },
        "perdido": true,
        "encontrado": false,
        "descripcion": "Se perdió el lunes, escapó de su casa frente a la Gobernación de Itapúa, tenía collar rojo con cascabel."
    },
    {
        "id": 2,
        "tipo": "extraviado",
        "titulo": "Perdimos a Luna en Barrio San José",
        "imagen": "https://ejemplo.com/imagenes/perdido2.jpg",
        "ubicacion": {
            "distancia": "3 km",
            "direccion": "Calle 14 de Mayo"
        },
        "perdido": true,
        "encontrado": false,
        "descripcion": "Luna se escapó de casa el sábado, es una perra negra con pecho blanco. Cualquier información será recompensada."
    },
    {
        "id": 3,
        "tipo": "extraviado",
        "titulo": "Gato encontrado en Plaza Central",
        "imagen": "https://ejemplo.com/imagenes/encontrado1.jpg",
        "ubicacion": {
            "distancia": "1 km",
            "direccion": "Plaza Central"
        },
        "perdido": false,
        "encontrado": true,
        "descripcion": "Encontré un gato gris atigrado con collar azul en la plaza, parece estar perdido. Busco a su dueño."
    },
    {
        "id": 4,
        "tipo": "extraviado",
        "titulo": "Perrito extraviado en zona Terminal",
        "imagen": "https://ejemplo.com/imagenes/perdido3.jpg",
        "ubicacion": {
            "distancia": "1.5 km",
            "direccion": "Terminal de Ómnibus"
        },
        "perdido": true,
        "encontrado": false,
        "descripcion": "Se perdió Toby, un cachorro marrón con manchas blancas. Tiene chip, pero no responde al llamado."
    },
    {
        "id": 5,
        "tipo": "extraviado",
        "titulo": "Perra encontrada en la ruta",
        "imagen": "https://ejemplo.com/imagenes/encontrado2.jpg",
        "ubicacion": {
            "distancia": "4 km",
            "direccion": "Ruta 1 km 250"
        },
        "perdido": false,
        "encontrado": true,
        "descripcion": "Encontré una perrita con collar rosa deambulando en la ruta. Es muy dócil, debe tener dueño."
    },
    {
        "id": 6,
        "tipo": "extraviado",
        "titulo": "Cachorro perdido en barrio San Roque",
        "imagen": "https://ejemplo.com/imagenes/perdido4.jpg",
        "ubicacion": {
            "distancia": "2 km",
            "direccion": "Barrio San Roque"
        },
        "perdido": true,
        "encontrado": false,
        "descripcion": "Buscamos a nuestro cachorro Bruno, desapareció el domingo por la mañana. Es pequeño y muy juguetón."
    },
    {
        "id": 7,
        "tipo": "extraviado",
        "titulo": "Gata encontrada en Avenida España",
        "imagen": "https://ejemplo.com/imagenes/encontrado3.jpg",
        "ubicacion": {
            "distancia": "3 km",
            "direccion": "Avenida España"
        },
        "perdido": false,
        "encontrado": true,
        "descripcion": "Gata blanca con manchas naranjas encontrada en la avenida, parece estar embarazada. Buscamos a su dueño."
    },
    {
        "id": 8,
        "tipo": "extraviado",
        "titulo": "Perdimos a Max en el Parque Municipal",
        "imagen": "https://ejemplo.com/imagenes/perdido5.jpg",
        "ubicacion": {
            "distancia": "500 mts",
            "direccion": "Parque Municipal"
        },
        "perdido": true,
        "encontrado": false,
        "descripcion": "Max es un perro Golden Retriever, se perdió el viernes en el parque. Es muy amigable, cualquier información es bienvenida."
    },
    {
        "id": 9,
        "tipo": "extraviado",
        "titulo": "Perro encontrado en el barrio Santa Ana",
        "imagen": "https://ejemplo.com/imagenes/encontrado4.jpg",
        "ubicacion": {
            "distancia": "4 km",
            "direccion": "Barrio Santa Ana"
        },
        "perdido": false,
        "encontrado": true,
        "descripcion": "Este perro apareció en mi patio, es de tamaño mediano, color marrón con patas blancas. Parece estar perdido."
    },
    {
        "id": 10,
        "tipo": "extraviado",
        "titulo": "Gatito perdido en el Mercado 4",
        "imagen": "https://ejemplo.com/imagenes/perdido6.jpg",
        "ubicacion": {
            "distancia": "3 km",
            "direccion": "Zona Mercado 4"
        },
        "perdido": true,
        "encontrado": false,
        "descripcion": "Mi gatito Tom se perdió en el mercado. Es negro con ojos verdes, si lo ven, por favor avísenme."
    }
] 
