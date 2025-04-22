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


const MapWithNoSSR = dynamic<MapProps>(
  () => import('@/components/ui/map'),
  { ssr: false }
);

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      content: "",
      locationCoordinates: [0, 0],
      contactNumber: "",
      price: 0,
      userId: 1,
      categoryId: 0,
      animalsId: [],
      condition: ProductCondition.NEW
    }
  });

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);



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

  const onSubmit = async (data: ProductFormValues) => {
    console.log("Form submitted:", data);
  }

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition); // Actualiza el estado local
    setValue("locationCoordinates", newPosition); // Actualiza el formulario
  };

  const location = watch("locationCoordinates");
  useEffect(() => {
    console.log("Location changed:", location);
  }, [location]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* <Banners images={}/> */}
      <form onSubmit={handleSubmit(onSubmit)}>

        <p>Tipo de animal</p>
        <label className="block text-sm font-medium">Estado</label>
        <select {...register("condition")} className={`w-full p-2 border rounded mb-4 ${errors.categoryId ? 'border-red-500' : ''}`}>
          {Object.values(ProductCondition).map(cond => (
            <option key={cond} value={cond}>{cond}</option>
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

        <label>Contacto</label>
        <input {...register("contactNumber")} className={`w-full p-2 border rounded mb-4 ${errors.title ? 'border-red-500' : ''}`} />
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
        {/**tiene un condition para moda VER */}
        <div
          className={`h-full relative transition-opacity duration-300`}
        >
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
              onClick={() => {}}
              disabled={false}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="cta"
              className="rounded hover:bg-purple-700"
              onClick={() => { }}
              disabled={false}
            >
              Crear producto
            </Button>
          </div>

        </div>
      </form>
    </div>
  )
}