import Button from '@/components/buttons/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
    return (
        <div className="relative min-h-screen">
            <Image 
                src="/faq/faq.png" 
                alt=""
                width={1341}  
                height={435}
                className='relative rounded-[32px] top-[50px] left-[50px]'  
            />

            <div className="relative top-[30px] left-[340px]">
                <div className="relative flex items-center w-[756px]">
                    <input
                        className="w-[756px] h-[56px] bg-white top-[515px] left-[342px] rounded-[6px] px-[24px] py-[8px] gap-[4px] shadow-[4px_4px_4px_4px_rgba(3,3,3,0.1)]"
                        type="text"
                        placeholder="Search..."
                        disabled
                    />
                    <button 
                    className="absolute right-0 top-0 bottom-0 px-[20px] bg-blue-500 text-gray-500 rounded-r-[6px]"
                    disabled>
                        <span className="material-symbols-outlined">search</span>
                    </button>
        
                </div>
            </div>
            <div className='relative mt-[100px] mx-[100px]'>
                <details open className=' w-[1161px] group'>
                    <summary className='text-2xl font-bold flex justify-between items-center cursor-pointer'><span>Acerca de Adoptamena</span>
                    <span className="ml-2 text-xl material-symbols-outlined transition-transform transform group-open:rotate-180" style={{ fontSize: '50px' }}>keyboard_arrow_down</span></summary><br/>
                    <p><b className='text-lg'>¿Qué es Adoptamena?</b><br/>
                        Adoptamena es una plataforma que conecta a animales en situación vulnerable con personas dispuestas a ayudar. A través de la plataforma, puedes participar en rescates, hacer donaciones, ofrecer traslados, unirte como voluntario y contribuir de diversas maneras para mejorar la vida de estos animales.
                    </p><br/>  
                    <p><b className='text-lg'>¿Es necesario crear una cuenta para utilizar la plataforma?</b><br/>
                        No es necesario crear una cuenta para ver el contenido de Adoptamena, podés ver las publicaciones y navegar por el sitio libremente pero no podrás comentar, crear publicaciones, recibir notificaciones ni contactar con otros usuarios por lo que te recomendamos crear una cuenta, solo te tomará unos minutos.
                        Para crear tu cuenta haz clic 
                        <Link href="/auth/register" className='text-blue'> aquí.</Link>
                    </p><br/>

                    <p><b className='text-lg'>¿Qué tipo de contenido hay en Adoptamena?</b><br/>
                        En el sitio encontrarás publicaciones tanto de organizaciones como de personas independientes que buscan ayuda para asistir a animales en situación de vulnerabilidad. Estas pueden incluir pedidos de traslado a veterinarias, donaciones de medicamentos, búsqueda de voluntarios para campañas de rescate o colectas, así como anuncios de adopción, información sobre el cuidado de mascotas, venta de productos para animales y campañas de recaudación de fondos para organizaciones.
                    </p><br/>
                    <p><b className='text-lg'>¿Puedo ver información de mascotas en otras ciudades o países?</b><br/>
                        Por el momento la plataforma está disponible solamente para Paraguay.
                    </p><br/>
                </details><br/>

                <details className=' w-[1161px] group'>
                <summary className='text-2xl font-bold flex justify-between items-center cursor-pointer'><span>Uso de la plataforma</span>
                <span className="ml-2 text-xl material-symbols-outlined transition-transform transform group-open:rotate-180" style={{ fontSize: '50px' }}>keyboard_arrow_down</span></summary><br/>

                    <p><b className='text-lg'>¿Cuál es la diferencia entre una cuenta       Personal y de Organización?</b><br/>
                        Las cuentas personales son creadas por individuos que no pertenecen a ninguna organización de bienestar animal. Por otro lado, las cuentas de organización son gestionadas por representantes de entidades sin fines de lucro dedicadas al bienestar animal. Ambas pueden realizar publicaciones y navegar por el sitio de manera similar, con la única diferencia de que las organizaciones pueden crear campañas de recaudación de fondos.
                    </p><br/>

                    <p><b className='text-lg'>¿Por qué no puedo interactuar con el contenido sin crear una cuenta?</b><br/>
                    Es necesario crear una cuenta para realizar publicaciones, comentarios y otras acciones dentro del sitio para mantener la seguridad de los usuarios y evitar contenido inapropiado.
                    </p><br/>

                    <p><b className='text-lg'>¿Qué hago si olvidé mi contraseña?
                    </b><br/>
                    Podés recuperar tu contraseña haciendo click en el siguiente <Link href="/auth/reset-password-request" className='text-blue'> enlace</Link>, una vez introduzcas el correo con el que te registraste vas a recibir un correo electrónico con un enlace para cambiar tu contraseña
.
                    </p><br/>

                    <p><b className='text-lg'>¿Cómo creo una publicación?
                    </b><br/>
                    Para crear un publicación debes estar registrado en el sitio, hacé click en el botón + Crear post y completa el formulario con el tipo de publicación y los datos requeridos.

                    </p><br/>

                    <p><b className='text-lg'>¿Cómo edito una publicación?
                    </b><br/>
                    Solo podrás editar publicaciones hechas por vos, para ello, andá a tu perfil y buscá la publicación que quieras editar, ábrela haciendo click en ella y presiona el botón editar (ícono de un lápiz), modifica los datos que desees y da click en guardar.

                    </p><br/>
                    
                    <p><b className='text-lg'>¿Cómo elimino una publicación?
                    </b><br/>
                    Solo podrás eliminar publicaciones hechas por vos, para ello, andá a tu perfil y buscá la publicación que quieras eliminar, ábrela haciendo click en ella y presiona el botón editar (ícono de un lápiz), al final del formulario vas a encontrar un botón rojo que con el texto “Eliminar publicación” da click en él y confirma la operación.
                    Tené cuidado porque una publicación eliminada no se puede restaurar.


                    </p><br/>

                    <p><b className='text-lg'>¿Cuál es la diferencia entre los distintos tipos de publicaciones?
                    </b><br/>
                    En Adoptamena hay cinco tipos de publicaciones: <br/>
                    <ul className="list-disc pl-6">
                        <li><b>Adopción:</b> Publicaciones de animalitos que buscan un hogar, generalmente después de haber sido rescatados.
                        </li><br/>

                        <li><b>Extraviados:</b> Aquí se reportan animales perdidos o encontrados para ayudar a reunirlos con sus dueños.
                        </li><br/>

                        <li><b>Voluntariado:</b> Sección donde organizaciones y particulares solicitan ayuda en diversas formas, como voluntariado, donaciones o traslados.
                        </li><br/>

                        <li><b>Blog:</b> Espacio dedicado a la tenencia responsable, con información avalada por veterinarios sobre el cuidado adecuado de las mascotas. Te recomendamos leer estas publicaciones antes de adoptar.
                        </li><br/>

                        <li><b>Tienda:</b> Si vendes artículos para animales o necesitas recaudar fondos para tratamientos médicos, rescates o campañas, puedes publicar tus productos o servicios aquí.
                        </li><br/>
                    </ul>

                    </p><br/>


                    <p><b className='text-lg'>¿Qué tipos de animales puedo publicar en Adoptamena?

                    </b><br/>
                    En Adoptamena podés publicar todo tipo de animales en adopción, pero tené en cuenta que la tenencia de animales exóticos está regulada por leyes nacionales. 
                    Para más información sobre este tema, visitá la sección de <Link href="/legal" className='text-blue'> Avisos legales</Link> del sitio.

                    </p><br/>

                    <p><b className='text-lg'>¿Puedo vender animales en la tienda de Adoptamena?

                    </b><br/>
                    <b>No. Adoptamena fomenta la adopción responsable y no permite la comercialización de animales.</b> Creemos firmemente que las mascotas son parte de la familia y no objetos de comercio.
                    Por esta razón, cualquier publicación relacionada con la venta de animales será eliminada, y la cuenta del usuario que la haya creado será suspendida de manera definitiva.
                    Para más información sobre este tema, visitá la sección de <Link href="/legal" className='text-blue'> Avisos legales</Link> del sitio.

                    </p><br/>

                    <p><b className='text-lg'>¿Cómo me contacto con la persona que hizo una publicación de mi interés?

                    </b><br/>
                    Tenés varias formas de hacerlo, podés usar el botón contactar en el detalle de la publicación, esto te permitirá enviarle un mensaje de whatsapp o email dependiendo de los datos de contacto que haya ingresado el usuario. 
                    También podés dejar un comentario en la publicación, estos comentarios son públicos, es decir que cualquiera puede verlos y contestarte.

                    </p><br/>

                </details><br/>

                <details className=' w-[1161px] group'>
                <summary className='text-2xl font-bold flex justify-between items-center cursor-pointer'><span>Cómo colaborar</span>
                <span className="ml-2 text-xl material-symbols-outlined transition-transform transform group-open:rotate-180" style={{ fontSize: '50px' }}>keyboard_arrow_down</span></summary><br/>
                    <p><b className='text-lg'>¿Cómo puedo ser voluntario?</b><br/>
                    Para ser voluntario en Adoptamena, simplemente buscá publicaciones en la sección de <b>Voluntariado</b> que se ajusten a tus posibilidades de ayuda. Algunas formas en las que podés colaborar incluyen: <br/><br/>
                    <ul className="list-disc pl-6">
                        <li>Participar en campañas de rescate y colectas si contás con tiempo libre.</li><br/>
                        <li>Ofrecer traslados de animales a centros veterinarios si tenés un vehículo.</li><br/>
                        <li>Si no dispones de tiempo, pero podés ayudar económicamente podés donar dinero o medicamentos.</li><br/>
                    </ul>
                    Solo debés contactar a la persona que creó la publicación, quien te proporcionará los detalles sobre cómo podés contribuir.

                    </p><br/>

                    <p><b className='text-lg'>¿Puedo donar dinero a través de Adoptamena?</b><br/>
                    No se pueden hacer donaciones directamente desde la plataforma, pero vas a encontrar campañas de recaudación creadas por organizaciones o publicaciones de voluntariado pidiendo ayuda económica. Para donar, solo contactá a la persona que hizo la publicación y te va a indicar cómo hacerlo.<br/>
                    <b>Adoptamena no garantiza el uso adecuado de los fondos ni se hace responsable por el destino final de las donaciones. Si querés más info sobre cómo funcionan las donaciones, hacé clic <Link href="/donations" className='text-blue'> aquí.</Link></b>

                    </p><br/>

                    <p><b className='text-lg'>¿Cómo me convierto en auspiciante del sitio?</b><br/>
                    Siendo auspiciante tu logo aparecerá en las pantallas principales de Adoptamena y pondremos tu publicidad en el banner del sitio, si querés ser patrocinador envia un correo a adoptamena@gmail.com (abrir correo al hacer click)
                    Para más información sobre este tema, visitá la sección de <Link href="/sponsors" className='text-blue'> Auspiciantes</Link> del sitio.

                    </p><br/>

                </details><br/>

                <details className=' w-[1161px] group'>
                <summary className='text-2xl font-bold flex justify-between items-center cursor-pointer'><span>Seguridad y privacidad</span>
                <span className="ml-2 text-xl material-symbols-outlined transition-transform transform group-open:rotate-180" style={{ fontSize: '50px' }}>keyboard_arrow_down</span></summary><br/>

                    <p><b className='text-lg'>¿Es segura mi información personal en Adoptamena?</b><br/>
                    Todos los datos personales registrados en Adoptamena están protegidos y no se divulgan públicamente en el sitio. Sin embargo, los datos de contacto, como tu correo electrónico y número de teléfono, estarán disponibles para que otros usuarios puedan comunicarse contigo. Estos no serán visibles en la página de forma directa, pero podrán verse una vez que un usuario haga clic en el botón de contacto para enviarte un mensaje.

                    </p><br/>

                    <p><b className='text-lg'>¿Cómo puedo asegurarme de que una publicación es legítima?</b><br/>
                    En Adoptamena nos esforzamos por mantener un contenido adecuado y seguro. Si encuentras una publicación que consideras fraudulenta o inapropiada, puedes reportarla para que la revisemos. Algunos factores que pueden ayudarte a evaluar su legitimidad son:<br/>
                    <ul className="list-disc pl-6">
                        <li>La cantidad de publicaciones realizadas por el perfil.</li><br/>
                        <li>Los comentarios de otros usuarios en sus publicaciones.</li><br/>
                        <li>La claridad y coherencia de la información proporcionada.</li><br/>
                    </ul>
                    Si tienes dudas, te recomendamos contactar al usuario y pedir más detalles antes de realizar cualquier acción.


                    </p><br/>
                </details><br/>

                <details className=' w-[1161px] group'>
                <summary className='text-2xl font-bold flex justify-between items-center cursor-pointer'><span>Descargo de responsabilidad</span>
                <span className="ml-2 material-symbols-outlined transition-transform transform group-open:rotate-180" style={{ fontSize: '50px' }}>keyboard_arrow_down</span></summary><br/>

                    <p>
                    Las leyes en Paraguay regulan la tenencia de animales exóticos y castigan el maltrato animal, esta página rechaza el maltrato animal en todas sus formas y exhorta a sus usuarios al cuidado responsable tanto de mascotas como de la fauna local. 
                    Las publicaciones que incluyan contenido que violen estas leyes, fomenten el maltrato y/o la tenencia irresponsable de mascotas serán eliminadas y se realizará la correspondiente denuncia  a las autoridades. 
                    Para más información sobre este tema, visitá la sección de <Link href="/legal" className='text-blue'> Avisos legales</Link> del sitio.


                    </p><br/>
                </details><br/>

            </div>

        </div>
    );
}
