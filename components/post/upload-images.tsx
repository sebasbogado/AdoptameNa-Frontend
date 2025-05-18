import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { Alert } from "@material-tailwind/react";

import { UploadImageProps } from "@/types/props/posts/UploadImagesProps";
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
    setSuccessMessage,

}: UploadImageProps) => {
    return (
        <div>
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
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-700/60 text-white/80 text-xs hover:bg-red-600 hover:text-white transition-colors duration-150"
                        title="Eliminar imagen"
                    >
                        ✕
                    </button>
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

        </div>

    );
}
export default UploadImages;