export interface UserProfile {
  id: number;
  organizationName: string;
  fullName: string;
  address: string | null;
  description: string;
  gender: string | null;
  birthdate: string | null;
  document: string | null;
  phoneNumber: string | null;
  earnedPoints: number;
  addressCoordinates: string | null;
  bannerImages: string[];
  email: string;
  isProfileCompleted: boolean;
  creationDate: string;
}
export type UpdateUserProfile = Omit<UserProfile, "id">;

export type UserReport = Omit<
  UserProfile,
  | "organizationName"
  | "address"
  | "description"
  | "gender"
  | "birthdate"
  | "document"
  | "phoneNumber"
  | "earnedPoints"
  | "addressCoordinates"
  | "bannerImages"
>;

export type UserList = Pick<UserProfile, "id" | "fullName" | "email"> & {
  creationDate: string;
} & { role?: string };
