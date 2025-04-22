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
import { CreateProduct, Product } from "@/types/product";
import { createProduct } from "@/utils/product.http";
import { getUserProfile } from "@/utils/user-profile-client";
import { Media } from "@/types/media";
import Image from "next/image";


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
      contactNumber: "", //traer del perfil y si no tiene, dejar vacio
      price: 0,
      userId: 0,
      categoryId: 0,
      animalsId: [1], //hardcodeado por ahora
      condition: ProductCondition.NEW,
      mediaIds: []
    }
  });

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, authToken, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormValues | null>(null);
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);
  const [arrayImages, setArrayImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);




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
      router.push("/login");
    }
  }, [authToken, authLoading, router])

  const handleCancel = () => {
    router.push("/dashboard");
  }

  const onSubmit = async (data: ProductFormValues) => {
    console.log("Form submitted:", data);
  }

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition); // Actualiza el estado local
    setValue("locationCoordinates", newPosition); // Actualiza el formulario
  };

  const openConfirmationModal = (data: ProductFormValues) => {
    console.log("Form data before confirmation:", data);
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
      animalsId: formData.animalsId,
      mediaIds: formData.mediaIds ? formData.mediaIds : [],
      contactNumber: formData.contactNumber,
      userId: parseInt(user?.id as string, 10),
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
      // if (selectedImages.length >= 5) {
      //   setPrecautionMessage("Solo puedes subir hasta 5 imagenes.");
      //   return;
      // }
      // Verificar el tamaño del archivo (1MB)
      // if (file.size > 5 * (1024 * 1024)) {
      //   setPrecautionMessage("El archivo es demasiado grande. Tamaño máximo: 5MB.");
      //   return;
      // }

      try {
        setLoading(true);
        const response = await postMedia(fileData, authToken);

        if (response) {
          const { id } = response;
          setSelectedImages(prev => [...prev, response]);
          setValue("mediaIds", [id]);
          // setFormData(
          //   prev => ({
          //   ...prev,
          //   mediaIds: [...(prev.mediaIds || []), id]
          // }));
        }
      } catch (error) {
        // setErrorMessage("Error al subir la imagen. Intenta nuevamente.");
        console.error("Error al subir la imagen", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log("Errors:", errors);
  }, [errors]);

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
      <Banners images={arrayImages} />
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
            // onClick={() => handleRemoveImage(index)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition"
            title="Eliminar imagen"
          >
            ✕
          </button>
        </div>
      ))}


      <form onSubmit={handleSubmit(openConfirmationModal)}>

        <p>Tipo de animal</p>
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

        <label >Contacto</label>
        <input
          {...register("contactNumber")}
          className={`w-full p-2 border rounded mb-4 ${errors.title ? 'border-red-500' : ''}`}
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Enter") {
              e.preventDefault();
            }
          }
          }
        />
        {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}


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

        <label className="block text-sm font-medium">Precio</label>
        <input type="number" {...register("price", { valueAsNumber: true })} className={`w-full p-2 border rounded mb-4 ${errors.title ? 'border-red-500' : ''}`} />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}


        {/* <label>Tipo de Animal</label>
        <select multiple {...register("animalsId")} className="form-multiselect w-full mb-2">
          {animals.map(animal => (
            <option key={animal.id} value={animal.id}>{animal.name}</option>
          ))}
        </select>
        {errors.animalsId && <p className="text-red-500 text-sm">{errors.animalsId.message}</p>} */}


        {/*Mapa */}
        <div className={`h-full relative transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}>
          <MapWithNoSSR position={position} setPosition={handlePositionChange} />
        </div>
        {errors.locationCoordinates && <p className="text-red-500">{errors.locationCoordinates.message}</p>}

        {/*Buttons */}
        <div className="flex justify-end items-center mt-6 gap-10">
          {/*VER: boton de eliminar publicacion, no se como no aparece al  crear*/}
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