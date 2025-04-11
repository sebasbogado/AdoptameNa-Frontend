'use client'

import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { MapProps } from "@/types/map-props";
//import Axios from "@/utils/axiosInstace";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from '@/contexts/auth-context';
import { getBreed } from "@/utils/breed.http";
import { getPet, postPets, updatePet } from "@/utils/pets.http";
import { postMedia } from "@/utils/media.http";
import Button from '@/components/buttons/button';
import { ImagePlus } from "lucide-react";
import Banners from "@/components/banners";
import { Maximize, Minimize } from "lucide-react";
import { getPetStatuses } from "@/utils/pet-statuses.http";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetFormValues, petSchema } from "@/validations/pet-schema";
import { ConfirmationModal } from "@/components/form/modal";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@material-tailwind/react";
import { Pet, UpdatePet } from "@/types/pet";
import { useForm } from "react-hook-form";


const MapWithNoSSR = dynamic<MapProps>(
  () => import('@/components/ui/map'),
  { ssr: false }
);

const AdoptionForm = () => {
  const { authToken, user, loading: authLoading } = useAuth();
  const [animals, setAnimals] = useState<any[] | null>(null)
  const [breed, setBreed] = useState<any[] | null>(null)
  const [petsStatus, setPetsStatus] = useState<any[] | null>(null)
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const { petId } = useParams();
  const router = useRouter();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const MAX_IMAGES = 2; //Tam max de imagenes
  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: {
      petStatusId: 0,
      animalId: 0,
      breedId: 0,
      name: "",
      birthdate: "",
      description: "",
      isVaccinated: false,
      isSterilized: false,
      gender: "MALE",
      //edad: 0,
      //peso: 0,
    },
  });


  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    router.push("/profile");
  };

  useEffect(() => {
    if (!authToken) return;

    const fetchInitialData = async () => {
      const [animalsRes, breedsRes, statusesRes] = await Promise.all([
        getAnimals(),
        getBreed(),
        getPetStatuses()
      ]);
      setAnimals(animalsRes.data);
      setBreed(breedsRes.data);
      setPetsStatus(statusesRes.data);
    };

    fetchInitialData();
  }, [authToken]);

  useEffect(() => {
    const fetchPet = async () => {
      if (authLoading || !authToken || !user?.id || !petId) return;
      if (!animals || !breed || !petsStatus) return;
  
      try {
        const petData = await getPet(String(petId));
        if (petData) {
          reset({
            petStatusId: petData.petStatusId || 0,
            animalId: petData.animalId || 0,
            breedId: petData.breedId || 0,
            name: petData.name || "",
            birthdate: petData.birthdate || "",
            description: petData.description || "",
            isVaccinated: petData.isVaccinated || false,
            isSterilized: petData.isSterilized || false,
            gender: petData.gender || "MALE",
          });
  
          if (petData.addressCoordinates) {
            const [lat, lng] = petData.addressCoordinates.split(',').map(Number);
            setPosition([lat, lng]);
          }
  
          if (petData.urlPhoto) {
            setSelectedImages([{
              file: null,
              url_API: petData.urlPhoto,
              url: petData.urlPhoto
            }]);
          }
        }
      } catch (error) {
        console.error("Error al cargar mascota:", error);
        setErrorMessage("No se pudo cargar la información de la mascota.");
      }
    };
  
    fetchPet();
  }, [authToken, authLoading, user?.id, petId, animals, breed, petsStatus, reset]);
  
  const openConfirmationModal = () => {
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // Verifica la cantidad de imagens que se pueden subir
      if (selectedImages.length >= 2) {
        setErrorMessage(`Solo puedes subir hasta 2 imágenes.`);
        return;
      }
      // Verificar el tamaño del archivo (1MB)
      if (file.size > 1024 * 1024) {
        setErrorMessage("El archivo es demasiado grande. Tamaño máximo: 1MB.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      if (!authToken) {
        throw new Error("El token de autenticación es requerido");
      }

      try {
        const response = await postMedia(formData, authToken);
        if (response) {
          const newImages = [...selectedImages, { file, url_API: response.url, url: URL.createObjectURL(file) }];
          setSelectedImages(newImages);
        }
      } catch (error) {
        console.error("Error al subir la imagen", error);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };



  const adjustImageSize = () => {
    if (!bannerRef.current) return;

    const images = bannerRef.current.querySelectorAll("img");
    images.forEach((img) => {
      if (document.fullscreenElement) {
        img.style.width = "100vw";
        img.style.height = "100vh";
        img.style.objectFit = "contain"; // Asegura que la imagen se vea completa sin cortes
        setIsFullscreen(true);
      } else {
        img.style.width = "";
        img.style.height = "";
        img.style.objectFit = "";
        setIsFullscreen(false);
      }
    });
  };

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition); // Actualiza el petStatusId local
    //setValue("addressCoordinates", newPosition); // Actualiza el formulario
  };

  const toggleFullScreen = () => {
    if (!bannerRef.current) return;

    if (!document.fullscreenElement) {
      bannerRef.current.requestFullscreen()
        .then(() => adjustImageSize())
        .catch((err) => console.error("Error al activar pantalla completa:", err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", adjustImageSize);
    return () => document.removeEventListener("fullscreenchange", adjustImageSize);
  }, []);

  useEffect(() => {
    if (authLoading || !authToken || !user?.id) return;
    console.log("authLoading", authLoading);
  }, [authToken, authLoading, user?.id]);


  console.log("Selectimages- : ", selectedImages[0]);

  const confirmSubmit = async () => {
    if (!authToken) {
      console.error("No hay token de autenticación disponible.");
      return;
    }
  
    try {
      const formValues = getValues();
      
      const updatedData = {
        ...formValues,
        urlPhoto: selectedImages[0]?.url_API,
        userId: Number(user?.id),
        addressCoordinates: position ? `${position[0]},${position[1]}` : null,
      };
  
      const response = await updatePet(String(petId), updatedData as UpdatePet, authToken);
      if (response) {
        setSuccessMessage("Se guardó exitosamente");
        setTimeout(() => router.push(`/pets/${response.id}`), 3500);
      }
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setErrorMessage("Error en la edición de la mascota");
    }
  };

  const arrayImages = selectedImages?.map(image => image?.url_API) || [];

  return (
    <div>
      <div className="flex flex-col items-center p-6">
        <div className="border p-4 w-full max-w-5xl rounded-lg shadow">
          <div className={`relative ${isFullscreen ? "w-screen h-screen" : ""}`} ref={bannerRef}>
            <Banners images={arrayImages} className={`${isFullscreen ? "w-screen h-screen" : "h-[400px]"}`} />
            <button
              onClick={toggleFullScreen}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
            >
              <Maximize size={20} />
            </button>
          </div>
          <div className="flex gap-2 mt-2 justify-center items-center">

            {selectedImages.map((img, index) => (
              <div key={index} className="relative w-24 h-24 group">
                {/* Imagen */}
                <img
                  src={img.url}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border"
                />

                {/* Botón de eliminación */}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ✕
                </button>
              </div>
            ))}

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="fileInput"
              onChange={handleImageUpload}
              disabled={selectedImages.length >= MAX_IMAGES} // Deshabilita cuando se llega al límite
            />
            <label
              htmlFor="fileInput"
              className={`cursor-pointer flex items-center justify-center w-24 h-24 rounded-lg border-2 transition ${selectedImages.length >= MAX_IMAGES ? "border-gray-400 cursor-not-allowed" : "border-blue-500 hover:border-blue-700"
                } bg-white`}
            >
              <ImagePlus size={20} className={selectedImages.length >= MAX_IMAGES ? "text-gray-400" : "text-blue-500"} />
            </label>
          </div>
        </div>
        {/* Wrapped Card Component */}
        <div className="w-full max-w-2xl">
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit(() => openConfirmationModal())}>
                <div className="w-full mb-2">
                  <label className="block mb-1">Estado de la mascota</label>
                  <select className="w-full p-2 border rounded" {...register("petStatusId", { valueAsNumber: true })}>
                    {petsStatus?.map((a, i) => (
                      <option key={i} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {errors.petStatusId && <p className="text-red-500">{errors.petStatusId.message}</p>}
                </div>

                {/* Tipo de Animal */}
                <div className="w-full mb-2">
                  <label className="block mb-1">Tipo de Animal</label>
                  <select className="w-full p-2 border rounded" {...register("animalId", { valueAsNumber: true })}>
                    {animals?.map((a, i) => (
                      <option key={i} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {errors.animalId && <p className="text-red-500">{errors.animalId.message}</p>}
                </div>

                {/* breedId */}
                <div className="w-full mb-2">
                  <label className="block mb-1">Raza</label>
                  <select className="w-full p-2 border rounded" {...register("breedId", { valueAsNumber: true })}>
                    {breed?.filter((b) => b.animalId === watch("animalId")) // Filtra por tipo de animal
                      .map((b, i) => (
                        <option key={i} value={b.id}>{b.name}</option>
                      ))}
                  </select>
                  {errors.breedId && <p className="text-red-500">{errors.breedId.message}</p>}
                </div>

                {/* Título */}
                <div className="mb-2">
                  <label className="block mb-1">Título</label>
                  <input className="w-full p-2 border rounded" placeholder="Título" {...register("name")} maxLength={200} />
                  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                {/* Descripción */}
                <div className="mb-2">
                  <label className="block mb-1">Descripción</label>
                  <textarea className="w-full p-2 border rounded" placeholder="Descripción" {...register("description")} maxLength={500} />
                  {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>

                {/* Fecha de birthdate */}
                <div className="mb-2">
                  <label className="block mb-1">Fecha de birthdate</label>
                  <input type="date" className="w-full p-2 border rounded" {...register("birthdate")} />
                  {errors.birthdate && <p className="text-red-500">{errors.birthdate.message}</p>}
                </div>

                {/* Género */}
                <div className="flex gap-2 items-center mb-2">
                  <label>Macho</label>
                  <input type="radio" value="MALE" {...register("gender")} />
                  <label>Hembra</label>
                  <input type="radio" value="FEMALE" {...register("gender")} />
                </div>

                {/* isVaccinated */}
                <label className="block mb-1">¿Está Vacunado?</label>
                <div className="flex gap-2 items-center mb-2">
                  <label>Sí</label>
                  <input type="checkbox" {...register("isVaccinated")} />
                  {errors.isVaccinated && <p className="text-red-500">{errors.isVaccinated.message}</p>}
                </div>

                {/* isSterilized */}
                <label className="block mb-1">¿Está Esterilizado?</label>
                <div className="flex gap-2 items-center mb-2">
                  <label>Sí</label>
                  <input type="checkbox" {...register("isSterilized")} />
                  {errors.isSterilized && <p className="text-red-500">{errors.isSterilized.message}</p>}
                </div>

                {/* Edad */}
                <div className="mb-2">
                  <label className="block mb-1">Edad</label>
                  <input type="number" className="w-full p-2 border rounded" /*{...register("edad", { valueAsNumber: true })}*/ />
                  {/*{errors.edad && <p className="text-red-500">{errors.edad.message}</p>}*/}
                </div>

                {/* Peso */}
                <div className="mb-2">
                  <label className="block mb-1">Peso</label>
                  <input type="number" className="w-full p-2 border rounded" /*{...register("peso", { valueAsNumber: true })}*/ />
                  {/*{errors.peso && <p className="text-red-500">{errors.peso.message}</p>}*/}
                </div>

                {/* Mapa */}
                <div
                  className={`h-full relative transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}
                >
                  <MapWithNoSSR position={position} setPosition={handlePositionChange} />

                </div>

                {/* Buttons */}
                <div className="flex justify-end items-center mt-6 w-full">
                  <div className="flex gap-4">
                    <Button
                      variant="tertiary"
                      className="border rounded text-gray-700"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>

                    <Button
                      type="submit"
                      variant="cta"
                      disabled={isSubmitting}
                      className={`transition-colors ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                      {isSubmitting ? "Creando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          {successMessage && (
            <Alert
              color="green"
              className="fixed top-4 right-4 w-72 shadow-lg z-[60]"
              onClose={() => setSuccessMessage(null)}
            >
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert
              color="red"
              className="fixed top-4 right-4 w-72 shadow-lg z-[60]"
              onClose={() => setErrorMessage(null)}
            >
              {errorMessage}
            </Alert>
          )}
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Confirmar creación"
          message="¿Estás seguro de que deseas guardar?"
          textConfirm="Confirmar"
          confirmVariant="cta"
          onClose={closeModal}
          onConfirm={confirmSubmit}
        />
      </div>
    </div>
  );
};
export default AdoptionForm;