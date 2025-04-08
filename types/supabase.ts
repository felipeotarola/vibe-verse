export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string | null
          email: string | null
          avatar_url: string | null
          bio: string | null
          status: string | null
          created_at: string
          last_logged_in: string | null
        }
        Insert: {
          id: string
          updated_at?: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          status?: string | null
          created_at?: string
          last_logged_in?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          status?: string | null
          created_at?: string
          last_logged_in?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          image_url: string | null
          url: string | null
          github_url: string | null
          category: string | null
          tech_stack: string | null
          languages: string | null
          status: string
          is_shared: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          image_url?: string | null
          url?: string | null
          github_url?: string | null
          category?: string | null
          tech_stack?: string | null
          languages?: string | null
          status?: string
          is_shared: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          url?: string | null
          github_url?: string | null
          category?: string | null
          tech_stack?: string | null
          languages?: string | null
          status?: string
          is_shared?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          image_url: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          image_url: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          image_url?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_certifications: {
        Row: {
          id: string
          user_id: string
          title: string
          organization: string
          issue_date: string | null
          expiration_date: string | null
          credential_id: string | null
          credential_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          organization: string
          issue_date?: string | null
          expiration_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          organization?: string
          issue_date?: string | null
          expiration_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_certifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_education: {
        Row: {
          id: string
          user_id: string
          title: string
          organization: string
          location: string | null
          period: string
          description: string | null
          skills: string[] | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          organization: string
          location?: string | null
          period: string
          description?: string | null
          skills?: string[] | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          organization?: string
          location?: string | null
          period?: string
          description?: string | null
          skills?: string[] | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_education_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_experience: {
        Row: {
          id: string
          user_id: string
          title: string
          organization: string
          location: string | null
          period: string
          description: string | null
          achievements: string[] | null
          logo_url: string | null
          created_at: string
          updated_at: string
          is_contract: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          organization: string
          location?: string | null
          period: string
          description?: string | null
          achievements?: string[] | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
          is_contract?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          organization?: string
          location?: string | null
          period?: string
          description?: string | null
          achievements?: string[] | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
          is_contract?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_experience_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          technologies: string[] | null
          link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string | null
          technologies: string[] | null
          link: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          technologies?: string[] | null
          link?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_skills: {
        Row: {
          id: string
          user_id: string
          category: string
          items: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          items: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          items?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_skills_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_settings: {
        Row: {
          id: string
          user_id: string
          is_published: boolean
          public_url_slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          is_published: boolean
          public_url_slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          is_published?: boolean
          public_url_slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          email: string | null
        }
        Insert: {
          id: string
          email?: string | null
        }
        Update: {
          id?: string
          email?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
