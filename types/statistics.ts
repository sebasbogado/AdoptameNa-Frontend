export interface StatisticsOverview {
  totalUsers: number
  totalVerifiedUsers: number
  totalPets: number
  totalPosts: number
  totalProducts: number
  totalAdoptionRequests: number
  totalComments: number
  totalReports: number
  totalCrowdfunding: number
  totalCrowdfundingAmount: number
  totalSponsors: number
  totalBanners: number
  totalMessages: number
  totalUnreadMessages: number
  totalNotifications: number
  totalMediaFiles: number
  totalFavorites: number
  totalShares: number
  totalLikes: number
  usersCreatedToday: number
  postsCreatedToday: number
  productsCreatedToday: number
  adoptionRequestsToday: number
  usersCreatedThisWeek: number
  postsCreatedThisWeek: number
  productsCreatedThisWeek: number
  adoptionRequestsThisWeek: number
  usersCreatedThisMonth: number
  postsCreatedThisMonth: number
  productsCreatedThisMonth: number
  adoptionRequestsThisMonth: number
  usersGrowthPercentage: number
  postsGrowthPercentage: number
  productsGrowthPercentage: number
  adoptionRequestsGrowthPercentage: number
  commentsGrowthPercentage: number
  reportsGrowthPercentage: number
  crowdfundingGrowthPercentage: number
  nonBannedPets: number
  nonBannedPosts: number
  nonBannedProducts: number
  nonBannedComments: number
  activeBannersEnabled: number
}
export interface StatisticsContent {
  totalPets: number
  activePets: number
  bannedPets: number
  deletedPets: number
  petCountByStatus: PetCountByStatus
  petCountByAnimal: PetCountByAnimal
  petCountByGender: PetCountByGender
  vaccinatedPets: number
  sterilizedPets: number
  petsWithSensitiveImages: number
  totalPetShares: number
  totalPosts: number
  activePosts: number
  bannedPosts: number
  deletedPosts: number
  postCountByType: PostCountByType
  postsWithSensitiveImages: number
  totalPostShares: number
  totalProducts: number
  activeProducts: number
  bannedProducts: number
  deletedProducts: number
  productCountByCategory: ProductCountByCategory
  productCountByCondition: ProductCountByCondition
  totalProductShares: number
  totalComments: number
  activeComments: number
  bannedComments: number
  deletedComments: number
  totalCommentLikes: number
  totalReplies: number
  petsCreatedToday: number
  postsCreatedToday: number
  productsCreatedToday: number
  commentsCreatedToday: number
  petsCreatedThisWeek: number
  postsCreatedThisWeek: number
  productsCreatedThisWeek: number
  commentsCreatedThisWeek: number
  petsCreatedThisMonth: number
  postsCreatedThisMonth: number
  productsCreatedThisMonth: number
  commentsCreatedThisMonth: number
  petsGrowthPercentage: number
  postsGrowthPercentage: number
  productsGrowthPercentage: number
  commentsGrowthPercentage: number
}

export interface PetCountByStatus {
  "En Adopción_count": number
  Perdido_percentage: number
  Perdido_count: number
  "En Adopción_percentage": number
  Encontrado_count: number
  "En Casa_count": number
  Encontrado_percentage: number
  "En Casa_percentage": number
}

export interface PetCountByAnimal {
  ave_count: number
  perro_count: number
  gato_percentage: number
  ave_percentage: number
  perro_percentage: number
  gato_count: number
}

export interface PetCountByGender {
  FEMALE_count: number
  FEMALE_percentage: number
  MALE_percentage: number
  MALE_count: number
}

export interface PostCountByType {
  Voluntariado_percentage: number
  Blog_count: number
  Voluntariado_count: number
  Blog_percentage: number
}

export interface ProductCountByCategory {
  Accesorios_count: number
  "Alimentos para mascotas_count": number
  "Alimentos para mascotas_percentage": number
  Juguetes_count: number
  Otro_percentage: number
  "Productos de higiene_count": number
  Juguetes_percentage: number
  Otro_count: number
  "Productos de higiene_percentage": number
  Accesorios_percentage: number
}

export interface ProductCountByCondition {
  USADO_count: number
  USADO_percentage: number
  NUEVO_percentage: number
  NUEVO_count: number
}
