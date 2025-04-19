'use client';

import { useState } from 'react';

export default function SponsorFormPage() {
  const [companyName, setCompanyName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [email, setEmail] = useState('');
  const [wantsLogo, setWantsLogo] = useState(false);
  const [wantsBanner, setWantsBanner] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('responsibleName', responsibleName);
    formData.append('email', email);
    formData.append('wantsLogo', wantsLogo.toString());
    formData.append('wantsBanner', wantsBanner.toString());
    if (logoFile) formData.append('logo', logoFile);
    if (bannerFile) formData.append('banner', bannerFile);

    // Aquí podés enviar el formData al endpoint
    console.log('Formulario enviado:', formData);
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-md font-roboto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <img src="/logo.png" alt="Adoptamena" className="mx-auto w-40 mb-4" />
        <p className="text-center text-sm text-gray-700">
          Estás a un paso de convertirte en un auspiciantes y ayudar a nuestra causa
        </p>

        <input
          type="text"
          placeholder="Nombre de la empresa"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Nombre del responsable"
          value={responsibleName}
          onChange={(e) => setResponsibleName(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={wantsLogo}
            onChange={() => setWantsLogo(!wantsLogo)}
          />
          <span>Quiero que mi logo aparezca en la sección de Auspiciantes</span>
        </label>

        {wantsLogo && (
          <div className="border border-blue-400 rounded-xl p-4 text-center">
            <label className="cursor-pointer block">
              + Añadir logo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
          </div>
        )}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={wantsBanner}
            onChange={() => setWantsBanner(!wantsBanner)}
          />
          <span>Quiero publicar un banner publicitario</span>
        </label>

        {wantsBanner && (
          <div className="border border-blue-400 rounded-xl p-6 text-center">
            <label className="cursor-pointer block">
              + Añadir banner
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Tamaño sugerido: 900x300 píxeles</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          Enviar solicitud
        </button>
        <button
          type="button"
          className="w-full py-2 px-4 rounded-full border border-purple-600 text-purple-600 font-semibold hover:bg-purple-100 transition"
        >
          Ir a Inicio
        </button>
      </form>
    </div>
  );
}
