'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { MapProps } from "@/types/map-props";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from '@/contexts/auth-context';
import { getBreed } from "@/utils/breed.http";
import { postPets } from "@/utils/pets.http";
import { deleteMedia, postMedia } from "@/utils/media.http";
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
import { Animal } from "@/types/animal";
import { Breed } from "@/types/breed";
import { PetStatus } from "@/types/pet-status";
import { Media } from "@/types/media";
import { CreatePet } from "@/types/pet";
import NewBanner from "@/components/newBanner";


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
  const [loading, setLoading] = useState<boolean>(true);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const MAX_IMAGES = 5; //Tam max de imagenes
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
      addressCoordinates: [0, 0],
      isVaccinated: false,
      isSterilized: false,
      gender: "MALE",
      //edad: 0,
      //peso: 0,
    },
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [validatedData, setValidatedData] = useState<PetFormValues | null>(null);

  const onSubmit = (data: PetFormValues) => {
    // 'data' aquí ya está validado por Zod
    openConfirmationModal(data); // Pasa los datos validados al modal/handler
  };

  const openConfirmationModal = (data: PetFormValues) => {
    setValidatedData(data); // Guardamos los datos validados
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [animalsData, breedData, petStatusData] = await Promise.all([
        getAnimals(),
        getBreed(),
        getPetStatus()
      ]);

      setAnimals(animalsData.data);
      setBreed(breedData.data);
      setPetsStatus(petStatusData.data);
    } catch (error: any) {
      setErrorMessage("Error en la página. Intentelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // Verifica la cantidad de imagens que se pueden subir
      if (selectedImages.length >= 5) {
        setPrecautionMessage(`Solo puedes subir hasta 5 imágenes.`);
        return;
      }
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setPrecautionMessage("Tipo de archivo no permitido. Solo se permiten PNG, JPG y WEBP.");
        return;
      }
      // Verificar el tamaño del archivo
      if (file.size > 5 * 1024 * 1024) {
        setPrecautionMessage("El archivo es demasiado grande. Tamaño máximo: 5MB.");
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
          const newSelectedImages = [...selectedImages, response];
          setSelectedImages(newSelectedImages);
          // Actualiza react-hook-form con TODOS los IDs actuales
          const updatedMediaIds = newSelectedImages.map(img => img.id);
          setValue("mediaIds", updatedMediaIds, { shouldValidate: true });
        }
      } catch (error) {
        setErrorMessage("Error al subir la imagen. Intenta nuevamente.");
        console.error("Error al subir la imagen", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = selectedImages[index];

    if (!authToken) {
      console.log("El token de autenticación es requerido");
      return;
    }

    try {
      setLoading(true);

      // Llamar a la API para eliminar la imagen
      if (imageToRemove.id) {
        await deleteMedia(imageToRemove.id, authToken);
      }

      // Eliminar del estado local
      const updatedImages = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(updatedImages);

      const updatedMediaIds = updatedImages.map(img => img.id);
      setValue("mediaIds", updatedMediaIds, { shouldValidate: true });
      setSuccessMessage("Imagen eliminada exitosamente.")

    } catch (error) {
      console.error("Error al eliminar la imagen", error);
      setErrorMessage("No se pudo eliminar la imagen. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
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
    setValue("addressCoordinates", newPosition); // Actualiza el formulario
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
    setIsModalOpen(false); // Cierra el modal de confirmación
    setLoading(true);

    if (isSubmitting) return; // 🔒 Evita múltiples clics

    if (!authToken || !validatedData) {
      console.error("No hay token de autenticación disponible.");
      return;
    }

    try {
      const params: CreatePet = {
        userId: Number(user?.id),
        name: validatedData.name,
        description: validatedData.description,
        birthdate: validatedData.birthdate,
        gender: validatedData.gender,
        isSterilized: validatedData.isSterilized,
        isVaccinated: validatedData.isVaccinated,
        animalId: validatedData.animalId,
        breedId: validatedData.breedId,
        petStatusId: validatedData.petStatusId,
        addressCoordinates: validatedData.addressCoordinates?.join(",") || "",
        mediaIds: validatedData.mediaIds || [],
      };

      const response = await postPets(params, authToken);
      if (response) {
        setSuccessMessage("Se creó exitosamente")
        setTimeout(() => router.push(`/pets/${response.id}`), 1500);
      }
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setErrorMessage("Error en la creación de mascota. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="w-2/4 mx-auto p-6 bg-white rounded-lg">
      <div className={`relative ${isFullscreen ? "w-screen h-screen" : ""}`} ref={bannerRef}>
        <NewBanner
          medias={selectedImages}
        />
        <button
          onClick={toggleFullScreen}
          className="absolute top-2 right-24 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
        >
          <Maximize size={20} />
        </button>
      </div>
      <div className="flex gap-2 mt-2 justify-center items-center">
        {selectedImages.map((img, index) => (
          <div key={index} className="relative w-24 h-24 group">
            {img.mimeType && img.mimeType.startsWith("video/") ? (
              <video
                src={img.url}
                className={`object-cover rounded-md w-full h-full ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
                muted
                playsInline
              />
            ) : (
              <Image
                src={img.url}
                alt="pet"
                fill
                className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            )}
            {/* Botón de eliminación */}
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-700/60 text-white/80 text-xs hover:bg-red-600 hover:text-white transition-colors duration-150"
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

      {errorMessage && (
        <div>
          <Alert
            color="red"
            className="fixed top-4 right-4 w-75 shadow-lg z-[60]"
            onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        </div>
      )}

      {precautionMessage && (
        <div>
          <Alert
            color="orange"
            className="fixed top-4 right-4 w-75 shadow-lg z-[60]"
            onClose={() => setPrecautionMessage("")}>
            {precautionMessage}
          </Alert>
        </div>
      )}

      {successMessage && (
        <div>
          <Alert
            color="green"
            onClose={() => setSuccessMessage("")}
            className="fixed top-4 right-4 w-75 shadow-lg z-[60]">
            {successMessage}
          </Alert>
        </div>
      )}

      {/* Wrapped Card Component */}
      <section className="p-8">
        <CardContent >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="w-fit mb-2">
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
                <div className="w-fit mb-2">
                  <label className="block mb-1">Tipo de Animal</label>
                  <select className="w-full p-2 border rounded" {...register("animalId", { valueAsNumber: true })}>
                    <option value="0">Seleccione el tipo de animal</option>
                    {animals?.map((a, i) => (
                      <option key={i} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {errors.animalId && <p className="text-red-500">{errors.animalId.message}</p>}
                </div>

            {/* breedId */}
            <div className="w-fit mb-2">
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
              <label className="block mb-1">Nombre</label>
              <input className="w-2/4 p-2 border rounded" placeholder="Nombre de la mascota" {...register("name")} maxLength={200} />
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
              <input type="date" className="w-1/3 p-2 border rounded" {...register("birthdate")} />
              {errors.birthdate && <p className="text-red-500">{errors.birthdate.message}</p>}
            </div>

            {/* Género */}
            <div className="flex gap-4 items-center mb-2">
              <div className="flex gap-2">
              <input type="radio" value="MALE" {...register("gender")} />
              <label>Macho</label>
              </div>
              <div className="flex gap-2">
              <input type="radio" value="FEMALE" {...register("gender")} />
              <label>Hembra</label>
              </div>
            </div>

                {/* isVaccinated */}
                <div className="flex gap-2 items-center mb-2">
                <input type="checkbox" {...register("isVaccinated")} />
                  <label>Está desparasitado</label>
                  {errors.isVaccinated && <p className="text-red-500">{errors.isVaccinated.message}</p>}
                </div>

                {/* isSterilized */}
                <div className="flex gap-2 items-center mb-2">
                  <input type="checkbox" {...register("isSterilized")} />
                  <label>Está esterilizado</label>
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
      </section>
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
  );
};