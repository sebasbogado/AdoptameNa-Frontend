import React from 'react';
import { Input } from '@/components/ui/input';
import Button from '@/components/buttons/button';
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
        formState: { errors, isSubmitting }
    } = useForm<ProductCategoryInput>({
        resolver: zodResolver(productCategorySchema),
        defaultValues: {
            id: productCategoryData.id || undefined,
            name: productCategoryData.name,
        }
    });

    const onSubmit = async (data: ProductCategoryInput) => {
        onCreate(data as ProductCategory);
    };

    return (
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
                <label className="block mb-1">Nombre</label>
                <Input
                    placeholder="Ejemplo: Juguetes"
                    className={`w-full border p-2 rounded ${errors.name ? 'border-red-500 focus:outline-none' : 'border-gray-300'}`}
                    {...register("name")}
                    maxLength={50}
                />
                {errors.name && (
                    <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
                )}
            </div>

            <div className="flex justify-end items-center mt-6 w-full">
                <div className="flex gap-4">
                    <Button variant={productCategoryData.id === 0 ? "secondary" : "danger"} type="button" onClick={onDelete}>
                        {productCategoryData.id === 0 ? "Cancelar" : "Eliminar"}
                    </Button>

                    <Button variant='primary' disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </div>
        </form>
    );
}