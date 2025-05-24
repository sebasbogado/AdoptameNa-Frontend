'use client'

import ImageComponent from '@/components/image-component';
import Image from 'next/image';
import SkeletonStaticPage from '@/components/skeleton-static-page';
import { useEffect, useState } from 'react';

export default function Page() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SkeletonStaticPage />;
    }

    return (
        <div className="w-full px-12">

            <ImageComponent src="/politicasdeprivacidad.png"/>

            <div className="max-w-3xl mx-auto py-8 px-4">

                {/* Contenido principal */}
                <div className="space-y-6">

                    <div className="space-y-2">
                        <h2 className="font-bold">1. Introducción</h2>
                        <p>Adoptamena se compromete a proteger la privacidad de sus usuarios y la seguridad de su información personal. Estas Políticas de Privacidad describen cómo recopilamos, usamos, almacenamos y protegemos los datos de los usuarios que interactúan con nuestra plataforma.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">2. Información Recopilada</h2>
                        <p>2.1. Adoptamena recopila la siguiente información cuando te registrás en la plataforma o utilizás nuestros servicios:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Datos de registro: Nombre, correo electrónico, número de teléfono y contraseña.</li>
                            <li>Datos de perfil: Fotografía de perfil, ubicación y descripción personal (si se proporciona).</li>
                            <li>Publicaciones y contenido generado por el usuario.</li>
                            <li>Datos de contacto con otros usuarios dentro de la plataforma.</li>
                        </ul>
                        <p>2.2. También podemos recopilar información de navegación, como direcciones IP, tipo de dispositivo, sistema operativo y páginas visitadas, para mejorar la experiencia del usuario.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">3. Uso de la Información</h2>
                        <p>La información recopilada se utiliza para los siguientes fines:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Proporcionar y mejorar los servicios de Adoptamena.</li>
                            <li>Permitir la comunicación entre usuarios interesados en adoptar, donar o colaborar.</li>
                            <li>Garantizar el cumplimiento de nuestras normas y prevenir el uso indebido de la plataforma.</li>
                            <li>Enviar notificaciones sobre cambios en la plataforma o nuevas funcionalidades.</li>
                            <li>Proteger la seguridad de los usuarios y detectar actividades fraudulentas.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">4. Compartición de Datos</h2>
                        <p>4.1. Adoptamena no vende, alquila ni comparte información personal con terceros sin el consentimiento del usuario, salvo en las siguientes circunstancias:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Cuando sea requerido por ley o autoridad competente.</li>
                            <li>Para proteger los derechos y seguridad de la plataforma y sus usuarios.</li>
                            <li>Para el cumplimiento de nuestras normas de uso y términos de servicio.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">5. Almacenamiento y Seguridad</h2>
                        <p>5.1. Implementamos medidas de seguridad adecuadas para proteger los datos personales contra accesos no autorizados, alteraciones o pérdidas.</p>
                        <p>5.2. Los datos se almacenan en servidores seguros y se aplican protocolos de cifrado para proteger la información.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">6. Derechos del Usuario</h2>
                        <p>6.1. Como usuario de Adoptamena, tenés derecho a:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Acceder a la información personal que almacenamos.</li>
                            <li>Solicitar la modificación o eliminación de tus datos.</li>
                            <li>Revocar el consentimiento para el uso de tus datos.</li>
                        </ul>
                        <p>6.2. Para ejercer estos derechos, podés contactarnos a través de adoptamena@gmail.com.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">7. Cookies y Tecnologías Similares</h2>
                        <p>7.1. Adoptamena utiliza cookies para mejorar la experiencia del usuario y optimizar el funcionamiento del sitio.</p>
                        <p>7.2. Podés configurar tu navegador para rechazar cookies, aunque esto podría afectar algunas funcionalidades de la plataforma.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-bold">8. Modificaciones a la Política de Privacidad</h2>
                        <p>8.1. Adoptamena se reserva el derecho de modificar esta Política de Privacidad en cualquier momento.</p>
                        <p>8.2. Cualquier cambio será notificado a los usuarios y el uso continuo de la plataforma implicará la aceptación de los nuevos términos.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}