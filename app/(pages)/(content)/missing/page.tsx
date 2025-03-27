'use client'

import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from 'next/dynamic';
import Footer from "@/components/footer";
import Image from "next/image";
import { MapProps } from "@/types/map-props";
import { useAppContext } from "@/contexts/appContext";
//import Axios from "@/utils/axiosInstace";
import { getAnimals } from "@/utils/animals.http";
import { useAuth } from '@/contexts/authContext';
import { getBreed } from "@/utils/breed.http";
import { postPets } from "@/utils/pets.http";
import { postMedia } from "@/utils/media.http";
import Button from '@/components/buttons/button';
import { ImagePlus } from "lucide-react";
import Banners from "@/components/banners";
import { Maximize, Minimize } from "lucide-react";
import { getPetStatuses } from "@/utils/pet-statuses.http";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetFormValues, petSchema } from "@/validations/pet-schema";
import { ConfirmationModal } from "@/components/form/modal";
import { useRouter } from "next/navigation";
import { Alert } from "@material-tailwind/react";


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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: {
      estado: 0,
      tipoAnimal: 0,
      raza: 0,
      titulo: "",
      nacimiento: "",
      descripcion: "",
      vacunado: false,
      esterilizado: false,
      genero: "MALE",
      edad: 0,
      peso: 0,
    },
  });


  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<PetFormValues>({
    estado: 0,
    tipoAnimal: 0,
    raza: 0,
    titulo: "",
    nacimiento: "",
    descripcion: "",
    vacunado: false,
    esterilizado: false,
    genero: "MALE",
    edad: 0,
    peso: 0
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
      console.log("Resultado Animals", respAnimals)
      setAnimals(respAnimals)
    }
    const respBreed = await getBreed({ size: 100, page: 0 })
    if (respBreed) {
      console.log("Resultado Breed", respBreed)
      setBreed(respBreed)
    }
    const respPetStatus = await getPetStatuses({ size: 100, page: 0 })
    if (respPetStatus) {
      console.log("Resultado PetStatus", respPetStatus)
      setPetsStatus(respPetStatus)
    }
    const respImageSelected = await getPetStatuses({ size: 100, page: 0 })
    if (respImageSelected) {
      console.log("Resultado PetStatus", respImageSelected)
      setPetsStatus(respImageSelected)
    }
  }

  useEffect(() => {
    getFromData()
  }, [])

  useEffect(() => {
    if (petsStatus && petsStatus.length > 0 &&
      animals && animals.length > 0 &&
      breed && breed.length > 0) {
      setFormData(prev => ({
        ...prev,
        estado: petsStatus[0].id, // Primer estado disponible
        tipoAnimal: animals[0].id, // Primer tipo de animal disponible
        raza: breed.find(b => b.animalId === animals[0].id)?.id || breed[0].id // Primera raza correspondiente al animal
      }));
    }
  }, [petsStatus, animals, breed]); // Se ejecuta cuando los datos están disponibles

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      console.log("imagen: ", file);

      if (!authToken) {
        throw new Error("El token de autenticación es requerido");
      }

      try {
        const response = await postMedia(formData, authToken);
        console.log("Respuesta de postMedia:", response);
        if (response) {
          setSelectedImages([...selectedImages, { file, url_API: response.url, url: URL.createObjectURL(file) }]);
        }
      } catch (error) {
        console.error("Error al subir la imagen", error);
      }
    }
  };


  /*const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  };*/

  const bannerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    setPosition(newPosition); // Actualiza el estado local
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

  const confirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // 🔒 Evita múltiples clics

    if (!authToken) {
      console.error("No hay token de autenticación disponible.");
      return;
    }


    try {
      console.log(formData);
      const params = {
        name: formData.titulo,
        isVaccinated: formData.vacunado,
        description: formData.descripcion,
        birthdate: formData.nacimiento,
        gender: formData.genero,
        urlPhoto: selectedImages[0]?.url_API,
        isSterilized: formData.esterilizado,
        userId: Number(user?.id),
        animalId: Number(formData.tipoAnimal),
        breedId: Number(formData.raza),
        petStatusId: Number(formData.estado),
        addressCoordinates: `${position?.[0]}, ${position?.[1]}`
      };

      const response = await postPets(params, authToken);
      if (response) {
        console.log("Guardado ", response);
        setSuccessMessage("Se creó exitosamente")
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

            {selectedImages.map((src, index) => (
              <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
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

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden object-cover rounded-md transition-all duration-200 hover:scale-110"
              id="fileInput"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer flex items-center justify-center w-24 h-24 rounded-lg border-2 border-blue-500 hover:border-blue-700 transition bg-white"
            >
              <ImagePlus size={20} className="text-blue-500" />
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
                  <select className="w-full p-2 border rounded" {...register("estado", { valueAsNumber: true })}>
                    {petsStatus?.map((a, i) => (
                      <option key={i} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {errors.estado && <p className="text-red-500">{errors.estado.message}</p>}
                </div>

                {/* Tipo de Animal */}
                <div className="w-full mb-2">
                  <label className="block mb-1">Tipo de Animal</label>
                  <select className="w-full p-2 border rounded" {...register("tipoAnimal", { valueAsNumber: true })}>
                    {animals?.map((a, i) => (
                      <option key={i} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {errors.tipoAnimal && <p className="text-red-500">{errors.tipoAnimal.message}</p>}
                </div>

                {/* Raza */}
                <div className="w-full mb-2">
                  <label className="block mb-1">Raza</label>
                  <select className="w-full p-2 border rounded" {...register("raza", { valueAsNumber: true })}>
                    {breed?.filter((b) => b.animalId === watch("tipoAnimal")) // Filtra por tipo de animal
                      .map((b, i) => (
                        <option key={i} value={b.id}>{b.name}</option>
                      ))}
                  </select>
                  {errors.raza && <p className="text-red-500">{errors.raza.message}</p>}
                </div>

                {/* Título */}
                <div className="mb-2">
                  <label className="block mb-1">Título</label>
                  <input className="w-full p-2 border rounded" placeholder="Título" {...register("titulo")} maxLength={200} />
                  {errors.titulo && <p className="text-red-500">{errors.titulo.message}</p>}
                </div>

                {/* Descripción */}
                <div className="mb-2">
                  <label className="block mb-1">Descripción</label>
                  <textarea className="w-full p-2 border rounded" placeholder="Descripción" {...register("descripcion")} maxLength={500} />
                  {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
                </div>

                {/* Fecha de nacimiento */}
                <div className="mb-2">
                  <label className="block mb-1">Fecha de nacimiento</label>
                  <input type="date" className="w-full p-2 border rounded" {...register("nacimiento")} />
                  {errors.nacimiento && <p className="text-red-500">{errors.nacimiento.message}</p>}
                </div>

                {/* Género */}
                <div className="flex gap-2 items-center mb-2">
                  <label>Macho</label>
                  <input type="radio" value="MALE" {...register("genero")} />
                  <label>Hembra</label>
                  <input type="radio" value="FEMALE" {...register("genero")} />
                </div>

                {/* Vacunado */}
                <label className="block mb-1">¿Está vacunado?</label>
                <div className="flex gap-2 items-center mb-2">
                  <label>Sí</label>
                  <input type="checkbox" {...register("vacunado")} />
                  {errors.vacunado && <p className="text-red-500">{errors.vacunado.message}</p>}
                </div>

                {/* Esterilizado */}
                <label className="block mb-1">¿Está esterilizado?</label>
                <div className="flex gap-2 items-center mb-2">
                  <label>Sí</label>
                  <input type="checkbox" {...register("esterilizado")} />
                  {errors.esterilizado && <p className="text-red-500">{errors.esterilizado.message}</p>}
                </div>

                {/* Edad */}
                <div className="mb-2">
                  <label className="block mb-1">Edad</label>
                  <input type="number" className="w-full p-2 border rounded" {...register("edad", { valueAsNumber: true })} />
                  {errors.edad && <p className="text-red-500">{errors.edad.message}</p>}
                </div>

                {/* Peso */}
                <div className="mb-2">
                  <label className="block mb-1">Peso</label>
                  <input type="number" className="w-full p-2 border rounded" {...register("peso", { valueAsNumber: true })} />
                  {errors.peso && <p className="text-red-500">{errors.peso.message}</p>}
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
export default AdoptionForm;