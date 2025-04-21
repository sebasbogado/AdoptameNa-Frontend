import { Media } from "./media";

export type Banner = {
  id: number;
  startDate: string;
  endDate: string;
  media: Media;
  priority: number;
  isActive: boolean;
};

export type PublicBanner = {
  id: number;
  imageUrl: string;
  priority: number;
};
