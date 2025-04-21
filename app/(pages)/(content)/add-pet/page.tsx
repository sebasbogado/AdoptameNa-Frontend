'use client'

import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { MapProps } from "@/types/map-props";
import { useAppContext } from "@/contexts/app-context";
//import Axios from "@/utils/axiosInstace";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from '@/contexts/auth-context';
import { getBreed } from "@/utils/breed.http";
import { postPets } from "@/utils/pets.http";
import { postMedia } from "@/utils/media.http";
import Button from '@/components/buttons/button';
import { ImagePlus } from "lucide-react";
import Banners from "@/components/banners";
import { Maximize, Minimize } from "lucide-react";
import { getPetStatus } from "@/utils/pet-statuses.http";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetFormValues, petSchema } from "@/validations/pet-schema";
import { ConfirmationModal } from "@/components/form/modal";
import { useRouter } from "next/navigation";
import { Alert } from "@material-tailwind/react";
import { set } from "zod";
import { Animal } from "@/types/animal";
import { Breed } from "@/types/breed";
import { PetStatus } from "@/types/pet-status";
import { Media } from "@/types/media";


const MapWithNoSSR = dynamic<MapProps>(
  () => import('@/components/ui/map'),
  { ssr: false }
);

export default function Page() {

  const { authToken, user, loading: authLoading } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [breed, setBreed] = useState<Breed[]>([]);
  const [petsStatus, setPetsStatus] = useState<PetStatus[]>([]);
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [precautionMessage, setPrecautionMessage] = useState<string | null>(null);
  const router = useRouter();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const MAX_IMAGES = 1; //Tam max de imagenes
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PetFormValues>({
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
  const [formData, setFormData] = useState<PetFormValues>({
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
  });

  const openConfirmationModal = (data: PetFormValues) => {
    setFormData(data); // Guardamos los datos validados
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    router.push("/profile");
  };

  const getFromData = async () => {

    const respAnimals = await getAnimals({ size: 100, page: 0 })
    if (respAnimals) {
      setAnimals(respAnimals.data);
    }
    const respBreed = await getBreed({ size: 100, page: 0 })
    if (respBreed) {
      setBreed(respBreed.data);
    }
    const respPetStatus = await getPetStatus({ size: 100, page: 0 })
    if (respPetStatus) {
      setPetsStatus(respPetStatus.data);
    }
  }

  useEffect(() => {
    getFromData()
  }, [])

  // useEffect(() => {
  //   if (petsStatus?.length && animals?.length && breed?.length) {
  //     setValue("petStatusId", petsStatus[0].id);
  //     setValue("animalId", animals[0].id);
  //     setValue(
  //       "breedId",
  //       breed.find(b => b.animalId === animals[0].id)?.id || breed[0].id
  //     );
  //   }
  // }, [petsStatus, animals, breed, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // Verifica la cantidad de imagens que se pueden subir
      if (selectedImages.length >= 5) {
        setErrorMessage(`Solo puedes subir hasta 5 imágenes.`);
        return;
      }
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Tipo de archivo no permitido. Solo se permiten PNG, JPG y WEBP.");
        return;
      }
      // Verificar el tamaño del archivo
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("El archivo es demasiado grande. Tamaño máximo: 5MB.");
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
          const { id, url } = response;
          setValue
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

  const confirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //    if (isSubmitting) return; // 🔒 Evita múltiples clics
    if (!authToken) {
      console.error("No hay token de autenticación disponible.");
      return;
    }

    try {
      console.log(formData);

      const params = {
        ...formData, // Copia todas las propiedades de formData
        urlPhoto: selectedImages[0]?.url_API,
        userId: Number(user?.id),
        addressCoordinates: `${position?.[0]}, ${position?.[1]}`
      };

      const response = await postPets(params, authToken);
      if (response) {
        console.log("Guardado ", response);
        setSuccessMessage("Se creó exitosamente")
        setTimeout(() => router.push(`/pets/${response.id}`), 3500);
      }
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setErrorMessage("Error en la creación de pets")
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
              accept="image/png, image/jpeg, image/webp"
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
              <form onSubmit={handleSubmit(openConfirmationModal)}>
                <div className="w-full mb-2">
                  <label className="block mb-1">Estado de la mascota</label>
                  <select className="w-full p-2 border rounded" {...register("petStatusId", { valueAsNumber: true })}>
                    <option value="0">Seleccione el estado del animal</option>
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
                    <option value="0">Seleccion el tipo de animal</option>
                    {animals?.map((a, i) => (
                      <option key={i} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {errors.animalId && <p className="text-red-500">{errors.animalId.message}</p>}
                </div>

                {/* breedId */}
                <div className="w-full mb-2f">
                  <label className="block mb-1">Raza</label>
                  <select className="w-full p-2 border rounded" {...register("breedId", { valueAsNumber: true })}>
                    <option value="0">Seleccione la raza</option>
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

                {/* Fecha de cumpleanhos */}
                <div className="mb-2">
                  <label className="block mb-1">Fecha de cumpleaños</label>
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
                      {isSubmitting ? "Creando..." : "Crear"}
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
          message="¿Estás seguro de que deseas crear esta mascota?"
          textConfirm="Confirmar"
          confirmVariant="cta"
          onClose={closeModal}
          onConfirm={confirmSubmit}
        />
      </div>
    </div>
  );
};