import AboutHeader from "@/components/about-us/about-header";


const headerData = {
  title: (
    <>
      SOBRE <br />
      NOSOTROS
    </>
  ),
  text: (
    <>
      Somos una plataforma que actúa de nexo para rescatar animales
      en situación de calle y peligro, con las personas interesadas en ayudar
      de cualquier manera posible.<br /> <br />
      Ya sea a través de rescates directos, indicación de direcciones
      y animalitos perdidos, o donaciones solidarias de cualquier persona
      interesada en la ayuda, protección y rescate.
    </>
  ),
  imageSrc: "/7.avif",
  imageAlt: "Perro mirada intensa"
};




export default function Page() {
  return (
    <>
      <div className="w-full">
        {/* Sección de encabezado */}
        <AboutHeader
          title={headerData.title}
          text={headerData.text}
          imageSrc={headerData.imageSrc}
          imageAlt={headerData.imageAlt}
        />

<div className="h-12 md:h-10" />
      </div>
    </>
  );
}
