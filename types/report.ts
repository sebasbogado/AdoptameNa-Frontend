export interface Report {
  id: number
  user: User
  idPost: number
  reportReason: string
  description: string
  reportDate: string
}

export interface User {
  id: number
  fullName: string
  email: string
  creationDate: string
  role: string
  isVerified: boolean
}
