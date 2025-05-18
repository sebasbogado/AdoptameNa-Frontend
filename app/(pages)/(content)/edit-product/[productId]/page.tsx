"use client"

import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/buttons/button";
import { ConfirmationModal } from "@/components/form/modal";
import NotFound from "@/app/not-found";
import { MapProps } from "@/types/map-props";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@material-tailwind/react";
import Image from "next/image";
import { deleteMedia, postMedia } from "@/utils/media.http";
import { ImagePlus } from "lucide-react";
import { Media } from "@/types/media";
import { MultiSelect } from "@/components/multi-select";
import NewBanner from "@/components/newBanner";
import { ProductFormValues, productSchema } from "@/validations/product-schema";
import { ProductCondition } from "@/types/product-condition";
import { deleteProduct, getProduct, updateProduct } from "@/utils/product.http";
import { ProductCategory } from "@/types/product-category";
import { Animal } from "@/types/animal";
import { getProductCategories } from "@/utils/product-category.http";
import { getAnimals } from "@/utils/animals.http";
import { Product, UpdateProduct } from "@/types/product";
import LabeledInput from "@/components/inputs/labeled-input";

const MapWithNoSSR = dynamic<MapProps>(
    () => import('@/components/ui/map'),
    { ssr: false }
);

export default function Page() {
    const { productId } = useParams();
    const { authToken, user, loading: authLoading } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [precautionMessage, setPrecautionMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        reset,
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

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [selectedImages, setSelectedImages] = useState<Media[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const MAX_IMAGES = 5; //Tam max de imagenes
    const [validatedData, setValidatedData] = useState<ProductFormValues | null>(null);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);
    const selectedAnimalsIds = selectedAnimals.map((animal) => animal.id);

    const handlePositionChange = useCallback((newPosition: [number, number]) => {
        setPosition(newPosition);
        setValue("locationCoordinates", newPosition, { shouldValidate: true, shouldDirty: true });
    }, [setValue]);

    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router])

    useEffect(() => {
        if (!product || !user?.id) return;
        if ((errorMessage !== null) || (String(product.userId) !== String(user.id))) {
            router.push("/");
        }
    }, [product, user?.id]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (authLoading || !authToken || !user?.id || !productId) return;
            setLoading(true);
            setErrorMessage(null);
            try {
                // Fetch en paralelo
                const [productDataResult, animalDataResult, categoriesDataResult] = await Promise.all([
                    getProduct(String(productId)),
                    getAnimals(),
                    getProductCategories()
                ]);

                setProduct(productDataResult);
                setCategories(categoriesDataResult.data);
                setAnimals(animalDataResult.data);

                // --- Validar propietario ---
                if (String(productDataResult.userId) !== String(user.id)) {
                    setErrorMessage("No tienes permiso para editar esta publicación.");
                    router.push("/"); // O a una página de error/dashboard
                    setLoading(false);
                    return; // Detiene la ejecución adicional si no es propietario
                }

                // --- Poblar el Formulario ---
                let initialCoords: [number, number] = [0, 0];
                if (productDataResult.locationCoordinates) {
                    const coords = productDataResult.locationCoordinates.split(',').map(Number);
                    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                        initialCoords = [coords[0], coords[1]];
                    }
                }
                setPosition(initialCoords);

                // Usa reset para poblar eficientemente el formulario
                reset({
                    title: productDataResult.title,
                    content: productDataResult.content,
                    price: productDataResult.price,
                    categoryId: productDataResult.category.id,
                    condition: productDataResult.condition as ProductCondition,
                    animalsId: productDataResult.animals.map(a => a.id) || [],
                    mediaIds: productDataResult.media.map(m => m.id) || [],
                    contactNumber: productDataResult.contactNumber,
                    locationCoordinates: initialCoords,
                });

                setSelectedImages(productDataResult.media || []);
                setSelectedAnimals(productDataResult.animals || []);

            } catch (err: any) {
                console.error("Error al cargar datos iniciales:", err);
                if (err.response?.status === 404) {
                    setErrorMessage("Producto no encontrado.");
                } else {
                    setErrorMessage("No se pudo cargar el producto.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [authToken, authLoading, user?.id, productId, router, reset]); // reset añadido como dependencia

    if (authLoading) return Loading();
    if (loading) return Loading();
    if (!product) return NotFound();

    const openConfirmationModalEdit = (data: ProductFormValues) => {
        setValidatedData(data); // Guardamos los datos validados
        setIsEditModalOpen(true);
    };

    const onSubmit = (data: ProductFormValues) => {
        // 'data' aquí ya está validado por Zod
        openConfirmationModalEdit(data); // Pasa los datos validados al modal/handler
    };

    const confirmSubmit = async () => {
        setIsEditModalOpen(false);
        if (!product || !authToken || !validatedData) return;

        const updatedFormData = {
            ...validatedData,
            animalIds: selectedAnimalsIds,
            userId: Number(user?.id),
            locationCoordinates: validatedData.locationCoordinates?.join(",") || "",
        };

        setLoading(true);
        try {
            await updateProduct(String(product.id), updatedFormData as UpdateProduct, authToken);
            setSuccessMessage('¡Publicación actualizada con éxito!');
            setTimeout(() => {
                router.push(`/marketplace/${product.id}`); // Redirige a la vista del post
            }, 1500);
        } catch (error) {
            console.error('Error al actualizar el producto', error);
            setErrorMessage('Hubo un problema al actualizar el producto.');
        } finally {
            setLoading(false);
            setValidatedData(null); // Limpia los datos guardados
        }
    };

    // --- Lógica de Eliminación ---
    const openDeleteModal = () => setIsDeleteModalOpen(true);

    const handleDelete = async () => {
        setIsDeleteModalOpen(false);
        setLoading(true);
        if (!product?.id || !authToken) {
            console.error('Falta el ID de la publicación o el token');
            return;
        }

        try {
            await deleteProduct(String(product.id), authToken);

            setSuccessMessage('Publicación eliminada con éxito');
            setTimeout(() => router.push('/dashboard'), 1500);

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            setErrorMessage('Hubo un problema al eliminar el producto.');
        } finally {
            setLoading(false);
        }
    };

    // --- Otros Handlers ---
    const closeModal = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setValidatedData(null); // Limpia datos si se cierra el modal de edición
    };

    const handleCancel = () => {
        if (!product?.id) {
            router.push("/dashboard"); // Fallback si no hay ID
        } else {
            router.push(`/marketplace/${product.id}`);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        if (e.target.files) {
            const file = e.target.files[0];
            const fileData = new FormData();
            fileData.append("file", file);

            if (!authToken) {
                throw new Error("El token de autenticación es requerido");
            }

            // Verifica la cantidad de imagens que se pueden subir
            if (selectedImages.length >= 5) {
                setPrecautionMessage("Solo puedes subir hasta 5 imágenes.");
                return;
            }
            const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                setPrecautionMessage("Tipo de archivo no permitido. Solo se permiten PNG, JPG y WEBP.");
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
                    setValue("mediaIds", updatedMediaIds, { shouldValidate: true });
                    setSuccessMessage("Imagen subida.");
                    setTimeout(() => setSuccessMessage(null), 2000);
                }
            } catch (error) {
                setErrorMessage("Error al subir la imagen. Intenta nuevamente.");
                console.error("Error al subir la imagen", error);
            } finally {
                setLoading(false);
                if (e.target) e.target.value = '';
            }
        }
    };

    const handleRemoveImage = async (index: number) => {
        if (!authToken) return;
        const imageToRemove = selectedImages[index];

        setLoading(true);
        setErrorMessage(null);

        try {
            await deleteMedia(imageToRemove.id, authToken);
            const updatedImages = selectedImages.filter((_, i) => i !== index);
            setSelectedImages(updatedImages);
            // Actualiza RHF con los IDs restantes
            setValue("mediaIds", updatedImages.map(img => img.id), { shouldValidate: true, shouldDirty: true });
            setSuccessMessage("Imagen eliminada.");
            // Ajusta el índice de la imagen actual si se elimina la última o una anterior
            if (currentImageIndex >= updatedImages.length) {
                setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
            }
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (error) {
            console.error("Error al eliminar la imagen", error);
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
                    <h1 className="text-2xl font-bold text-text-primary">Editar producto</h1>
                </div>

                <NewBanner
                    medias={selectedImages}
                />
                <div className="flex gap-2 mt-2 justify-center items-center">
                    {selectedImages.map((src, index) => (
                        <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
                            {src.url && (
                                <>
                                    <Image
                                        src={src.url}
                                        alt="post-image"
                                        fill
                                        className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                        unoptimized
                                    />
                                    {/* Botón de eliminación */}
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-700/60 text-white/80 text-xs hover:bg-red-600 hover:text-white transition-colors duration-150"
                                        title="Eliminar imagen"
                                    >
                                        ✕
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
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

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <div className="w-full mb-2">
                        <label className="block mb-1">Título</label>
                        <input
                            type="text"
                            {...register("title")}
                            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`} />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="w-full mb-2">
                        <label className="block mb-1">Descripción</label>
                        <textarea 
                            {...register("content")} 
                            className={`w-full p-2 border rounded ${errors.content ? 'border-red-500' : ''}`}
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
                                setValue("animalsId", selected.map((animal) => animal.id));
                            }}
                            placeholder="Seleccionar animales"
                        />
                        {errors.animalsId && <p className="text-red-500 text-sm">{errors.animalsId.message}</p>}
                    </div>

                    <div className="w-1/3 mb-2">
                        <label className="block mb-1">Estado</label>
                        <select {...register("condition")} className={`w-full p-2 border rounded ${errors.condition ? 'border-red-500' : ''}`}>
                            {Object.values(ProductCondition).map(cond => (
                                <option key={cond} value={cond}>{capitalize(cond)}</option>
                            ))}
                        </select>
                        {errors.condition && <p className="text-red-500 text-sm">{errors.condition.message}</p>}
                    </div>

                    <div className="w-1/3 mb-2">
                        <label className="block mb-1">Categoría</label>
                        <select {...register("categoryId", { valueAsNumber: true })} className={`w-full p-2 border rounded ${errors.categoryId ? 'border-red-500' : ''}`}>
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
                            className={`w-full p-2 border rounded ${errors.contactNumber ? 'border-red-500' : ''}`}
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
                    </div>

                    <div className={`h-full relative transition-opacity duration-300 ${isEditModalOpen || isDeleteModalOpen ? "pointer-events-none opacity-50" : ""}`}>
                        <MapWithNoSSR position={position} setPosition={handlePositionChange} />
                    </div>
                    {errors.locationCoordinates && <p className="text-red-500">{errors.locationCoordinates.message}</p>}

                    <div className="flex justify-between items-center mt-6 gap-10">
                        <Button
                            type="button"
                            variant="danger"
                            size="md"
                            className="rounded hover:bg-red-700"
                            onClick={openDeleteModal}
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar publicación'}
                        </Button>

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
                                {loading ? "Editando..." : "Confirmar cambios"}
                            </Button>
                        </div>
                    </div>
                </form>

                {isEditModalOpen &&
                    <ConfirmationModal
                        isOpen={isEditModalOpen}
                        title="Confirmar cambios"
                        message="¿Estás seguro de que deseas guardar los cambios del producto?"
                        textConfirm="Confirmar cambios"
                        confirmVariant="cta"
                        onClose={closeModal}
                        onConfirm={confirmSubmit}
                    />}

                {isDeleteModalOpen &&
                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        title="Confirmar eliminación"
                        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
                        textConfirm="Eliminar"
                        confirmVariant="danger"
                        onClose={closeModal}
                        onConfirm={handleDelete}
                    />}
            </div>
        </div>
    );
}