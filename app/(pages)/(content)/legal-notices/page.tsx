import { AlertTriangle } from "lucide-react"

export default function Page() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Alerta superior */}
            <div className="border border-red-500 rounded-lg p-4 mb-12 flex gap-4 items-start">
                <AlertTriangle className="text-red-500 h-6 w-6 flex-shrink-0 mt-1" />
                <p className="text-gray-800">
                    Adoptamena promueve la tenencia responsable de animales y se ajusta a las leyes nacionales de bienestar y
                    protección animal. Por ello, te recordamos que la tenencia de animales exóticos sin un permiso emitido por el
                    MADES, o de cualquier animal en condiciones inadecuadas, constituye un delito y es penado por la ley.
                </p>
            </div>

            {/* Título principal */}
            <h2 className="text-2xl font-bold text-center mb-8">Sobre la tenencia de animales exóticos</h2>

            {/* Contenido principal */}
            <div className="space-y-6">
                <p>En Paraguay, la Ley 4840/13 y la Ley 96/92 regulan la tenencia de animales exóticos y silvestres.</p>

                <div className="space-y-2">
                    <h2 className="font-bold">Ley 4840/13</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Establece pautas mínimas para proteger a los animales domésticos, silvestres y exóticos en cautiverio.
                        </li>
                        <li>Garantiza el bienestar y la protección de los animales.</li>
                        <li>
                            Prohíbe el sacrificio y la eutanasia de animales sin procedimientos que garanticen un trato humanitario.
                        </li>
                    </ul>
                </div>

                <div className="space-y-2">
                    <h2 className="font-bold">Ley 96/92</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Prohíbe la caza y el comercio de cualquier especie de fauna silvestre.</li>
                        <li>
                            Permite la tenencia de animales silvestres como mascotas con autorización del Ministerio del Ambiente y
                            Desarrollo Sostenible (MADES).
                        </li>
                        <li>
                            Establece que las personas que tengan animales silvestres deben tramitar el Registro Nacional de Vida
                            Silvestre (RNVS) y el Permiso de Tenencia de Mascotas Silvestres.
                        </li>
                    </ul>
                </div>
            </div>


            {/* Título principal */}
            <h1 className="text-2xl font-bold text-center mt-12 mb-8">
                Sobre el maltrato animal y tenencia responsable
            </h1>

            {/* Contenido principal */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <h2 className="font-bold">Ley 4840/13</h2>
                    <p>Establece regulaciones para la protección y el bienestar de los animales en el país. Su principal objetivo es prevenir el maltrato y la crueldad hacia los animales, promoviendo su trato digno y respetuoso:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Penaliza diversas formas de abuso y maltrato hacia los animales, incluyendo la explotación y el trato cruel.</li>
                        <li>Los dueños de animales tienen la obligación de velar por su bienestar, asegurando que vivan en condiciones adecuadas.</li>
                        <li>Establece normas para la venta, compra y reproducción de animales, buscando evitar la sobrepoblación y el tráfico ilegal.</li>
                        <li>Promueve la adopción responsable y la creación y políticas públicas para el bienestar de los animales.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}