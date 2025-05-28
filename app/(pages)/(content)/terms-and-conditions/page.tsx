import ImageComponent from '@/components/image-component';

export default function Page() {
    return (
        <div className="w-full px-12">

            <ImageComponent src="/terminosycondiciones.png"/>

            <div className="max-w-3xl mx-auto py-8 px-4">
                {/* Contenido principal */}
                <div className="space-y-6">

                    <div className="space-y-2">
                        <h2 className="font-bold">1. Introducción</h2>
                        <p>Bienvenido a Adoptamena, una plataforma diseñada para conectar a personas y organizaciones que buscan ayudar a animales en situación de vulnerabilidad. Al registrarte y utilizar nuestros servicios, aceptás estos Términos y Condiciones. Si no estás de acuerdo, por favor, no uses la plataforma.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">2. Registro y Cuentas de Usuario</h2>
                        <p>2.1. Para acceder a ciertas funciones de Adoptamena, debés crear una cuenta. Existen dos tipos de cuentas: personales y de organizaciones sin fines de lucro.</p>
                        <p>2.2. Sos responsable de la información proporcionada en el registro y de mantener la confidencialidad de tus credenciales.</p>
                        <p>2.3. Adoptamena puede suspender o eliminar cuentas que incumplan estas normas o que se utilicen de manera fraudulenta.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">3. Publicaciones y Contenido</h2>
                        <p>3.1. Adoptamena permite realizar publicaciones en distintas categorías: adopciones, animales extraviados, voluntariado, blog informativo y tienda solidaria.</p>
                        <p>3.2. Queda estrictamente prohibida la venta de animales. Cualquier publicación con fines comerciales será eliminada y la cuenta del usuario podrá ser suspendida.</p>
                        <p>3.3. El contenido publicado debe ser veraz y respetar las normativas vigentes. Adoptamena se reserva el derecho de eliminar publicaciones que considere fraudulentas o inapropiadas.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">4. Donaciones y Transacciones</h2>
                        <p>4.1. Adoptamena no gestiona pagos ni ofrece garantías sobre la legitimidad de las donaciones.</p>
                        <p>4.2. Los usuarios que deseen donar deben contactar directamente al creador de la publicación y coordinar el método de pago.</p>
                        <p>4.3. Adoptamena no se hace responsable del uso que se le dé a los fondos recaudados.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">5. Normas de Conducta</h2>
                        <p>5.1. Todos los usuarios deben actuar con respeto y honestidad en la plataforma.</p>
                        <p>5.2. Está prohibido el fraude, el acoso, la difusión de información falsa y cualquier otro comportamiento indebido.</p>
                        <p>5.3. Adoptamena podrá suspender o eliminar cuentas que incumplan estas normas.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">6. Responsabilidad y Limitaciones</h2>
                        <p>6.1. Adoptamena es una plataforma intermediaria y no garantiza la veracidad de las publicaciones ni el cumplimiento de acuerdos entre usuarios.</p>
                        <p>6.2. No nos hacemos responsables de daños, pérdidas o perjuicios derivados del uso del sitio.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">7. Privacidad y Protección de Datos</h2>
                        <p>7.1. Adoptamena protege los datos personales registrados y no los divulga públicamente.</p>
                        <p>7.2. Los datos de contacto (correo electrónico y teléfono) solo serán visibles cuando otro usuario haga clic en el botón de contacto para enviarte un mensaje.</p>
                        <p>7.3. Podés solicitar la modificación o eliminación de tus datos personales en cualquier momento.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">8. Modificaciones a los Términos</h2>
                        <p>8.1. Adoptamena se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento.</p>
                        <p>8.2. Los cambios se notificarán a los usuarios y el uso continuo de la plataforma implicará su aceptación.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
