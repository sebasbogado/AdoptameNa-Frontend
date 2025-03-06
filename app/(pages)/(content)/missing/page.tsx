'use client'

import { useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import dynamic from 'next/dynamic';
import Footer from "@/components/footer";
import Image from "next/image";
import { Facebook, Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MapWithNoSSR = dynamic(
  () => import('@/components/ui/Map'),
  { ssr: false }
);

const AdoptionForm = () => {
  const [formData, setFormData] = useState({
    tipoPublicacion: "Adopción",
    tipoAnimal: "Perro",
    titulo: "",
    descripcion: "",
    genero: "", // Updated to use a single value for gender
    edad: "",
    peso: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [selectedImages, setSelectedImages] = useState<string[]>([
    "/1.avif",
    "/2.avif",
    "/3.avif",
    "/4.avif"
  ]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs separately
    if (type === "checkbox" && "checked" in e.target) {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked ? value : "" // Set genero to the value if checked, otherwise clear it
      }));
    } else {
      // Handle other inputs (text, textarea, select)
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.titulo) newErrors.titulo = "Título es requerido";
    if (!formData.descripcion) newErrors.descripcion = "Descripción es requerida";
    if (!formData.edad) newErrors.edad = "Edad es requerida";
    if (!formData.peso) newErrors.peso = "Peso es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
      // Submit form data to backend or handle accordingly
    }
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedImages.length) % selectedImages.length);
  };

  return (
    <div>
      <div className="flex flex-col items-center p-6">
        <div className="border p-4 w-full max-w-5xl rounded-lg shadow">
          <CardContent>
            <div className="relative w-full flex items-center justify-center">
              <button className="absolute left-0 bg-white p-2 rounded-full" onClick={handlePrev}>
                <ChevronLeft size={50} />
              </button>
              <Image src={selectedImages[currentImageIndex]} alt="pet" width={500} height={300} className="w-3/4 max-w-full h-auto rounded-md mx-auto" />
              <button className="absolute right-0 bg-white p-2 rounded-full" onClick={handleNext}>
                <ChevronRight size={50} />
              </button>
            </div>
            <div className="flex gap-2 mt-2 justify-center items-center">
              {selectedImages.map((src, index) => (
                <Image key={index} src={src} alt="pet" width={60} height={60} className={`cursor-pointer ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`} onClick={() => setCurrentImageIndex(index)} />
              ))}
            </div>
          </CardContent>
        </div>
        {/* Wrapped Card Component */}
        <div className="w-full max-w-2xl">
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit}>
                {/* Select for Tipo de Publicación */}
                <div className="w-full mb-2">
                  <label className="block mb-1">Tipo de Publicación</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="tipoPublicacion"
                    value={formData.tipoPublicacion}
                    onChange={handleChange}
                  >
                    <option>Adopción</option>
                    <option>Extraviado</option>
                  </select>
                </div>

                {/* Select for Tipo de Animal */}
                <div className="w-full mb-2">
                  <label className="block mb-1">Tipo de Animal</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="tipoAnimal"
                    value={formData.tipoAnimal}
                    onChange={handleChange}
                  >
                    <option>Perro</option>
                    <option>Gato</option>
                  </select>
                </div>

                {/* Input for Título */}
                <div className="mb-2">
                  <label className="block mb-1">Título</label>
                  <Input
                    placeholder="Título"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    maxLength={200}
                  />
                  {errors.titulo && <p className="text-red-500">{errors.titulo}</p>}
                </div>

                {/* Textarea for Descripción */}
                <div className="mb-2">
                  <label className="block mb-1">Descripción</label>
                  <Textarea
                    placeholder="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    maxLength={500}
                  />
                  {errors.descripcion && <p className="text-red-500">{errors.descripcion}</p>}
                </div>

                {/* Checkbox for Gender */}
                <div className="flex gap-2 items-center mb-2">
                  <label>Macho</label>
                  <input
                    type="checkbox"
                    name="genero"
                    value="Macho"
                    checked={formData.genero === "Macho"}
                    onChange={handleChange}
                  />
                  <label>Hembra</label>
                  <input
                    type="checkbox"
                    name="genero"
                    value="Hembra"
                    checked={formData.genero === "Hembra"}
                    onChange={handleChange}
                  />
                  {errors.genero && <p className="text-red-500">{errors.genero}</p>}
                </div>

                {/* Input for Edad */}
                <div className="mb-2">
                  <label className="block mb-1">Edad</label>
                  <Input
                    placeholder="Edad"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    maxLength={5}
                  />
                  {errors.edad && <p className="text-red-500">{errors.edad}</p>}
                </div>

                {/* Input for Peso */}
                <div className="mb-2">
                  <label className="block mb-1">Peso</label>
                  <Input
                    placeholder="Peso"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    maxLength={5}
                  />
                  {errors.peso && <p className="text-red-500">{errors.peso}</p>}
                </div>

                <div className="h-full">
                  <MapWithNoSSR />
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6 w-full">
                  {/* Botón a la izquierda */}
                  <button
                    type="button"
                    className="px-5 py-2 rounded-md bg-red-700 text-white font-semibold shadow-md hover:bg-red-800 transition"
                  >
                    Eliminar publicación
                  </button>

                  {/* Contenedor alineado a la derecha */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="px-5 py-2 rounded-md border border-blue-500 text-blue-500 font-semibold hover:bg-blue-100 transition"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-md bg-purple-500 text-white font-semibold shadow-md hover:bg-purple-600 transition"
                    >
                      Crear publicación
                    </button>
                  </div>
                </div>



              </form>
            </CardContent>
          </Card>

        </div>

      </div>
      <Footer />
    </div>
  );
};

export default AdoptionForm;