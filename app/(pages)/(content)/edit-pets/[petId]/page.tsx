'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CreatePostLocation } from "@/components/post/create-post-location";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from '@/contexts/auth-context';
import { getBreed } from "@/utils/breed.http";
import { deletePet, getPet, updatePet } from "@/utils/pets.http";
import { deleteMedia, postMedia } from "@/utils/media.http";
import Button from '@/components/buttons/button';
import { ImagePlus, Check, X, AlertTriangle } from "lucide-react";
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
import NewBanner from "@/components/newBanner";

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
      hasSensitiveImages: false
    });

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleCancel = () => {
    if (!pet) return
    router.push(`/pets/${pet.id}`);
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
          setValue("petStatusId", petData.petStatus.id || 0);
          setValue("animalId", petData.animal.id || 0);
          setValue("breedId", petData.breed.id || 0);
          setValue("name", petData.name || "");
          setValue("birthdate", petData.birthdate ? new Date(petData.birthdate).toISOString().split("T")[0] : "");
          setValue("description", petData.description || "");
          setValue("isVaccinated", petData.isVaccinated || false);
          setValue("isSterilized", petData.isSterilized || false);
          setValue("gender", petData.gender || "OTHER");
          setValue("hasSensitiveImages", petData.hasSensitiveImages)
          // --- Poblar el Formulario ---
          let initialCoords: [number, number] = [0, 0];
          if (petData.addressCoordinates) {
            const coords = petData.addressCoordinates.split(',').map(Number);
            if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
              initialCoords = [coords[0], coords[1]];
            }
          }
          setPosition(initialCoords);
          setValue("addressCoordinates", initialCoords);

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

      setSuccessMessage('Publicación eliminada con éxito');
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard')
      }, 1500);

    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      setErrorMessage('Hubo un problema al eliminar la publicación.');
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
      const allowedTypes = ["image/png", "image/jpeg", "image/webp", "video/mp4"];
      if (!allowedTypes.includes(file.type)) {
        setPrecautionMessage("Tipo de archivo no permitido. Solo se permiten PNG, JPG, WEBP y MP4.");
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

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition); // Actualiza el petStatusId local
    setValue("addressCoordinates", newPosition); // Actualiza el formulario
  };

  const handleSubmit = async () => {
    setIsEditModalOpen(false);
    if (!authToken) {
      console.error("No hay token de autenticación disponible.");
      return;
    }

    try {
      const formValues = getValues();
      setLoading(true);
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
        setTimeout(() => {
          setLoading(false);
          router.push(`/pets/${response.id}`)
        }, 1500);
      }
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setErrorMessage("Error en la edición de la mascota");
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
          backgroundPosition: 'center'
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
            onClick={() => router.back()}
            className="text-text-primary hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Editar mascota</h1>
        </div>
        <div className="p-4 w-full max-w-5xl rounded-lg">
          <div className="relative" ref={bannerRef}>
            <NewBanner
              medias={selectedImages}
            />
          </div>
          <div className="flex gap-2 mt-2 justify-center items-center">
            {selectedImages.map((img, index) => (
              <div key={index} className="relative w-24 h-24 group">
                {img.mimeType && img.mimeType.startsWith('image') ? (
                  <Image
                    src={img.url}
                    alt="Imagen de mascota"
                    fill
                    className="w-full h-full object-cover rounded-lg border"
                  />
                ) : img.mimeType && img.mimeType.startsWith('video') ? (
                  <video
                    src={img.url}
                    className="w-full h-full object-cover rounded-lg border"
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
        </div>
        {errorMessage && (
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
        )}

        {precautionMessage && (
          <Alert
            open={true}
            color="orange"
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
        )}

        {successMessage && (
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
        )}

        {/* Wrapped Card Component */}
        <section className="p-8">
          <div>
            <form onSubmit={zodHandleSubmit(openConfirmationModalEdit)} className="flex flex-col gap-6">
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
                  {breed?.filter((b) => b.animalId === watch("animalId"))
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

              {/* Fecha de cumpleaños */}
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
                  Al marcar esta casilla, la imagen se ocultará en las pantallas de navegación.<br />
                  Los usuarios solo podrán verla si abren la publicación.
                </p>

                {errors.hasSensitiveImages && (
                  <p className="text-red-500 mt-1">{errors.hasSensitiveImages.message}</p>
                )}
              </div>

              {/* Mapa */}
              <div
                className={`transition-opacity duration-300 ${isEditModalOpen || isDeleteModalOpen ? "pointer-events-none opacity-50" : ""}`}
              >
                <CreatePostLocation
                  position={position}
                  setPosition={(pos) => pos !== null && handlePositionChange(pos)}
                  error={errors.addressCoordinates}
                />
              </div>



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
                    disabled={loading}
                  >
                    {loading ? "Editando..." : "Confirmar cambios"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>

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