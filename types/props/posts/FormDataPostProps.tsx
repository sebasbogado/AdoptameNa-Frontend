import { UseFormRegister, FieldErrors, UseFormSetValue,  Control, UseFormWatch, UseFormTrigger } from "react-hook-form";
import { PostFormValues } from "@/validations/post-schema";
import { PostType } from "@/types/post-type";
import { Tags } from "@/types/tags";

export type FormDataProps = {
  handleSubmit: (onValid: (data: PostFormValues) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: (data: PostFormValues) => void;
  register: UseFormRegister<PostFormValues>;
  errors: FieldErrors<PostFormValues>;
  watch: UseFormWatch<PostFormValues>
  postTypes: PostType[];
  filteredTags: Tags[];
  selectedTags: Tags[];
  setSelectedTags: (tags: Tags[]) => void;
setValue: UseFormSetValue<PostFormValues>
  isModalOpen: boolean;
  position: [number, number] | null;
  loading: boolean;
  handleCancel: () => void;
  handlePositionChange: (pos: [number, number]) => void;
  closeModal: () => void;
  confirmSubmit: () => void;
    MAX_IMAGES: number;
  MAX_TAGS: number;
  control:  Control<PostFormValues>;
  onEditorImageUpload?: (mediaId: number) => void;
  isEditMode?: boolean;
  openDeleteModal?: () => void;
  trigger: UseFormTrigger<PostFormValues>
};