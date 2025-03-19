'use client'

import { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from 'next/dynamic';
import Footer from "@/components/footer";
import Image from "next/image";
import { Facebook, Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MapProps } from "@/types/map-props";
import { useAppContext } from "@/contexts/appContext";
//import Axios from "@/utils/axiosInstace";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from '@/contexts/authContext';
import { getBreed } from "@/utils/breed.http";
import { postPets } from "@/utils/pets.http";
import { getPetStatus } from "@/utils/pet-status.http";
import { PlusCircle } from "lucide-react";
import { postMedia } from "@/utils/media.http";

const MapWithNoSSR = dynamic<MapProps>(
  () => import('@/components/ui/map'),
  { ssr: false }
);

const AdoptionForm = () => {

  const { authToken, user, loading: authLoading } = useAuth();
  const { currentUser } = useAppContext()
  const [animals, setAnimals] = useState<any[] | null>(null)
  const [breed, setBreed] = useState<any[] | null>(null)
  const [petsStatus, setPetsStatus] = useState<any[] | null>(null)
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  const [position, setPosition] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState({
    estado: 12,
    tipoAnimal: 1,
    raza: 1,
    titulo: "",
    cumpleanhos: "",
    descripcion: "",
    vacunado: "",
    esterilizado: "",
    genero: "", 
    edad: "",
    peso: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const getFromData = async () => {
    const respAnimals = await getAnimals({ size: 100, page: 0 }, authToken)
    if (respAnimals) {
      console.log("Resultado Animals", respAnimals)
      setAnimals(respAnimals)
    }
    const respBreed = await getBreed({ size: 100, page: 0 }, authToken)
    if (respBreed) {
      console.log("Resultado Breed", respBreed)
      setBreed(respBreed)
    }
    const respPetStatus = await getPetStatus({ size: 100, page: 0 }, authToken)
    if (respPetStatus) {
      console.log("Resultado PetStatus", respPetStatus)
      setPetsStatus(respPetStatus)
    }
    const respImageSelected = await getPetStatus({ size: 100, page: 0 }, authToken)
    if (respImageSelected) {
      console.log("Resultado PetStatus", respImageSelected)
      setPetsStatus(respImageSelected)
    }
  }

  useEffect(() => {
    getFromData()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await postMedia(formData, authToken);
        console.log("Respuesta de postMedia:", response);
        if (response) {
          setSelectedImages([...selectedImages, { file, url_API: response.url , url: URL.createObjectURL(file) }]);
        }
      } catch (error) {
        console.error("Error al subir la imagen", error);
      }
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs separately
    if (type === "checkbox" && "checked" in e.target) {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked ? value : "" 
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
    if (!formData.vacunado) newErrors.vacunado = "Campo obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!authToken) {
      console.error("No hay token de autenticación disponible.");
      return;
    }


    if (validateForm()) {

      console.log(formData);
      const params = {
        "name": formData.titulo,
        "isVaccinated": formData.vacunado === "Si",
        "description": formData.descripcion,
        "birthdate": formData.cumpleanhos,
        "gender": formData.genero,
        "urlPhoto": selectedImages[0].url_API,
        "isSterilized": formData.esterilizado === "Si",
        "userId": Number(user?.id),
        "animalId": Number(formData.tipoAnimal),
        "breedId": Number(formData.raza),
        "petStatusId": Number(formData.estado),
        "addressCoordinates": `${position?.[0]}, ${position?.[1]}`
      }

      const response = await postPets(params, authToken)
      if (response) {
        console.log("Guardado ", response)
      }

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
            {/* Contenedor Principal */}
            <div className="relative w-[800px] h-[300px] mx-auto flex items-center justify-center">
              {/* Botón Izquierdo */}
              <button
                className="absolute left-2 z-10 bg-white p-2 rounded-full shadow-md"
                onClick={handlePrev}
              >
                <ChevronLeft size={40} />
              </button>

              {/* Imagen Principal */}
              <div className="relative w-full h-full">
                {selectedImages[currentImageIndex]?.url && <Image
                  src={selectedImages[currentImageIndex]?.url}
                  alt="pet"
                  fill
                  className="object-cover rounded-md"                  
                />}
              </div>

              {/* Botón Derecho */}
              <button
                className="absolute right-2 z-10 bg-white p-2 rounded-full shadow-md"
                onClick={handleNext}
              >
                <ChevronRight size={40} />
              </button>
            </div>

            {/* Miniaturas */}
            <div className="flex gap-2 mt-2 justify-center items-center">
              {selectedImages.map((src, index) => (
                <div key={index} className="relative w-[60px] h-[60px] cursor-pointer">
                  <Image
                    src={src.url}
                    alt="pet"
                    fill
                    className={`object-cover rounded-md transition-all duration-200 hover:scale-110 ${index === currentImageIndex ? 'border-2 border-blue-500' : ''
                      }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                </div>

              ))}
              <div className="mt-4 flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600 transition"
                >
                  <PlusCircle size={40} />
                </label>
              </div>
            </div>

          </CardContent>



        </div>
        {/* Wrapped Card Component */}
        <div className="w-full max-w-2xl">
          <Card>
            <CardContent className="p-4">
              <form>
                {/* Select for Tipo de Publicación */}
                <div className="w-full mb-2">
                  <label className="block mb-1">Estado de la mascota</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    {
                      petsStatus?.map((a, i) => <option key={i} value={a.id}>{a.name}</option>)
                    }
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
                  >"
                    {
                      animals?.map((a, i) => <option key={i} value={a.id}>{a.name}</option>)
                    }
                  </select>
                </div>

                {/* Select for breed */}
                <div className="w-full mb-2">
                  <label className="block mb-1">Raza</label>
                  <select
                    className="w-full p-2 border rounded"
                    name="raza"
                    value={formData.raza}
                    onChange={handleChange}
                  >
                    {
                      breed
                        ?.filter((b) => b.animalId === Number(formData.tipoAnimal)) // Filtra por tipo de animal
                        .map((b, i) => <option key={i} value={b.id}>{b.name}</option>)
                    }
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

                {/* Textarea for birthday */}
                <div className="mb-2">
                  <label className="block mb-1">Cumpleaños</label>
                  <input
                    type="date"
                    name="cumpleanhos"
                    value={formData.cumpleanhos}
                    onChange={handleChange}
                  />
                  {errors.descripcion && <p className="text-red-500">{errors.descripcion}</p>}
                </div>

                {/* Checkbox for Gender */}
                <div className="flex gap-2 items-center mb-2">
                  <label>Macho</label>
                  <input
                    type="checkbox"
                    name="genero"
                    value="MALE"
                    checked={formData.genero === "MALE"}
                    onChange={handleChange}
                  />
                  <label>Hembra</label>
                  <input
                    type="checkbox"
                    name="genero"
                    value="FEMALE"
                    checked={formData.genero === "FEMALE"}
                    onChange={handleChange}
                  />
                  {errors.genero && <p className="text-red-500">{errors.genero}</p>}
                </div>

                {/* Checkbox for Vacuna */}
                <label className="block mb-1">Esta vacunado?</label>
                <div className="flex gap-2 items-center mb-2">

                  <label>Si</label>
                  <input
                    type="checkbox"
                    name="vacunado"
                    value="Si"
                    checked={formData.vacunado === "Si"}
                    onChange={handleChange}
                  />
                  <label>No</label>
                  <input
                    type="checkbox"
                    name="vacunado"
                    value="No"
                    checked={formData.vacunado === "No"}
                    onChange={handleChange}
                  />
                  {errors.vacunado && <p className="text-red-500">{errors.vacunado}</p>}
                </div>

                {/* Checkbox for Vacuna */}
                <label className="block mb-1">Esta esterilizado?</label>
                <div className="flex gap-2 items-center mb-2">

                  <label>Si</label>
                  <input
                    type="checkbox"
                    name="esterilizado"
                    value="Si"
                    checked={formData.esterilizado === "Si"}
                    onChange={handleChange}
                  />
                  <label>No</label>
                  <input
                    type="checkbox"
                    name="esterilizado"
                    value="No"
                    checked={formData.esterilizado === "No"}
                    onChange={handleChange}
                  />
                  {errors.esterilizado && <p className="text-red-500">{errors.esterilizado}</p>}
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
                  <MapWithNoSSR position={position} setPosition={setPosition} />

                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6 w-full">

                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="px-5 py-2 rounded-md border border-blue-500 text-blue-500 font-semibold hover:bg-blue-100 transition"
                    >
                      Cancelar
                    </button>

                    <button onClick={handleSubmit}>
                      Crear
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