import { ImagePlus, Check, X, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Alert } from "@material-tailwind/react";
import { allowedAllTypes, allowedImageTypes } from "@/utils/file-schema";
import { UploadImageProps } from "@/types/props/posts/UploadImagesProps";
import { POST_TYPEID } from "@/types/constants";

const UploadImages = ({ selectedImages,
    currentImageIndex,
    setCurrentImageIndex,
    handleRemoveImage,
    handleImageUpload,
    MAX_IMAGES,
    errorMessage,
    setErrorMessage,
    precautionMessage,
    setPrecautionMessage,
    successMessage,
    watch,
    setSuccessMessage,
}: UploadImageProps) => {
        const postTypeId = watch("postTypeId");

    return (
        <div>
            <div className="flex gap-2 mt-2 justify-center items-center">
                {selectedImages.map((src, index) => (
                    <div key={index} className="relative w-[95px] h-[95px] cursor-pointer">
                        {src.mimeType && src.mimeType.startsWith("video/") ? (
                            <video
                                src={src.url}
                                className={`object-cover rounded-md w-full h-full ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                                muted
                                playsInline
                                loop
                            />
                        ) : (
                            <Image
                                src={src.url}
                                alt="post"
                                fill
                                className={`object-cover rounded-md ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
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
             {selectedImages.length < MAX_IMAGES && (
            <>
                <input
                    type="file"
                    accept={
                        postTypeId === POST_TYPEID.BLOG
                            ? allowedImageTypes.join(",")
                            : allowedAllTypes.join(",")
                    }
                    multiple
                    className="hidden"
                    id="fileInput"
                    onChange={handleImageUpload}
                />
                <label
                    htmlFor="fileInput"
                    className="cursor-pointer flex items-center justify-center w-24 h-24 rounded-lg border-2 border-blue-500 hover:border-blue-700 bg-white"
                >
                    <ImagePlus size={20} className="text-blue-500" />
                </label>
            </>
)}
            </div>
            {errorMessage && (
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
            )}

            {precautionMessage && (
                <Alert
                    open={true}
                    color="orange"
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
            )}

            {successMessage && (
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
            )}
        </div>
    );
}
export default UploadImages;