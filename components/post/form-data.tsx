import { MultiSelect } from "@/components/multi-select";
import Button from "../buttons/button";
import { FormDataProps } from "@/types/props/posts/FormDataPostProps";
import ForwardRefEditor from "../editor/forward-ref-editor";
import { POST_TYPEID } from "@/types/constants";
import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { CreatePostLocation } from "./create-post-location";
import { MAX_TAGS } from "@/validations/post-schema";
export const FormData = ({ handleSubmit,
    onSubmit,
    register,
    errors,
    watch,
    postTypes,
    filteredTags,
    selectedTags,
    setSelectedTags,
    setValue,
    isModalOpen,
    position,
    loading,
    handleCancel,
    handlePositionChange,
    control,
    onEditorImageUpload,
    isEditMode,
    openDeleteModal,
    trigger


}: FormDataProps) => {
    const postTypeId = watch("postTypeId");
    const editorContentRef = useRef('')
    const content = watch("content");

    const handleSubmitValid = async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    if (postTypeId === POST_TYPEID.BLOG) {
                        setValue("content", editorContentRef.current, { shouldValidate: true });
                    }
                    const isValid = await trigger(); // <- forza validación con los nuevos valores
                    if (isValid) {
                        handleSubmit(onSubmit)();
                    }
                }
    useEffect(() => {
        if (postTypeId === POST_TYPEID.BLOG && content) {
            editorContentRef.current = content;
        }
    }, [postTypeId, content]);
    
    return (
        <>

            <form
                onSubmit= {handleSubmitValid}
                className="flex flex-col gap-6 p-8"
            >                {/* Tipo de publicación */}
                <Controller
                    name="postTypeId"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value}
                            className={`w-fit p-2 border rounded mb-4 
                            ${errors.postTypeId ? 'border-red-500' : ''} 
                            ${field.value === 0 ? 'text-gray-500' : 'text-black'}
                            ${isEditMode ? 'cursor-not-allowed text-gray-500' : ''}`}
                            disabled={isEditMode}
                        >
                            <option disabled value={0}>Seleccione un tipo</option>
                            {postTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors.postTypeId && <p className="text-red-500">{errors.postTypeId.message}</p>}

                {/* Tags (MultiSelect) */}
                <div className="flex flex-col gap-2">
                    <label className="block">Tags</label>
                    <MultiSelect
                        options={filteredTags} // <-- Usa los tags filtrados
                        selected={selectedTags}
                        onChange={(selected) => {
                            setSelectedTags(selected);
                            setValue("tagIds", selected.map((animal) => animal.id));
                        }}
                        placeholder="Seleccionar tags"
                        maxSelected={MAX_TAGS} // <-- Limita la selección a 3 tags
                    />
                </div>
                {errors.tagIds && <p className="text-red-500"> {errors.tagIds.message}</p>}

                {/* Título */}
                <div className="flex flex-col gap-2">
                    <label className="block">Título <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        placeholder="Titulo"
                        {...register("title")}
                        className={`w-full p-2 border rounded mb-4 ${errors.title ? 'border-red-500' : ''}`}
                    />
                </div>
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                <div className="flex flex-col gap-2">
                  
                    {postTypeId === POST_TYPEID.BLOG ? (
                        <Controller
                            name="content"
                            control={control}
                            render={(
                                field
                            ) =>    <ForwardRefEditor
                                    IsCreateBlog={true}
                                    markdown={content}
                                    onChange={(value: string) => {
                                        editorContentRef.current = value
                                    }}
                                    onImageUpload={onEditorImageUpload} // <-- PASA EL PROP AQUÍ
                                    className="border-2 rounded-lg border-gray"
                                />}
                        > 

                        </Controller>

                    ) : (
                        <>
                            <label className="block">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Descripción"
                                        className={`w-full p-2 border rounded mb-4 ${errors.content ? 'border-red-500' : ''}`}
                                    />
                                )}
                            />
                        </>

                    )}
                </div>
                {errors.content && (
                    <p className="text-red-500 text-sm">{errors.content.message}</p>
                )}

                {postTypeId !== POST_TYPEID.BLOG && (
                    <div className="flex flex-col gap-2">
                        <label className="block">Número de contacto <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="0000123456"
                            {...register("contactNumber")}
                            className={`w-1/4 p-2 border rounded mb-4 ${errors.contactNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}

                    </div>
                )}

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
                
                {postTypeId !== POST_TYPEID.BLOG && (
                    <div
                        className={`h-full transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}
                    >
                        <CreatePostLocation
                            position={position}
                            setPosition={handlePositionChange}
                            error={errors.locationCoordinates}
                        />
                    </div>
                )}
                <div
                    className={`flex items-center mt-6 gap-10 ${
                        isEditMode ? "justify-between" : "justify-end"
                    }`}
                >
                        { isEditMode && (
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
                        )
                        }
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
                            className={`rounded ${selectedTags.length > MAX_TAGS ? "bg-gray-400" : "hover:bg-purple-700"}`}
                            disabled={loading || selectedTags.length > MAX_TAGS}
                            id="crear-post"
                        >
                            {isEditMode
                                ? loading
                                    ? "Editando..."
                                    : "Editar publicación"
                                : loading
                                    ? "Creando..."
                                    : "Crear publicación"}
                        </Button>
                    </div>
                </div>
            </form>


        </>
    )
}