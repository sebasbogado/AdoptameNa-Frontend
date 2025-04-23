"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ProductFormValues, productSchema } from "@/validations/product-schema";
import { ProductCondition } from "@/types/product-condition";
import { getAnimals } from "@/utils/animals.http";
import { getProductCategories } from "@/utils/product-category.http";
import { Animal } from "@/types/animal";
import { ProductCategory } from "@/types/product-category";
import Banners from "@/components/banners";
import { MapProps } from "@/types/map-props";
import dynamic from "next/dynamic";
import Button from "@/components/buttons/button";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/form/modal";
import { useAuth } from "@/contexts/auth-context";
import { CreateProduct } from "@/types/product";
import { createProduct } from "@/utils/product.http";
import { getFullUser } from "@/utils/user-profile-client";
import { deleteMedia, postMedia } from "@/utils/media.http";
import { Media } from "@/types/media";
import Image from "next/image";
import { Alert } from "@material-tailwind/react";
import { ImagePlus } from "lucide-react";
import { MultiSelect } from "@/components/multi-select";

const MapWithNoSSR = dynamic<MapProps>(
  () => import('@/components/ui/map'),
  { ssr: false }
);

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      content: "",
      locationCoordinates: [0, 0],
      contactNumber: "",
      price: 0,
      userId: 0,
      categoryId: 0,
      animalsId: [],
      condition: ProductCondition.NEW,
      mediaIds: []
    }
  });

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, authToken, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormValues>({
    title: "",
    content: "",
    locationCoordinates: [0, 0],
    contactNumber: "",
    price: 0,
    userId: 0,
    categoryId: 0,
    animalsId: [],
    condition: ProductCondition.NEW,
    mediaIds: []
  });
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [arrayImages, setArrayImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [precautionMessage, setPrecautionMessage] = useState("");
  const MAX_IMAGES = 5;
  const selectedAnimalsIds = selectedAnimals.map((animal) => animal.id);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getProductCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchAnimals = async () => {
      try {
        const data = await getAnimals();
        setAnimals(data.data);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    fetchCategories();
    fetchAnimals();
  }, []);

  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    } else {
      const fetchUserData = async () => {
        if (!user?.id) return;
        try {
          const response = await getFullUser(user?.id.toString());
          let userPhone = response.phoneNumber;
          if (userPhone) {
            setValue("contactNumber", userPhone);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      fetchUserData();
    }
  }, [authToken, authLoading, router, user?.id]);

  const handleCancel = () => {
    router.push("/marketplace");
  }

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition); // Actualiza el estado local
    setValue("locationCoordinates", newPosition); // Actualiza el formulario
  };

  const openConfirmationModal = (data: ProductFormValues) => {
    setFormData(data);
    setIsModalOpen(true);
  }

  const confirmSubmit = async () => {
    if (!authToken || !user?.id || !formData) return;
    setLoading(true);
    const postProduct: CreateProduct = {
      title: formData.title,
      content: formData.content,
      price: formData.price,
      categoryId: formData.categoryId,
      condition: formData.condition,
      animalsId: selectedAnimalsIds,
      mediaIds: formData.mediaIds ? formData.mediaIds : [],
      contactNumber: formData.contactNumber,
      userId: parseInt(user?.id.toString()),
      locationCoordinates: position?.join(",") || ""
    };
    try {
      await createProduct(postProduct, authToken);
      console.log("Product created successfully", postProduct);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      router.push("/dashboard");
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const fileData = new FormData();
      fileData.append("file", file);

      if (!authToken) {
        throw new Error("El token de autenticación es requerido");
      }

      // Verifica la cantidad de imagens que se pueden subir
      if (selectedImages.length >= 5) {
        setPrecautionMessage("Solo puedes subir hasta 5 imagenes.");
        return;
      }
      // Verificar el tamaño del archivo (1MB)
      if (file.size > 5 * (1024 * 1024)) {
        setPrecautionMessage("El archivo es demasiado grande. Tamaño máximo: 5MB.");
        return;
      }

      try {
        setLoading(true);
        const response = await postMedia(fileData, authToken);

        if (response) {
          const { id } = response;
          setSelectedImages(prev => [...prev, response]);
          setValue("mediaIds", [id]);
          setFormData(
            prev => ({
              ...prev,
              mediaIds: [...(prev.mediaIds || []), id]
            }));
        }
      } catch (error: any) {
        if (error.response?.status === 415) {
          setErrorMessage("Formato de imagen no soportado. Usa JPG, JPEG o PNG.");
        } else {
          setErrorMessage("Error al subir la imagen. Intenta nuevamente.");
        }
        setErrorMessage("Error al subir la imagen. Intenta nuevamente.");
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

      setSuccessMessage("Imagen eliminada exitosamente.");
      setTimeout(() => setSuccessMessage(""), 3000); // Ocultar mensaje después de 3 segundos

    } catch (error) {
      setErrorMessage("No se pudo eliminar la imagen. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };


  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  useEffect(() => {
    //para mostrar las imagenes en el banner
    const urls = selectedImages.map(image => image.url);
    setArrayImages(urls || ["./logo.png"]);
  }, [selectedImages]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
      <Banners images={arrayImages} />
      <div className="flex gap-2 mt-2 justify-center items-center">
        {selectedImages.map((src, index) => (
          <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
            <Image
              src={src.url}
              alt="post"
              fill
              className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
            {/* Botón de eliminación */}
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition"
              title="Eliminar imagen"
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
      <form onSubmit={handleSubmit(openConfirmationModal)}>
        <label className="block text-sm font-medium">Título</label>
        <input
          type="text"
          {...register("title")}
          className={`w-full p-2 border rounded mb-4 ${errors.title ? 'border-red-500' : ''}`} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        <label className="block text-sm font-medium">Descripción</label>
        <textarea {...register("content")} className={`w-full p-2 border rounded mb-4 ${errors.content ? 'border-red-500' : ''}`}
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        <label className="block text-sm font-medium">Tipo de animal</label>
        <MultiSelect
          options={animals}
          selected={selectedAnimals}
          onChange={(selected) => {
            setSelectedAnimals(selected);
            setValue("animalsId", selected.map((animal) => animal.id));
          }}
          placeholder="Seleccionar animales"
        />
        {errors.animalsId && <p className="text-red-500 text-sm">{errors.animalsId.message}</p>}


        <label className="block text-sm font-medium">Estado</label>
        <select {...register("condition")} className={`w-full p-2 border rounded mb-4 ${errors.condition ? 'border-red-500' : ''}`}>
          {Object.values(ProductCondition).map(cond => (
            <option key={cond} value={cond}>{capitalize(cond)}</option>
          ))}
        </select>
        {errors.condition && <p className="text-red-500 text-sm">{errors.condition.message}</p>}

        <label className="block text-sm font-medium">Categoría</label>
        <select {...register("categoryId", { valueAsNumber: true })} className={`w-full p-2 border rounded mb-4 ${errors.categoryId ? 'border-red-500' : ''}`}>
          <option value={0}>Seleccionar categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}

        <label className="text-sm font-medium">Contacto</label>
        <input
          {...register("contactNumber")}
          className={`w-full p-2 border rounded mb-4 ${errors.contactNumber ? 'border-red-500' : ''}`}
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Enter") {
              e.preventDefault();
            }
          }
          }
        />
        {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}





        <label className="block text-sm font-medium">Precio</label>
        <input type="number" {...register("price", { valueAsNumber: true })} className={`w-full p-2 border rounded mb-4 ${errors.title ? 'border-red-500' : ''}`} />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

        {/*Mapa */}
        <div className={`h-full relative transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}>
          <MapWithNoSSR position={position} setPosition={handlePositionChange} />
        </div>
        {errors.locationCoordinates && <p className="text-red-500">{errors.locationCoordinates.message}</p>}

        {/*Buttons */}
        <div className="flex justify-end items-center mt-6 gap-10">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="tertiary"
              className="border rounded text-gray-700 hover:bg-gray-100"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="cta"
              className="rounded hover:bg-purple-700"
              disabled={loading}
            >
              Crear producto
            </Button>
          </div>

        </div>
      </form>
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Confirmacion de creación"
          message="¿Esta seguro que desea crear este producto?"
          textConfirm="Confirmar"
          confirmVariant="cta"
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmSubmit}
        />)
      }
    </div>
  )
}