'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from '@/contexts/auth-context';
import { getBreed } from "@/utils/breed.http";
import { postPets } from "@/utils/pets.http";
import { deleteMedia, postMedia } from "@/utils/media.http";
import Button from '@/components/buttons/button';
import { AlertTriangle, Check, ImagePlus, X } from "lucide-react";
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
import { CreatePostLocation } from "@/components/post/create-post-location";

export default function Page() {

  const { authToken, user, loading: authLoading, } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [breed, setBreed] = useState<Breed[]>([]);
  const [petsStatus, setPetsStatus] = useState<PetStatus[]>([]);
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [precautionMessage, setPrecautionMessage] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const MAX_IMAGES = 5;
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
      const allowedTypes = ["image/png", "image/jpeg", "image/webp", "video/mp4"];
      if (!allowedTypes.includes(file.type)) {
        setPrecautionMessage("Tipo de archivo no permitido. Solo se permiten PNG, JPG, WEBP y MP4.");
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

    if (!authToken) return;
    

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

  const handlePositionChange = useCallback((newPosition: [number, number] | null) => {
    setPosition(newPosition);
    if (newPosition) {
      setValue("addressCoordinates", newPosition, { shouldValidate: true, shouldDirty: true });
    }
  }, [setValue]);
  useEffect(() => {
    if (!authLoading && (!authToken || !user?.id)) {
      // Usuario no logueado, guardar redirección actual
      sessionStorage.setItem("redirectTo", window.location.pathname);
      router.push("/auth/login");
    }
  }, [authLoading, authToken, user?.id, router]);


  const confirmSubmit = async () => {
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
        hasSensitiveImages: validatedData.hasSensitiveImages
      };

      const response = await postPets(params, authToken);
      if (response) {
        setSuccessMessage("Se creó exitosamente")
        setTimeout(() => {
          setLoading(false);
          router.push(`/pets/${response.id}`)
        }, 1500);
      }
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setErrorMessage("Error en la creación de mascota. Intenta nuevamente.");
      setLoading(false);
    } 
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-auto">
      {/* Fondo de imagen + overlay violeta */}
      <div
        className="fixed inset-0 -z-50"
        style={{
          backgroundImage: `url('/andrew-s-ouo1hbizWwo-unsplash.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-lilac-background opacity-60"></div>
      </div>

      {/* Card del formulario */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-16 bg-white rounded-3xl shadow-lg overflow-y-auto my-24">
        <div className="flex items-center gap-2 mb-16">
          <button
            type="button"
            aria-label="Volver"
            onClick={() => router.push('/profile')}
            className="text-text-primary hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Nueva mascota</h1>
        </div>
        <NewBanner medias={selectedImages} />
        <div className="flex gap-2 mt-2 justify-center items-center">
          {selectedImages.map((img, index) => (
            <div key={index} className="relative w-24 h-24 group">
              {img.mimeType && img.mimeType.startsWith('image') ? (
                <Image
                  src={img.url}
                  alt="pet"
                  fill
                  className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ) : img.mimeType && img.mimeType.startsWith('video') ? (
                <video
                  src={img.url}
                  className={`object-cover rounded-md w-full h-full ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  muted
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-md">
                  Archivo no soportado
                </div>
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
            accept="image/png, image/jpeg, image/jpg, image/webp, video/webm, video/mp4"
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
              open={true}
              color="red"
              animate={{
                mount: { y: 0 },
                unmount: { y: -100 },
              }}
              icon={<X className="h-5 w-5" />}
              onClose={() => setErrorMessage("")}
              className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
            >
              <p className="text-sm">{errorMessage}</p>
            </Alert>
          </div>
        )}

        {precautionMessage && (
          <div>
            <Alert
              open={true}
              color="amber"
              animate={{
                mount: { y: 0 },
                unmount: { y: -100 },
              }}
              icon={<AlertTriangle className="h-5 w-5" />}
              onClose={() => setPrecautionMessage("")}
              className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
            >
              <p className="text-sm">{precautionMessage}</p>
            </Alert>
          </div>
        )}

        {successMessage && (
          <div>
            <Alert
              open={true}
              color="green"
              animate={{
                mount: { y: 0 },
                unmount: { y: -100 },
              }}
              icon={<Check className="h-5 w-5" />}
              onClose={() => setSuccessMessage("")}
              className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
            >
              <p className="text-sm">{successMessage}</p>
            </Alert>
          </div>
        )}

        {/* Wrapped Card Component */}
        <section className="p-8">
          <CardContent >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="w-1/3 mb-2">
                <label className="block mb-1">Estado de la mascota</label>
                <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]" {...register("petStatusId", { valueAsNumber: true })}>
                  <option value="0">Seleccione el estado del animal</option>
                  {petsStatus?.map((a, i) => (
                    <option key={i} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {errors.petStatusId && <p className="text-red-500">{errors.petStatusId.message}</p>}
              </div>

              {/* Tipo de Animal */}
              <div className="w-1/3 mb-2">
                <label className="block mb-1">Tipo de Animal</label>
                <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]" {...register("animalId", { valueAsNumber: true })}>
                  <option value="0">Seleccione el tipo de animal</option>
                  {animals?.map((a, i) => (
                    <option key={i} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {errors.animalId && <p className="text-red-500">{errors.animalId.message}</p>}
              </div>

              {/* breedId */}
              <div className="w-1/3 mb-2">
                <label className="block mb-1">Raza</label>
                <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]" {...register("breedId", { valueAsNumber: true })}>
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
                <input className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]" placeholder="Nombre de la mascota" {...register("name")} maxLength={200} />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              </div>

              {/* Descripción */}
              <div className="mb-2">
                <label className="block mb-1">Descripción</label>
                <textarea className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]" placeholder="Descripción" {...register("description")} maxLength={500} />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
              </div>

              {/* Fecha de cumpleanhos */}
              <div className="mb-2">
                <label className="block mb-1">Fecha de cumpleaños</label>
                <input type="date" className="w-1/5 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF]" {...register("birthdate")} />
                {errors.birthdate && <p className="text-red-500">{errors.birthdate.message}</p>}
              </div>

              {/* Género */}
              <div className="flex gap-4 items-center mb-2">
                <div className="flex gap-2">
                  <input type="radio" value="MALE" className="focus:ring-2 focus:ring-[#9747FF]" {...register("gender")} />
                  <label>Macho</label>
                </div>
                <div className="flex gap-2">
                  <input type="radio" value="FEMALE" className="focus:ring-2 focus:ring-[#9747FF]" {...register("gender")} />
                  <label>Hembra</label>
                </div>
              </div>

              {/* isVaccinated */}
              <div className="flex gap-2 items-center mb-2">
                <input type="checkbox" className="focus:ring-2 focus:ring-[#9747FF]" {...register("isVaccinated")} />
                <label>Está desparasitado</label>
                {errors.isVaccinated && <p className="text-red-500">{errors.isVaccinated.message}</p>}
              </div>

              {/* isSterilized */}
              <div className="flex gap-2 items-center mb-2">
                <input type="checkbox" className="focus:ring-2 focus:ring-[#9747FF]" {...register("isSterilized")} />
                <label>Está esterilizado</label>
                {errors.isSterilized && <p className="text-red-500">{errors.isSterilized.message}</p>}
              </div>

              {/* Checkbox contenido sensible */}
              <div className="w-full px-6 border border-red-600 p-3 rounded-xl">
                <label className="flex py-1 items-center gap-2">
                  <input
                    type="checkbox"
                    className="focus:ring-2 focus:ring-[#9747FF]"
                    {...register("hasSensitiveImages")}
                  />
                  <span className="font-medium">Este post contiene imágenes sensibles</span>
                </label>

                <p className="text-sm font-light text-gray-700 mt-1">
                  Al marcar esta casilla, la imagen se ocultará en las pantallas de navegación.<br/>
                  Los usuarios solo podrán verla si abren la publicación.
                </p>

                {errors.hasSensitiveImages && (
                  <p className="text-red-500 mt-1">{errors.hasSensitiveImages.message}</p>
                )}
              </div>

              {/* Mapa */}
              <div
                className={`h-full relative transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}
              >
                <CreatePostLocation
                  position={position}
                  setPosition={handlePositionChange}
                  error={errors.addressCoordinates ? { message: errors.addressCoordinates.message } : undefined}
                />
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
                    disabled={loading}
                    className="rounded hover:bg-purple-700"
                  >
                    {loading ? "Creando..." : "Crear"}
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
    </div>
  );
};