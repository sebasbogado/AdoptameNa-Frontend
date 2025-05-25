import { MultiSelect } from "@/components/multi-select";
import Button from "../buttons/button";
import { FormDataProps } from "@/types/props/posts/FormDataPostProps";
import ForwardRefEditor from "../editor/forward-ref-editor";
import { POST_TYPEID } from "@/types/constants";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { CreatePostLocation } from "./create-post-location";

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
    MAX_TAGS,
    MAX_IMAGES,
    control,

}: FormDataProps) => {
    const postTypeId = watch("postTypeId");
    const editorContentRef = useRef('')
    const [initialContent] = useState('') // Si necesitas contenido inicial


    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-8">
                {/* Tipo de publicación */}
                <div className="flex flex-col gap-2">
                    <label className="block">Tipo de publicación <span className="text-red-500">*</span></label>
                    <select
                        {...register("postTypeId", { valueAsNumber: true })}
                        className={`w-fit p-2 border rounded mb-4 
                            ${errors.postTypeId ? 'border-red-500' : ''} 
                            ${watch("postTypeId") === 0 ? 'text-gray-500' : 'text-black'}`}
                    >

                        <option disabled value={0}>Seleccione un tipo</option>
                        {postTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>
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
                {errors.tagIds && <p className="text-red-500">{/* @ts-ignore */} {errors.tagIds.message}</p>}

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
                            ) => <ForwardRefEditor
                             IsCreateBlog={true} 
                                    markdown={initialContent}
                                    onChange={(value: string) => {
                                        editorContentRef.current = value // No renderiza nada
                                    }}
                                    className="border-2 rounded-lg border-gray"
                                />}
                        > 

                        </Controller>

                    ) : (
                        <>
                          <label className="block">
                        Descripción <span className="text-red-500">*</span>
                    </label>

                        <textarea
                            {...register("content")}
                            placeholder="Descripción"
                            className={`w-full p-2 border rounded mb-4 ${errors.content ? 'border-red-500' : ''}`}
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
                )}                {postTypeId !== POST_TYPEID.BLOG && (
                    <div
                        className={`h-full relative transition-opacity duration-300 ${isModalOpen ? "pointer-events-none opacity-50" : ""}`}
                    >
                        <CreatePostLocation 
                            position={position} 
                            setPosition={(pos) => pos !== null && handlePositionChange(pos)}
                            error={errors.locationCoordinates}
                        />
                    </div>
                )}
                <div className="flex justify-between items-center mt-6 gap-10">
                    <Button
                        type="button"
                        variant="danger"
                        size="md"
                        className="rounded opacity-0"
                        disabled={loading}
                    >
                        Eliminar publicación
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
                            onClick={() => {
                                    setValue('content', editorContentRef.current)
                                console.log(errors)
                            }}
                            variant="cta"
                            className={`rounded ${selectedTags.length >= MAX_TAGS ? "bg-gray-400" : "hover:bg-purple-700"}`}
                            disabled={loading || selectedTags.length >= MAX_TAGS}
                        >
                            {loading ? "Creando..." : "Crear publicación"}
                        </Button>
                    </div>
                </div>
            </form>


        </>
    )
}