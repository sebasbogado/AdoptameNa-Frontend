import React from 'react';
import { Button } from "@material-tailwind/react";
import { ProductCategory } from '@/types/product-category';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productCategorySchema, ProductCategoryInput } from '@/validations/product-category-schema';

interface FormProductCategoryProps {
    onCreate: (productCategory: ProductCategory) => void;
    onDelete: (event: React.FormEvent) => void;
    productCategoryData: ProductCategory;
}

export default function FormProductCategory({ onCreate, onDelete, productCategoryData }: FormProductCategoryProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ProductCategoryInput>({
        resolver: zodResolver(productCategorySchema),
        defaultValues: productCategoryData
    });

    const onSubmit = (data: ProductCategoryInput) => {
        onCreate(data as ProductCategory);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold">Nombre</label>
                <input
                    type="text"
                    id="name"
                    className="border rounded-md p-2"
                    {...register("name")}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
            </div>

            <div className="flex justify-between mt-4">
                <Button
                    type="submit"
                    color="green"
                    className="px-4 py-2"
                >
                    {productCategoryData.id ? "Actualizar" : "Crear"}
                </Button>

                {productCategoryData.id > 0 && (
                    <Button
                        type="button"
                        color="red"
                        className="px-4 py-2"
                        onClick={onDelete}
                    >
                        Eliminar
                    </Button>
                )}
            </div>
        </form>
    );
}