"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { ProductFormValues, productSchema } from "@/validations/product-schema";
import { ProductCondition } from "@/types/product-condition";
import { getAnimals } from "@/utils/animals.http";
import { getProductCategories } from "@/utils/product-category.http";
import { Animal } from "@/types/animal";
import { ProductCategory } from "@/types/product-category";
import Button from "@/components/buttons/button";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/form/modal";
import { useAuth } from "@/contexts/auth-context";
import { CreateProduct } from "@/types/product";
import { createProduct } from "@/utils/product.http";
import { getFullUser } from "@/utils/user-profile.http";
import { deleteMedia, postMedia } from "@/utils/media.http";
import { Media } from "@/types/media";
import Image from "next/image";
import { Alert } from "@material-tailwind/react";
import { AlertTriangle, Check, ImagePlus, X } from "lucide-react";
import { MultiSelect } from "@/components/multi-select";
import LabeledInput from "@/components/inputs/labeled-input";
import NewBanner from "@/components/newBanner";
import { CreatePostLocation } from "@/components/post/create-post-location";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      content: "",
      locationCoordinates: [0, 0],
      contactNumber: "",
      price: 0,
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
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [precautionMessage, setPrecautionMessage] = useState("");
  const MAX_IMAGES = 5;
  const selectedAnimalsIds = selectedAnimals.map((animal) => animal.id);
  const [validatedData, setValidatedData] = useState<ProductFormValues | null>(null);

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
      sessionStorage.setItem("redirectTo", window.location.pathname);
      router.push("/auth/login");
    } else {
      const fetchUserData = async () => {
        if (!user?.id) return;
        try {
          const response = await getFullUser(user?.id.toString());
          const userPhone = response.phoneNumber;
          if (userPhone) {
            setValue("contactNumber", userPhone);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserData();
    }
  }, [authToken, authLoading, router, user?.id]);


  const handleCancel = useCallback(() => {
    router.push("/marketplace");
  }, [router]);

  const onSubmit = (data: ProductFormValues) => {
    // 'data' aquí ya está validado por Zod
    openConfirmationModal(data); // Pasa los datos validados al modal/handler
  };

  const handlePositionChange = useCallback((newPosition: [number, number]) => {
    setPosition(newPosition);
    setValue("locationCoordinates", newPosition, { shouldValidate: true });
  }, [setValue]);

  const openConfirmationModal = (data: ProductFormValues) => {
    setValidatedData(data);
    setIsModalOpen(true);
  }

  const confirmSubmit = async () => {
    if (!authToken || !user?.id || !validatedData) {
      setPrecautionMessage("Faltan completar datos para crear producto!");
      return;
    }
    setLoading(true);
    const postProduct: CreateProduct = {
      title: validatedData.title,
      content: validatedData.content,
      price: validatedData.price,
      categoryId: validatedData.categoryId,
      condition: validatedData.condition,
      animalIds: selectedAnimalsIds,
      mediaIds: validatedData.mediaIds || [],
      contactNumber: validatedData.contactNumber,
      userId: parseInt(user?.id.toString(), 10),
      locationCoordinates: validatedData.locationCoordinates.join(",") // Usa validatedData
    };
    try {
      const response = await createProduct(postProduct, authToken);
      if (response && response.id) {
        // Redirige AHORA usando el ID de la RESPUESTA
        //router.push(`/product/${response.id}`);
        router.push("/marketplace");
      } else {
        // Si no hay ID en la respuesta
        console.warn("Producto creado, pero no se recibió ID en la respuesta. Redirigiendo al dashboard.");
        router.push("/dashboard"); // O a donde sea apropiado como fallback
      }
      setValidatedData(null);
    } catch (error) {
      console.error("Error creating product:", error);
      setErrorMessage("Hubo un error al crear el producto. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
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

      const allowedTypes = ["image/png", "image/jpeg", "image/webp", "video/mp4"];
      if (!allowedTypes.includes(file.type)) {
        setPrecautionMessage("Tipo de archivo no permitido. Solo se permiten PNG, JPG, WEBP y MP4.");
        return;
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
          const newSelectedImages = [...selectedImages, response];
          setSelectedImages(newSelectedImages);
          // Actualiza react-hook-form con TODOS los IDs actuales
          const updatedMediaIds = newSelectedImages.map(img => img.id);
          setValue("mediaIds", updatedMediaIds, { shouldValidate: true }); // Añadir validación si es necesario
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

      const updatedImages = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(updatedImages);
      // Actualiza react-hook-form con los IDs restantes
      const updatedMediaIds = updatedImages.map(img => img.id);
      setValue("mediaIds", updatedMediaIds, { shouldValidate: true }); // Añadir validación si es necesario

      setSuccessMessage("Imagen eliminada exitosamente.");

    } catch (error) {
      setErrorMessage("No se pudo eliminar la imagen. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };


  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-auto">
      {/* Fondo de imagen + overlay violeta */}
      <div
        className="fixed inset-0 -z-50 bg-cover bg-center"
        style={{
          backgroundImage: `url('/andrew-s-ouo1hbizWwo-unsplash.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-[#9747FF] opacity-60"></div>
      </div>

      {/* Card del formulario */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-16 bg-white rounded-3xl shadow-lg overflow-y-auto my-24">
        <div className="flex items-center gap-2 mb-16">
          <button
            type="button"
            aria-label="Volver"
            onClick={() => router.push('/marketplace')}
            className="text-text-primary hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Nuevo producto</h1>
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

        <NewBanner
          medias={selectedImages}
        />
        <div className="flex gap-2 mt-2 justify-center items-center">
          {selectedImages.map((src, index) => (
            <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
              {src.mimeType && src.mimeType.startsWith('image') ? (
                <Image
                  src={src.url}
                  alt="post"
                  fill
                  className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ) : src.mimeType && src.mimeType.startsWith('video') ? (
                <video
                  src={src.url}
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
                title="Eliminar imagen"
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="w-full mb-2">
            <label className="block mb-1">Título</label>
            <input
              type="text"
              {...register("title")}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF] ${errors.title ? 'border-red-500' : ''}`} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="w-full mb-2">
            <label className="block mb-1">Descripción</label>
            <textarea
              {...register("content")}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF] ${errors.content ? 'border-red-500' : ''}`}
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </div>

          <div className="w-full mb-2">
            <label className="block mb-1">Tipo de animal</label>
            <MultiSelect
              options={animals}
              selected={selectedAnimals}
              onChange={(selected) => {
                setSelectedAnimals(selected);
                setValue("animalsId", selected.map((animal) => animal.id))
              }}
              placeholder="Seleccionar animales"
            />
            {errors.animalsId && <p className="text-red-500 text-sm">{errors.animalsId.message}</p>}
          </div>

          <div className="w-1/3 mb-2">
            <label className="block mb-1">Estado</label>
            <select {...register("condition")} className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF] ${errors.condition ? 'border-red-500' : ''}`}>
              {Object.values(ProductCondition).map(cond => (
                <option key={cond} value={cond}>{capitalize(cond)}</option>
              ))}
            </select>
            {errors.condition && <p className="text-red-500 text-sm">{errors.condition.message}</p>}
          </div>

          <div className="w-1/3 mb-2">
            <label className="block mb-1">Categoría</label>
            <select {...register("categoryId", { valueAsNumber: true })} className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF] ${errors.categoryId ? 'border-red-500' : ''}`}>
              <option value={0}>Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
          </div>

          <div className="w-1/5 mb-2">
            <label className="block mb-1">Contacto</label>
            <input
              {...register("contactNumber")}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#9747FF] ${errors.contactNumber ? 'border-red-500' : ''}`}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Enter") {
                  e.preventDefault();
                }
              }}
            />
            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
          </div>

          <div className="w-1/5 mb-2">
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <LabeledInput
                    label="Precio"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="0"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>          <div className={`h-full relative transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}>
            <CreatePostLocation
              position={position}
              setPosition={(newPosition) => {
                setPosition(newPosition);
                setValue("locationCoordinates", newPosition || [0, 0]);
              }}
              error={errors.locationCoordinates ? { message: errors.locationCoordinates.message } : undefined}
            />
          </div>

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
                {loading ? "Creando..." : "Crear producto"}
              </Button>
            </div>
          </div>
        </form>

        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            title="Confirmación de creación"
            message="¿Está seguro que desea crear este producto?"
            textConfirm="Confirmar"
            confirmVariant="cta"
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmSubmit}
          />
        )}
      </div>
    </div>
  );
}