export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      gallery_images: {
        Row: {
          id: string
          title: string
          category: string
          description: string
          image_url: string
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          category: string
          description?: string
          image_url: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          category?: string
          description?: string
          image_url?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
    }
  }
}
