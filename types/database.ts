// TypeScript types for the database schema

export type UserRole = 'admin' | 'customer'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface CustomerProfile {
  id: string
  user_id: string
  address: string | null
  notes: string | null
  created_by_admin: string | null
  created_at: string
  updated_at: string
}

export interface Gallery {
  id: string
  customer_id: string
  gallery_name: string
  description: string | null
  shoot_date: string | null
  is_active: boolean
  created_by_admin: string | null
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  gallery_id: string | null
  photo_url: string
  thumbnail_url: string
  title: string | null
  description: string | null
  file_size: number | null
  dimensions: string | null
  order_position: number
  uploaded_at: string
  created_at: string
}

export interface Favorite {
  id: string
  customer_id: string
  photo_id: string
  favorited_at: string
}

export interface ActivityLog {
  id: string
  admin_id: string | null
  action: string
  customer_id: string | null
  gallery_id: string | null
  photo_count: number | null
  details: any | null
  created_at: string
}

// Extended types with relations
export interface GalleryWithPhotos extends Gallery {
  photos: Photo[]
  photo_count?: number
  cover_photo?: string
}

export interface PhotoWithGallery extends Photo {
  gallery: Gallery
  is_favorited?: boolean
}

export interface CustomerWithProfile extends User {
  customer_profile: CustomerProfile | null
  galleries_count?: number
}

export interface GalleryWithCustomer extends Gallery {
  customer: User
  photos: Photo[]
}

// Database result types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id'>>
      }
      customer_profiles: {
        Row: CustomerProfile
        Insert: Omit<CustomerProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CustomerProfile, 'id'>>
      }
      galleries: {
        Row: Gallery
        Insert: Omit<Gallery, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Gallery, 'id'>>
      }
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at' | 'uploaded_at'>
        Update: Partial<Omit<Photo, 'id'>>
      }
      favorites: {
        Row: Favorite
        Insert: Omit<Favorite, 'id' | 'favorited_at'>
        Update: Partial<Omit<Favorite, 'id'>>
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'>
        Update: Partial<Omit<ActivityLog, 'id'>>
      }
    }
  }
}
