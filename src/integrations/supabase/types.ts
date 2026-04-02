export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "featured_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          scheduled_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category?: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      client_messages: {
        Row: {
          content: string | null
          created_at: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_read: boolean
          project_id: string | null
          receiver_id: string | null
          sender_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean
          project_id?: string | null
          receiver_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean
          project_id?: string | null
          receiver_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "featured_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "featured_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_projects: {
        Row: {
          client_id: string
          client_story: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          end_date: string | null
          how_we_helped: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_public: boolean | null
          notes: string | null
          priority: string
          problem: string | null
          progress: number
          project_url: string | null
          results: string | null
          results_metrics: Json | null
          service_type: string | null
          solution: string | null
          start_date: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_story?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          how_we_helped?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_public?: boolean | null
          notes?: string | null
          priority?: string
          problem?: string | null
          progress?: number
          project_url?: string | null
          results?: string | null
          results_metrics?: Json | null
          service_type?: string | null
          solution?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_story?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          how_we_helped?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_public?: boolean | null
          notes?: string | null
          priority?: string
          problem?: string | null
          progress?: number
          project_url?: string | null
          results?: string | null
          results_metrics?: Json | null
          service_type?: string | null
          solution?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "featured_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          honeypot: string | null
          id: string
          lead_source: string | null
          message: string
          name: string
          phone: string | null
          referrer: string | null
          status: string
          subject: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          honeypot?: string | null
          id?: string
          lead_source?: string | null
          message: string
          name: string
          phone?: string | null
          referrer?: string | null
          status?: string
          subject: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          honeypot?: string | null
          id?: string
          lead_source?: string | null
          message?: string
          name?: string
          phone?: string | null
          referrer?: string | null
          status?: string
          subject?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_session_id: string
          id: string
          last_message_at: string | null
          status: string
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_session_id: string
          id?: string
          last_message_at?: string | null
          status?: string
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_session_id?: string
          id?: string
          last_message_at?: string | null
          status?: string
          unread_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          availability: string | null
          created_at: string
          email: string
          expected_salary: string | null
          experience_years: string | null
          expertise: string | null
          freelance_experience: string | null
          full_name: string
          id: string
          job_id: string | null
          location: string | null
          phone: string
          portfolio_link: string | null
          previous_experience: string | null
          pricing_details: string | null
          skill_level: string | null
          specialization: string
          status: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email: string
          expected_salary?: string | null
          experience_years?: string | null
          expertise?: string | null
          freelance_experience?: string | null
          full_name: string
          id?: string
          job_id?: string | null
          location?: string | null
          phone: string
          portfolio_link?: string | null
          previous_experience?: string | null
          pricing_details?: string | null
          skill_level?: string | null
          specialization: string
          status?: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string
          expected_salary?: string | null
          experience_years?: string | null
          expertise?: string | null
          freelance_experience?: string | null
          full_name?: string
          id?: string
          job_id?: string | null
          location?: string | null
          phone?: string
          portfolio_link?: string | null
          previous_experience?: string | null
          pricing_details?: string | null
          skill_level?: string | null
          specialization?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          created_at: string
          department: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          location: string
          requirements: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location?: string
          requirements?: string[] | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location?: string
          requirements?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          message_type: string
          sender_id: string | null
          sender_name: string
          sender_type: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string
          sender_id?: string | null
          sender_name: string
          sender_type: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string
          sender_id?: string | null
          sender_name?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          interests: string[] | null
          is_active: boolean
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interests?: string[] | null
          is_active?: boolean
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interests?: string[] | null
          is_active?: boolean
          source?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "featured_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          category: string
          client_name: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          display_order: number | null
          featured: boolean | null
          full_description: string | null
          id: string
          images: string[] | null
          project_url: string | null
          slug: string
          status: string
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          client_name?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          full_description?: string | null
          id?: string
          images?: string[] | null
          project_url?: string | null
          slug: string
          status?: string
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          client_name?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          full_description?: string | null
          id?: string
          images?: string[] | null
          project_url?: string | null
          slug?: string
          status?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          billing_period: string | null
          created_at: string
          currency: string
          description: string | null
          display_order: number | null
          features: string[] | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price: number
          service_type: string | null
          updated_at: string
        }
        Insert: {
          billing_period?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price?: number
          service_type?: string | null
          updated_at?: string
        }
        Update: {
          billing_period?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price?: number
          service_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          collaboration_start: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          industry: string | null
          is_featured: boolean | null
          logo_url: string | null
          phone: string | null
          rating: number | null
          testimonial: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          collaboration_start?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id: string
          industry?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          phone?: string | null
          rating?: number | null
          testimonial?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          collaboration_start?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          industry?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          phone?: string | null
          rating?: number | null
          testimonial?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          project_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          project_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          project_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "featured_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          created_at: string
          details: string | null
          email: string | null
          full_name: string
          id: string
          lead_source: string | null
          referrer: string | null
          service_type: string
          status: Database["public"]["Enums"]["request_status"]
          urgency: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          email?: string | null
          full_name: string
          id?: string
          lead_source?: string | null
          referrer?: string | null
          service_type: string
          status?: Database["public"]["Enums"]["request_status"]
          urgency: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string
          details?: string | null
          email?: string | null
          full_name?: string
          id?: string
          lead_source?: string | null
          referrer?: string | null
          service_type?: string
          status?: Database["public"]["Enums"]["request_status"]
          urgency?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          section_key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          section_key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          section_key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          role: string
          social_links: Json | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          role: string
          social_links?: Json | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string
          social_links?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      featured_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          collaboration_start: string | null
          company_name: string | null
          full_name: string | null
          id: string | null
          industry: string | null
          is_featured: boolean | null
          logo_url: string | null
          rating: number | null
          testimonial: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          collaboration_start?: string | null
          company_name?: string | null
          full_name?: string | null
          id?: string | null
          industry?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          rating?: number | null
          testimonial?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          collaboration_start?: string | null
          company_name?: string | null
          full_name?: string | null
          id?: string | null
          industry?: string | null
          is_featured?: boolean | null
          logo_url?: string | null
          rating?: number | null
          testimonial?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      publish_scheduled_posts: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "team_member" | "client"
      request_status: "new" | "contacted" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "team_member", "client"],
      request_status: ["new", "contacted", "closed"],
    },
  },
} as const
