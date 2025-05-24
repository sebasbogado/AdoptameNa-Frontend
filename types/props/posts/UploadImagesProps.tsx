// types/form/UploadImageProps.ts
import { Media } from "@/types/media";
import { PostFormValues } from "@/validations/post-schema";
import { UseFormWatch } from "react-hook-form";

export type UploadImageProps = {
  selectedImages: Media[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  handleRemoveImage: (index: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  MAX_IMAGES: number;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  precautionMessage: string;
  setPrecautionMessage: (msg: string) => void;
  successMessage: string;
  setSuccessMessage: (msg: string) => void;
  watch: UseFormWatch<PostFormValues>
};