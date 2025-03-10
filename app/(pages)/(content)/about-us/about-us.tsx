const AboutUs = () => {
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="bg-[#F3F3F3] py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
          {/* Texto principal (izquierda) */}
          <div className="order-2 md:order-1 px-4 md:px-8">
            <h1 className="text-[#FFAE34] text-4xl font-bold">
              SOBRE <br />NOSOTROS
            </h1>
            <p className="mt-4 text-gray-700 text-lg leading-relaxed text-left">
              Somos una plataforma que actúa de nexo para rescatar animales en
              situación de calle y gatos, con las personas interesadas en ayudar
              de cualquier manera posible.
            </p>
          </div>

          {/* Imagen (derecha) */}
          <div className="order-1 md:order-2">
            <img
              src="/images/about-us.jpg"
              alt="Mujer abrazando a un gato"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
        {/* Espaciado adicional debajo */}
        <div className="h-12 md:h-20"></div>
      </div>

      {/* Secciones de Misión, Visión y Valores */}
      <div className="space-y-8 md:space-y-12">
        {/* Misión */}
        <div className="flex flex-col md:flex-row justify-around items-start md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex justify-center items-center shrink-0">
              <span className="material-symbols-outlined font-material text-4xl">
                diamond
              </span>
            </div>
            <h2 className="text-[#FFAE34] text-clip text-2xl font-bold">
              Misión
            </h2>
          </div>
          <div className="text-right max-w-md">
            <p className="mt-6 text-gray text-lg leading-relaxed text-left">
              Queremos generar un impacto positivo ante la problemática de los
              animales en situación de calle, creando herramientas que les
              acerquen a oportunidades de adopción.
            </p>
          </div>
        </div>

        {/* Visión */}
        <div className="flex flex-col md:flex-row justify-around items-start md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex justify-center items-center shrink-0">
              <span className="material-symbols-outlined font-material text-4xl">
                visibility
              </span>
            </div>
            <h2 className="text-[#FFAE34] text-2xl font-bold">Visión</h2>
          </div>
          <div className="text-right max-w-md">
            <p className="mt-2 text-gray text-lg leading-relaxed text-left">
              Ser una plataforma líder que conecte a animales abandonados con
              hogares amorosos, promoviendo una cultura de adopción responsable
              en todo el mundo.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="flex flex-col md:flex-row justify-around items-start md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex justify-center items-center shrink-0">
              <span className="material-symbols-outlined font-material text-4xl">
                favorite
              </span>
            </div>
            <h2 className="text-[#FFAE34] text-2xl font-bold">Valores</h2>
          </div>
          <div className="text-right max-w-md">
            <p className="mt-2 text-gray text-lg leading-relaxed text-left">
                Compasión: Nos mueve el amor y el respeto hacia todos los animales, buscando siempre su bienestar y protección.
                Colaboración: Fomentamos el trabajo conjunto entre rescatistas, voluntarios, donantes y adoptantes, creando una red sólida y efectiva para ayudar a los animales.
                Transparencia: Actuamos con honestidad y claridad, manteniendo a nuestra comunidad informada y asegurando que todas nuestras acciones sean visibles y comprensibles.
                Compromiso: Estamos dedicados a nuestra misión de rescatar y proteger a los animales en situación de calle, trabajando con perseverancia y dedicación.
                Empatía: Valoramos las necesidades y sentimientos tanto de los animales como de las personas involucradas, fomentando un ambiente de comprensión y apoyo mutuo.
                Educación: Creemos en la importancia de informar y sensibilizar a la comunidad sobre el rescate, cuidado y adopción de animales, promoviendo una cultura de responsabilidad y amor hacia ellos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
