'use client'

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { MapProps } from "@/types/map-props";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from '@/contexts/auth-context';
import { getBreed } from "@/utils/breed.http";
import { deletePet, getPet, postPets, updatePet } from "@/utils/pets.http";
import { deleteMedia, postMedia } from "@/utils/media.http";
import Button from '@/components/buttons/button';
import { ImagePlus } from "lucide-react";
import Banners from "@/components/banners";
import { Maximize } from "lucide-react";
import { getPetStatus } from "@/utils/pet-statuses.http";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetFormValues, petSchema } from "@/validations/pet-schema";
import { ConfirmationModal } from "@/components/form/modal";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@material-tailwind/react";
import { Pet, UpdatePet } from "@/types/pet";
import { useForm } from "react-hook-form";
import { Animal } from "@/types/animal";
import { Breed } from "@/types/breed";
import { PetStatus } from "@/types/pet-status";
import { Media } from "@/types/media";
import { deletePost } from "@/utils/posts.http";

const MapWithNoSSR = dynamic<MapProps>(
  () => import('@/components/ui/map'),
  { ssr: false }
);

export default function Page() {
  const { authToken, user, loading: authLoading } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [breed, setBreed] = useState<Breed[]>([]);
  const [petsStatus, setPetsStatus] = useState<PetStatus[]>([]);
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [precautionMessage, setPrecautionMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { petId } = useParams();
  const router = useRouter();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const MAX_IMAGES = 5; //Tam max de imagenes
  const {
    register,
    handleSubmit: zodHandleSubmit,
    watch,
    getValues,
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

  const [arrayImages, setArrayImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState<PetFormValues>(
    {
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
    });

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleCancel = () => {
    if (!pet) return
    router.push(`/posts/${pet.id}`);
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
    getFromData();
  }, []);

  useEffect(() => {
    const urls = selectedImages.map(image => image.url);
    setArrayImages(urls);
  }, [selectedImages]);

  useEffect(() => {
    const fetchPet = async () => {
      if (authLoading || !authToken || !user?.id || !petId) return;
      setLoading(true);

      try {
        const petData = await getPet(String(petId));
        if (petData) {
          setPet(petData);
          console.log("Pet data:", petData);

          setValue("petStatusId", petData.petStatus.id || 0);
          setValue("animalId", petData.animal.id || 0);
          setValue("breedId", petData.breed.id || 0);
          setValue("name", petData.name || "");
          setValue("birthdate", petData.birthdate ? new Date(petData.birthdate).toISOString().split("T")[0] : "");
          setValue("description", petData.description || "");
          setValue("isVaccinated", petData.isVaccinated || false);
          setValue("isSterilized", petData.isSterilized || false);
          setValue("gender", petData.gender || "OTHER");
          const [lat, lng] = petData.addressCoordinates.split(',').map(Number);
          setPosition([lat, lng]);
          setValue("addressCoordinates", [lat, lng]);

          if (petData.media.length > 0) {
            setSelectedImages(petData.media);
          } else {
            setSelectedImages([]);
          }
        }
      } catch (error) {
        console.error("Error al cargar mascota:", error);
        setErrorMessage("No se pudo cargar la información de la mascota.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [authToken, authLoading, user?.id, petId, animals, breed, petsStatus]);

  const openConfirmationModalEdit = (data: PetFormValues) => {
    setFormData(data); // Guardamos los datos validados
    setIsEditModalOpen(true);
  };

  const openConfirmationModalDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    if (!pet || !authToken) {
      console.error('Falta el ID de la publicación o el token');
      return;
    }

    try {
      await deletePet(String(petId), authToken);

      if (pet.media.length > 0) {
        // Eliminar las imágenes asociadas a la publicación
        const mediaIds = pet.media.map(media => media.id);
        await Promise.all(mediaIds.map(mediaId => deleteMedia(mediaId, authToken)));
      }

      setSuccessMessage('Publicación eliminada con éxito');
      setTimeout(() => router.push('/dashboard'), 1500);

    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      setErrorMessage('Hubo un problema al eliminar la publicación.');
    } finally {
      setLoading(false);
    }
  };

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
      // Verificar el tamaño del archivo (1MB)
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
          const { id } = response;
          setSelectedImages(prev => [...prev, response]);
          setValue("mediaIds", [id]); // Actualiza el formulario con el nuevo ID de la imagen
          setFormData(prev => ({
            ...prev,
            mediaIds: [...(prev.mediaIds || []), id]
          }));
        }
      } catch (error) {
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

      // Si solo tienes una imagen en el formulario, también podrías limpiar el formData y el react-hook-form
      if (updatedImages.length === 0) {
        setValue("mediaIds", []); // Limpiar el campo de imágenes en el formulario
        setFormData(prev => ({ ...prev, mediaIds: [] }));
      }

      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedImages.length) % selectedImages.length);
      setTimeout(() => setSuccessMessage("Imagen eliminada exitosamente."), 1000); // Ocultar mensaje después de 3 segundos

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

  const handleSubmit = async () => {
    setIsEditModalOpen(false);
    if (!authToken) {
      console.error("No hay token de autenticación disponible.");
      return;
    }

    try {
      const formValues = getValues();

      const updatedData: UpdatePet = {
        ...formValues,
        userId: Number(user?.id),
        mediaIds: selectedImages.length > 0 ? selectedImages.map(media => media.id) : [],
        addressCoordinates: position ? `${position[0]},${position[1]}` : "",
        birthdate: formValues.birthdate || undefined,
      };

      const response = await updatePet(String(petId), updatedData, authToken);
      if (response) {
        setSuccessMessage("Se guardó exitosamente");
        setTimeout(() => router.push(`/pets/${response.id}`), 1500);
      }
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setErrorMessage("Error en la edición de la mascota");
    } finally {
      setLoading(false);
    }
  };

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
                <Image
                  src={img.url}
                  alt="Imagen de mascota"
                  fill
                  className="w-full h-full object-cover rounded-lg border"
                />

                {/* Botón de eliminación */}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition"
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
        <div className="w-full max-w-2xl">
          <Card>
            <CardContent className="p-4">
              <form onSubmit={zodHandleSubmit(openConfirmationModalEdit)}>
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

                {/* Nombre de la mascota */}
                <div className="mb-2">
                  <label className="block mb-1">Nombre de la mascota</label>
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
                  <label className="block mb-1">Fecha de nacimiento</label>
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
                <div className="flex gap-2 items-center mb-2">
                  <label>Esta desparasitado</label>
                  <input type="checkbox" {...register("isVaccinated")} />
                  {errors.isVaccinated && <p className="text-red-500">{errors.isVaccinated.message}</p>}
                </div>

                {/* isSterilized */}
                <div className="flex gap-2 items-center mb-2">
                  <label>Esta esterilizado</label>
                  <input type="checkbox" {...register("isSterilized")} />
                  {errors.isSterilized && <p className="text-red-500">{errors.isSterilized.message}</p>}
                </div>


                {/* Mapa */}
                <div
                  className={`h-full relative ${isEditModalOpen || isDeleteModalOpen ? "pointer-events-none opacity-50" : ""}`}
                >
                  <MapWithNoSSR position={position} setPosition={handlePositionChange} />
                </div>
                {errors.addressCoordinates && <p className="text-red-500">{errors.addressCoordinates.message}</p>}

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6 gap-10">
                  <Button
                    type="button"
                    variant="danger"
                    size="md"
                    className="rounded hover:bg-red-700"
                    onClick={openConfirmationModalDelete}
                    disabled={loading}
                  >
                    {isSubmitting ? 'Eliminando...' : 'Eliminar publicación'}
                  </Button>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="tertiary"
                      className="border rounded text-gray-700 hover:bg-gray-100"
                      onClick={handleCancel}
                      disabled={isSubmitting || loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="cta"
                      className="rounded hover:bg-purple-700"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting ? "Editando..." : "Confirmar cambios"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {isEditModalOpen &&
          <ConfirmationModal
            isOpen={isEditModalOpen}
            title="Confirmar cambios"
            message="¿Estás seguro de que deseas guardar los cambios en esta publicación?"
            textConfirm="Confirmar cambios"
            confirmVariant="cta"
            onClose={closeModal}
            onConfirm={handleSubmit}
          />}

        {isDeleteModalOpen &&
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            title="Confirmar eliminación"
            message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
            textConfirm="Eliminar"
            confirmVariant="danger"
            onClose={closeModal}
            onConfirm={handleDelete}
          />}
      </div>
    </div>
  );
};