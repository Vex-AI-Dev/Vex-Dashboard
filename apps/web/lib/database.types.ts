export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_limit_overrides: {
        Row: {
          account_id: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          max_team_members: number | null
          parallel_executions_limit: number | null
          qa_runs_limit: number | null
          reason: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          max_team_members?: number | null
          parallel_executions_limit?: number | null
          qa_runs_limit?: number | null
          reason?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          max_team_members?: number | null
          parallel_executions_limit?: number | null
          qa_runs_limit?: number | null
          reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_limit_overrides_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_limit_overrides_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_limit_overrides_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          is_enterprise: boolean
          is_personal_account: boolean
          name: string
          onboarding_completed: boolean
          onboarding_step: number
          picture_url: string | null
          primary_owner_user_id: string
          public_data: Json
          qa_trial_ends_at: string | null
          qa_trial_started_at: string | null
          slug: string | null
          updated_at: string | null
          updated_by: string | null
          vex_plan: string
          vex_plan_overrides: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_enterprise?: boolean
          is_personal_account?: boolean
          name: string
          onboarding_completed?: boolean
          onboarding_step?: number
          picture_url?: string | null
          primary_owner_user_id?: string
          public_data?: Json
          qa_trial_ends_at?: string | null
          qa_trial_started_at?: string | null
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vex_plan?: string
          vex_plan_overrides?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_enterprise?: boolean
          is_personal_account?: boolean
          name?: string
          onboarding_completed?: boolean
          onboarding_step?: number
          picture_url?: string | null
          primary_owner_user_id?: string
          public_data?: Json
          qa_trial_ends_at?: string | null
          qa_trial_started_at?: string | null
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vex_plan?: string
          vex_plan_overrides?: Json | null
        }
        Relationships: []
      }
      accounts_memberships: {
        Row: {
          account_id: string
          account_role: string
          created_at: string
          created_by: string | null
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          account_role: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          account_role?: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_role_fkey"
            columns: ["account_role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      agent_messages: {
        Row: {
          account_id: string
          content: string | null
          created_at: string
          id: string
          message_type: string
          screenshot: string | null
          test_run_id: string
          tool_args: Json | null
          tool_name: string | null
          tool_result: Json | null
        }
        Insert: {
          account_id: string
          content?: string | null
          created_at?: string
          id?: string
          message_type: string
          screenshot?: string | null
          test_run_id: string
          tool_args?: Json | null
          tool_name?: string | null
          tool_result?: Json | null
        }
        Update: {
          account_id?: string
          content?: string | null
          created_at?: string
          id?: string
          message_type?: string
          screenshot?: string | null
          test_run_id?: string
          tool_args?: Json | null
          tool_name?: string | null
          tool_result?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          account_id: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          scopes: string[] | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          scopes?: string[] | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          scopes?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_customers: {
        Row: {
          account_id: string
          customer_id: string
          email: string | null
          id: number
          provider: Database["public"]["Enums"]["billing_provider"]
        }
        Insert: {
          account_id: string
          customer_id: string
          email?: string | null
          id?: number
          provider: Database["public"]["Enums"]["billing_provider"]
        }
        Update: {
          account_id?: string
          customer_id?: string
          email?: string | null
          id?: number
          provider?: Database["public"]["Enums"]["billing_provider"]
        }
        Relationships: [
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing: boolean
          enable_team_account_billing: boolean
          enable_team_accounts: boolean
        }
        Insert: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing?: boolean
          enable_team_account_billing?: boolean
          enable_team_accounts?: boolean
        }
        Update: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing?: boolean
          enable_team_account_billing?: boolean
          enable_team_accounts?: boolean
        }
        Relationships: []
      }
      environment_sessions: {
        Row: {
          account_id: string
          base_url: string
          captured_at: string | null
          captured_by: string | null
          created_at: string | null
          credentials: Json | null
          environment: Database["public"]["Enums"]["test_environment"]
          id: string
          login_steps: string[] | null
          session_data: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          base_url: string
          captured_at?: string | null
          captured_by?: string | null
          created_at?: string | null
          credentials?: Json | null
          environment: Database["public"]["Enums"]["test_environment"]
          id?: string
          login_steps?: string[] | null
          session_data?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          base_url?: string
          captured_at?: string | null
          captured_by?: string | null
          created_at?: string | null
          credentials?: Json | null
          environment?: Database["public"]["Enums"]["test_environment"]
          id?: string
          login_steps?: string[] | null
          session_data?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "environment_sessions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "environment_sessions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "environment_sessions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      github_app_installations: {
        Row: {
          account_id: string
          created_at: string | null
          github_account_avatar_url: string | null
          github_account_id: number
          github_account_login: string
          github_account_type: string
          id: string
          installation_id: number
          is_suspended: boolean
          repository_selection: string
          suspended_at: string | null
          suspended_by: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          github_account_avatar_url?: string | null
          github_account_id: number
          github_account_login: string
          github_account_type: string
          id?: string
          installation_id: number
          is_suspended?: boolean
          repository_selection?: string
          suspended_at?: string | null
          suspended_by?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          github_account_avatar_url?: string | null
          github_account_id?: number
          github_account_login?: string
          github_account_type?: string
          id?: string
          installation_id?: number
          is_suspended?: boolean
          repository_selection?: string
          suspended_at?: string | null
          suspended_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "github_app_installations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "github_app_installations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "github_app_installations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_connections: {
        Row: {
          account_id: string
          created_at: string | null
          created_by: string
          id: string
          nango_connection_id: string
          provider: string
          settings: Json
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          created_by: string
          id?: string
          nango_connection_id: string
          provider: string
          settings?: Json
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          nango_connection_id?: string
          provider?: string
          settings?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_connections_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_connections_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_connections_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invite_token: string
          invited_by: string
          role: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: number
          invite_token: string
          invited_by: string
          role: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: number
          invite_token?: string
          invited_by?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      nonces: {
        Row: {
          client_token: string
          created_at: string
          expires_at: string
          id: string
          last_verification_at: string | null
          last_verification_ip: unknown
          last_verification_user_agent: string | null
          metadata: Json | null
          nonce: string
          purpose: string
          revoked: boolean
          revoked_reason: string | null
          scopes: string[] | null
          used_at: string | null
          user_id: string | null
          verification_attempts: number
        }
        Insert: {
          client_token: string
          created_at?: string
          expires_at: string
          id?: string
          last_verification_at?: string | null
          last_verification_ip?: unknown
          last_verification_user_agent?: string | null
          metadata?: Json | null
          nonce: string
          purpose: string
          revoked?: boolean
          revoked_reason?: string | null
          scopes?: string[] | null
          used_at?: string | null
          user_id?: string | null
          verification_attempts?: number
        }
        Update: {
          client_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          last_verification_at?: string | null
          last_verification_ip?: unknown
          last_verification_user_agent?: string | null
          metadata?: Json | null
          nonce?: string
          purpose?: string
          revoked?: boolean
          revoked_reason?: string | null
          scopes?: string[] | null
          used_at?: string | null
          user_id?: string | null
          verification_attempts?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          account_id: string
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          dismissed: boolean
          expires_at: string | null
          id: number
          link: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          account_id: string
          body: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          dismissed?: boolean
          expires_at?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          account_id?: string
          body?: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          dismissed?: boolean
          expires_at?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_amount: number | null
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id: string
          order_id: string
          price_amount?: number | null
          product_id: string
          quantity?: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_amount?: number | null
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at?: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          billing_customer_id?: number
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          created_at?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_billing_customer_id_fkey"
            columns: ["billing_customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_usage: {
        Row: {
          account_id: string
          created_at: string
          id: string
          parallel_executions_current: number
          parallel_executions_limit: number
          period_end: string
          period_start: string
          qa_runs_limit: number
          qa_runs_used: number
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          parallel_executions_current?: number
          parallel_executions_limit: number
          period_end: string
          period_start: string
          qa_runs_limit: number
          qa_runs_used?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          parallel_executions_current?: number
          parallel_executions_limit?: number
          period_end?: string
          period_start?: string
          qa_runs_limit?: number
          qa_runs_used?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_usage_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_usage_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_usage_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      repositories: {
        Row: {
          account_id: string
          created_at: string | null
          created_by: string | null
          github_default_branch: string
          github_full_name: string | null
          github_installation_id: number | null
          github_owner: string
          github_repo: string
          github_repo_id: number
          id: string
          is_active: boolean
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          created_by?: string | null
          github_default_branch?: string
          github_full_name?: string | null
          github_installation_id?: number | null
          github_owner: string
          github_repo: string
          github_repo_id: number
          id?: string
          is_active?: boolean
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          created_by?: string | null
          github_default_branch?: string
          github_full_name?: string | null
          github_installation_id?: number | null
          github_owner?: string
          github_repo?: string
          github_repo_id?: number
          id?: string
          is_active?: boolean
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repositories_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repositories_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repositories_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permissions"]
          role: string
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permissions"]
          role: string
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permissions"]
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      roles: {
        Row: {
          hierarchy_level: number
          name: string
        }
        Insert: {
          hierarchy_level: number
          name: string
        }
        Update: {
          hierarchy_level?: number
          name?: string
        }
        Relationships: []
      }
      spec_tags: {
        Row: {
          created_at: string | null
          spec_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          spec_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          spec_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spec_tags_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "specs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spec_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "test_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      specs: {
        Row: {
          account_id: string
          api_config: Json | null
          approved_at: string | null
          approved_by: string | null
          binding_type: Database["public"]["Enums"]["spec_binding_type"] | null
          binding_value: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          parent_spec_id: string | null
          performance_config: Json | null
          prd_text: string
          repository_id: string | null
          spec_content: Json | null
          status: Database["public"]["Enums"]["spec_status"]
          test_credentials: Json | null
          test_script: string | null
          test_steps: Json | null
          test_type: Database["public"]["Enums"]["test_type"]
          ticket_id: string | null
          ticket_url: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
          version: number
        }
        Insert: {
          account_id: string
          api_config?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          binding_type?: Database["public"]["Enums"]["spec_binding_type"] | null
          binding_value?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          parent_spec_id?: string | null
          performance_config?: Json | null
          prd_text: string
          repository_id?: string | null
          spec_content?: Json | null
          status?: Database["public"]["Enums"]["spec_status"]
          test_credentials?: Json | null
          test_script?: string | null
          test_steps?: Json | null
          test_type?: Database["public"]["Enums"]["test_type"]
          ticket_id?: string | null
          ticket_url?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number
        }
        Update: {
          account_id?: string
          api_config?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          binding_type?: Database["public"]["Enums"]["spec_binding_type"] | null
          binding_value?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          parent_spec_id?: string | null
          performance_config?: Json | null
          prd_text?: string
          repository_id?: string | null
          spec_content?: Json | null
          status?: Database["public"]["Enums"]["spec_status"]
          test_credentials?: Json | null
          test_script?: string | null
          test_steps?: Json | null
          test_type?: Database["public"]["Enums"]["test_type"]
          ticket_id?: string | null
          ticket_url?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "specs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specs_parent_spec_id_fkey"
            columns: ["parent_spec_id"]
            isOneToOne: false
            referencedRelation: "specs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specs_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_items: {
        Row: {
          created_at: string
          id: string
          interval: string
          interval_count: number
          price_amount: number | null
          product_id: string
          quantity: number
          subscription_id: string
          type: Database["public"]["Enums"]["subscription_item_type"]
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id: string
          interval: string
          interval_count: number
          price_amount?: number | null
          product_id: string
          quantity?: number
          subscription_id: string
          type: Database["public"]["Enums"]["subscription_item_type"]
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interval?: string
          interval_count?: number
          price_amount?: number | null
          product_id?: string
          quantity?: number
          subscription_id?: string
          type?: Database["public"]["Enums"]["subscription_item_type"]
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_items_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at?: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          active?: boolean
          billing_customer_id?: number
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end?: boolean
          created_at?: string
          currency?: string
          id?: string
          period_ends_at?: string
          period_starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_billing_customer_id_fkey"
            columns: ["billing_customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      suite_runs: {
        Row: {
          account_id: string
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          environment: Database["public"]["Enums"]["test_environment"] | null
          failed_tests: number | null
          id: string
          passed_tests: number | null
          started_at: string | null
          status: string | null
          suite_id: string
          total_tests: number | null
        }
        Insert: {
          account_id: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          environment?: Database["public"]["Enums"]["test_environment"] | null
          failed_tests?: number | null
          id?: string
          passed_tests?: number | null
          started_at?: string | null
          status?: string | null
          suite_id: string
          total_tests?: number | null
        }
        Update: {
          account_id?: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          environment?: Database["public"]["Enums"]["test_environment"] | null
          failed_tests?: number | null
          id?: string
          passed_tests?: number | null
          started_at?: string | null
          status?: string | null
          suite_id?: string
          total_tests?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "suite_runs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suite_runs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suite_runs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suite_runs_suite_id_fkey"
            columns: ["suite_id"]
            isOneToOne: false
            referencedRelation: "test_suites"
            referencedColumns: ["id"]
          },
        ]
      }
      suite_specs: {
        Row: {
          created_at: string | null
          order_index: number | null
          spec_id: string
          suite_id: string
        }
        Insert: {
          created_at?: string | null
          order_index?: number | null
          spec_id: string
          suite_id: string
        }
        Update: {
          created_at?: string | null
          order_index?: number | null
          spec_id?: string
          suite_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suite_specs_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "specs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suite_specs_suite_id_fkey"
            columns: ["suite_id"]
            isOneToOne: false
            referencedRelation: "test_suites"
            referencedColumns: ["id"]
          },
        ]
      }
      test_run_alerts: {
        Row: {
          account_id: string
          alert_type: string
          confidence: number | null
          created_at: string
          id: string
          page_url: string | null
          reasoning: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          screenshot_url: string | null
          step_index: number | null
          step_text: string | null
          test_run_id: string
          timestamp: string
        }
        Insert: {
          account_id: string
          alert_type: string
          confidence?: number | null
          created_at?: string
          id?: string
          page_url?: string | null
          reasoning?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          screenshot_url?: string | null
          step_index?: number | null
          step_text?: string | null
          test_run_id: string
          timestamp?: string
        }
        Update: {
          account_id?: string
          alert_type?: string
          confidence?: number | null
          created_at?: string
          id?: string
          page_url?: string | null
          reasoning?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          screenshot_url?: string | null
          step_index?: number | null
          step_text?: string | null
          test_run_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_run_alerts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_alerts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_alerts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_alerts_test_run_id_fkey"
            columns: ["test_run_id"]
            isOneToOne: false
            referencedRelation: "test_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      test_run_events: {
        Row: {
          account_id: string
          created_at: string
          duration_ms: number | null
          element_selector: string | null
          element_text: string | null
          event_type: Database["public"]["Enums"]["test_run_event_type"]
          id: string
          message: string | null
          metadata: Json | null
          screenshot: string | null
          step_index: number | null
          step_name: string | null
          test_run_id: string
          url: string | null
        }
        Insert: {
          account_id: string
          created_at?: string
          duration_ms?: number | null
          element_selector?: string | null
          element_text?: string | null
          event_type: Database["public"]["Enums"]["test_run_event_type"]
          id?: string
          message?: string | null
          metadata?: Json | null
          screenshot?: string | null
          step_index?: number | null
          step_name?: string | null
          test_run_id: string
          url?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string
          duration_ms?: number | null
          element_selector?: string | null
          element_text?: string | null
          event_type?: Database["public"]["Enums"]["test_run_event_type"]
          id?: string
          message?: string | null
          metadata?: Json | null
          screenshot?: string | null
          step_index?: number | null
          step_name?: string | null
          test_run_id?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_run_events_test_run_id_fkey"
            columns: ["test_run_id"]
            isOneToOne: false
            referencedRelation: "test_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      test_run_inputs: {
        Row: {
          account_id: string
          created_at: string
          expires_at: string
          id: string
          prompt: string
          provided_at: string | null
          request_type: Database["public"]["Enums"]["input_request_type"]
          requested_at: string
          screenshot: string | null
          status: Database["public"]["Enums"]["input_request_status"]
          test_run_id: string
          user_input: string | null
        }
        Insert: {
          account_id: string
          created_at?: string
          expires_at?: string
          id?: string
          prompt: string
          provided_at?: string | null
          request_type: Database["public"]["Enums"]["input_request_type"]
          requested_at?: string
          screenshot?: string | null
          status?: Database["public"]["Enums"]["input_request_status"]
          test_run_id: string
          user_input?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          prompt?: string
          provided_at?: string | null
          request_type?: Database["public"]["Enums"]["input_request_type"]
          requested_at?: string
          screenshot?: string | null
          status?: Database["public"]["Enums"]["input_request_status"]
          test_run_id?: string
          user_input?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_run_inputs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_inputs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_inputs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      test_run_shares: {
        Row: {
          account_id: string
          created_at: string | null
          created_by: string
          expires_at: string
          id: string
          last_viewed_at: string | null
          revoked: boolean
          revoked_at: string | null
          revoked_by: string | null
          share_token: string
          test_run_id: string
          updated_at: string | null
          view_count: number
        }
        Insert: {
          account_id: string
          created_at?: string | null
          created_by: string
          expires_at: string
          id?: string
          last_viewed_at?: string | null
          revoked?: boolean
          revoked_at?: string | null
          revoked_by?: string | null
          share_token: string
          test_run_id: string
          updated_at?: string | null
          view_count?: number
        }
        Update: {
          account_id?: string
          created_at?: string | null
          created_by?: string
          expires_at?: string
          id?: string
          last_viewed_at?: string | null
          revoked?: boolean
          revoked_at?: string | null
          revoked_by?: string | null
          share_token?: string
          test_run_id?: string
          updated_at?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_run_shares_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_shares_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_shares_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_shares_test_run_id_fkey"
            columns: ["test_run_id"]
            isOneToOne: false
            referencedRelation: "test_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      test_run_step_logs: {
        Row: {
          account_id: string
          action_type: string
          action_value: string | null
          created_at: string
          duration_ms: number
          element_found: boolean
          element_selector: string | null
          error: string | null
          id: string
          llm_confidence: number | null
          llm_reasoning: string | null
          method: string
          outcome_verified: boolean
          page_url: string | null
          retry_attempt: number
          step_index: number
          step_text: string
          test_run_id: string
          timestamp: string
          verification_result: string | null
        }
        Insert: {
          account_id: string
          action_type: string
          action_value?: string | null
          created_at?: string
          duration_ms?: number
          element_found?: boolean
          element_selector?: string | null
          error?: string | null
          id?: string
          llm_confidence?: number | null
          llm_reasoning?: string | null
          method: string
          outcome_verified?: boolean
          page_url?: string | null
          retry_attempt?: number
          step_index: number
          step_text: string
          test_run_id: string
          timestamp?: string
          verification_result?: string | null
        }
        Update: {
          account_id?: string
          action_type?: string
          action_value?: string | null
          created_at?: string
          duration_ms?: number
          element_found?: boolean
          element_selector?: string | null
          error?: string | null
          id?: string
          llm_confidence?: number | null
          llm_reasoning?: string | null
          method?: string
          outcome_verified?: boolean
          page_url?: string | null
          retry_attempt?: number
          step_index?: number
          step_text?: string
          test_run_id?: string
          timestamp?: string
          verification_result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_run_step_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_step_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_step_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_run_step_logs_test_run_id_fkey"
            columns: ["test_run_id"]
            isOneToOne: false
            referencedRelation: "test_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      test_runs: {
        Row: {
          accessibility_results: Json | null
          account_id: string
          ai_summary: string | null
          api_results: Json | null
          artifacts: Json | null
          bugs: Json | null
          completed_at: string | null
          console_logs: Json | null
          created_at: string | null
          device_config: Json | null
          duration_ms: number | null
          environment: Database["public"]["Enums"]["test_environment"] | null
          error_message: string | null
          error_stack: string | null
          failed_tests: number | null
          github_branch: string | null
          github_commit_sha: string | null
          github_pr_number: number | null
          github_pr_url: string | null
          github_run_id: number | null
          id: string
          network_requests: Json | null
          passed_tests: number | null
          performance_results: Json | null
          preview_url: string | null
          repository_id: string | null
          skipped_tests: number | null
          spec_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["test_run_status"]
          step_log_summary: Json | null
          step_results: Json | null
          step_results_debug: Json | null
          suite_run_id: string | null
          test_results: Json | null
          total_tests: number | null
          updated_at: string | null
        }
        Insert: {
          accessibility_results?: Json | null
          account_id: string
          ai_summary?: string | null
          api_results?: Json | null
          artifacts?: Json | null
          bugs?: Json | null
          completed_at?: string | null
          console_logs?: Json | null
          created_at?: string | null
          device_config?: Json | null
          duration_ms?: number | null
          environment?: Database["public"]["Enums"]["test_environment"] | null
          error_message?: string | null
          error_stack?: string | null
          failed_tests?: number | null
          github_branch?: string | null
          github_commit_sha?: string | null
          github_pr_number?: number | null
          github_pr_url?: string | null
          github_run_id?: number | null
          id?: string
          network_requests?: Json | null
          passed_tests?: number | null
          performance_results?: Json | null
          preview_url?: string | null
          repository_id?: string | null
          skipped_tests?: number | null
          spec_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["test_run_status"]
          step_log_summary?: Json | null
          step_results?: Json | null
          step_results_debug?: Json | null
          suite_run_id?: string | null
          test_results?: Json | null
          total_tests?: number | null
          updated_at?: string | null
        }
        Update: {
          accessibility_results?: Json | null
          account_id?: string
          ai_summary?: string | null
          api_results?: Json | null
          artifacts?: Json | null
          bugs?: Json | null
          completed_at?: string | null
          console_logs?: Json | null
          created_at?: string | null
          device_config?: Json | null
          duration_ms?: number | null
          environment?: Database["public"]["Enums"]["test_environment"] | null
          error_message?: string | null
          error_stack?: string | null
          failed_tests?: number | null
          github_branch?: string | null
          github_commit_sha?: string | null
          github_pr_number?: number | null
          github_pr_url?: string | null
          github_run_id?: number | null
          id?: string
          network_requests?: Json | null
          passed_tests?: number | null
          performance_results?: Json | null
          preview_url?: string | null
          repository_id?: string | null
          skipped_tests?: number | null
          spec_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["test_run_status"]
          step_log_summary?: Json | null
          step_results?: Json | null
          step_results_debug?: Json | null
          suite_run_id?: string | null
          test_results?: Json | null
          total_tests?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_runs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_runs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_runs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_runs_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_runs_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "specs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_runs_suite_run_id_fkey"
            columns: ["suite_run_id"]
            isOneToOne: false
            referencedRelation: "suite_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      test_suites: {
        Row: {
          account_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          run_mode: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          run_mode?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          run_mode?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_suites_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_suites_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_suites_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      test_tags: {
        Row: {
          account_id: string
          color: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          account_id: string
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          account_id?: string
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_tags_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_tags_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_tags_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      method_performance: {
        Row: {
          avg_duration_ms: number | null
          avg_llm_confidence: number | null
          method: string | null
          success_rate: number | null
          successes: number | null
          total_uses: number | null
        }
        Relationships: []
      }
      step_failure_analysis: {
        Row: {
          avg_confidence: number | null
          avg_duration_ms: number | null
          error_types: string[] | null
          failures: number | null
          last_attempt: string | null
          most_used_method: string | null
          step_text: string | null
          successes: number | null
          total_attempts: number | null
        }
        Relationships: []
      }
      user_account_workspace: {
        Row: {
          id: string | null
          name: string | null
          picture_url: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          id: string | null
          name: string | null
          picture_url: string | null
          role: string | null
          slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Functions: {
      accept_invitation: {
        Args: { token: string; user_id: string }
        Returns: string
      }
      add_invitations_to_account: {
        Args: {
          account_slug: string
          invitations: Database["public"]["CompositeTypes"]["invitation"][]
        }
        Returns: Database["public"]["Tables"]["invitations"]["Row"][]
      }
      can_action_account_member: {
        Args: { target_team_account_id: string; target_user_id: string }
        Returns: boolean
      }
      check_email_exists: { Args: { target_email: string }; Returns: boolean }
      check_parallel_limit: {
        Args: { p_account_id: string; p_parallel_limit: number }
        Returns: {
          allowed: boolean
          current_count: number
          limit_count: number
        }[]
      }
      create_invitation: {
        Args: { account_id: string; email: string; role: string }
        Returns: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invite_token: string
          invited_by: string
          role: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "invitations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_nonce: {
        Args: {
          p_expires_in_seconds?: number
          p_metadata?: Json
          p_purpose?: string
          p_revoke_previous?: boolean
          p_scopes?: string[]
          p_user_id?: string
        }
        Returns: Json
      }
      create_team_account: {
        Args: { account_name: string }
        Returns: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          is_enterprise: boolean
          is_personal_account: boolean
          name: string
          onboarding_completed: boolean
          onboarding_step: number
          picture_url: string | null
          primary_owner_user_id: string
          public_data: Json
          qa_trial_ends_at: string | null
          qa_trial_started_at: string | null
          slug: string | null
          updated_at: string | null
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      decrement_parallel_execution: {
        Args: { p_account_id: string }
        Returns: undefined
      }
      generate_share_token: { Args: never; Returns: string }
      get_account_effective_limits: {
        Args: { target_account_id: string }
        Returns: {
          has_override: boolean
          max_team_members: number
          override_expires_at: string
          override_reason: string
          parallel_executions_limit: number
          qa_runs_limit: number
        }[]
      }
      get_account_invitations: {
        Args: { account_slug: string }
        Returns: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invited_by: string
          inviter_email: string
          inviter_name: string
          role: string
          updated_at: string
        }[]
      }
      get_account_members: {
        Args: { account_slug: string }
        Returns: {
          account_id: string
          created_at: string
          email: string
          id: string
          name: string
          picture_url: string
          primary_owner_user_id: string
          role: string
          role_hierarchy_level: number
          updated_at: string
          user_id: string
        }[]
      }
      get_account_product_id: {
        Args: { p_account_id: string }
        Returns: string
      }
      get_config: { Args: never; Returns: Json }
      get_nonce_status: { Args: { p_id: string }; Returns: Json }
      get_qa_trial_days_remaining: {
        Args: { p_account_id: string }
        Returns: number
      }
      get_qa_usage: {
        Args: { p_account_id: string }
        Returns: {
          parallel_current: number
          parallel_limit: number
          period_end: string
          period_start: string
          runs_limit: number
          runs_remaining: number
          runs_used: number
        }[]
      }
      get_upper_system_role: { Args: never; Returns: string }
      has_active_subscription: {
        Args: { target_account_id: string }
        Returns: boolean
      }
      has_more_elevated_role: {
        Args: {
          role_name: string
          target_account_id: string
          target_user_id: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: {
          account_id: string
          permission_name: Database["public"]["Enums"]["app_permissions"]
          user_id: string
        }
        Returns: boolean
      }
      has_role_on_account: {
        Args: { account_id: string; account_role?: string }
        Returns: boolean
      }
      has_same_role_hierarchy_level: {
        Args: {
          role_name: string
          target_account_id: string
          target_user_id: string
        }
        Returns: boolean
      }
      increment_qa_usage: {
        Args: {
          p_account_id: string
          p_parallel_limit: number
          p_qa_runs_limit: number
        }
        Returns: {
          allowed: boolean
          parallel_current: number
          parallel_limit: number
          runs_limit: number
          runs_remaining: number
          runs_used: number
        }[]
      }
      increment_share_view_count: {
        Args: { p_share_id: string }
        Returns: undefined
      }
      is_aal2: { Args: never; Returns: boolean }
      is_account_owner: { Args: { account_id: string }; Returns: boolean }
      is_account_team_member: {
        Args: { target_account_id: string }
        Returns: boolean
      }
      is_mfa_compliant: { Args: never; Returns: boolean }
      is_qa_trial_active: { Args: { p_account_id: string }; Returns: boolean }
      is_set: { Args: { field_name: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      is_team_member: {
        Args: { account_id: string; user_id: string }
        Returns: boolean
      }
      resolve_spec_for_pr: {
        Args: {
          p_account_id: string
          p_body: string
          p_branch: string
          p_labels: string[]
          p_repository_id: string
        }
        Returns: {
          account_id: string
          api_config: Json | null
          approved_at: string | null
          approved_by: string | null
          binding_type: Database["public"]["Enums"]["spec_binding_type"] | null
          binding_value: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          parent_spec_id: string | null
          performance_config: Json | null
          prd_text: string
          repository_id: string | null
          spec_content: Json | null
          status: Database["public"]["Enums"]["spec_status"]
          test_credentials: Json | null
          test_script: string | null
          test_steps: Json | null
          test_type: Database["public"]["Enums"]["test_type"]
          ticket_id: string | null
          ticket_url: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
          version: number
        }[]
        SetofOptions: {
          from: "*"
          to: "specs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      revoke_nonce: {
        Args: { p_id: string; p_reason?: string }
        Returns: boolean
      }
      start_qa_trial: {
        Args: { p_account_id: string; p_duration_days?: number }
        Returns: undefined
      }
      team_account_workspace: {
        Args: { account_slug: string }
        Returns: {
          id: string
          is_enterprise: boolean
          name: string
          permissions: Database["public"]["Enums"]["app_permissions"][]
          picture_url: string
          primary_owner_user_id: string
          role: string
          role_hierarchy_level: number
          slug: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
        }[]
      }
      touch_api_key: { Args: { p_key_hash: string }; Returns: undefined }
      transfer_team_account_ownership: {
        Args: { new_owner_id: string; target_account_id: string }
        Returns: undefined
      }
      upsert_order: {
        Args: {
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          currency: string
          line_items: Json
          status: Database["public"]["Enums"]["payment_status"]
          target_account_id: string
          target_customer_id: string
          target_order_id: string
          total_amount: number
        }
        Returns: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      upsert_subscription: {
        Args: {
          active: boolean
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          currency: string
          line_items: Json
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          target_account_id: string
          target_customer_id: string
          target_subscription_id: string
          trial_ends_at?: string
          trial_starts_at?: string
        }
        Returns: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "subscriptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      validate_api_key: {
        Args: { p_key_hash: string }
        Returns: {
          account_id: string
          scopes: string[]
        }[]
      }
      validate_test_run_share: {
        Args: { p_share_token: string }
        Returns: {
          account_id: string
          error_message: string
          is_valid: boolean
          share_id: string
          test_run_id: string
        }[]
      }
      verify_nonce: {
        Args: {
          p_ip?: unknown
          p_max_verification_attempts?: number
          p_purpose: string
          p_required_scopes?: string[]
          p_token: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_permissions:
        | "roles.manage"
        | "billing.manage"
        | "settings.manage"
        | "members.manage"
        | "invites.manage"
        | "specs.manage"
        | "specs.view"
        | "repositories.manage"
        | "test_runs.view"
        | "api_keys.manage"
      billing_provider: "stripe" | "lemon-squeezy" | "paddle"
      input_request_status: "pending" | "provided" | "expired" | "cancelled"
      input_request_type:
        | "otp"
        | "2fa"
        | "captcha"
        | "security_question"
        | "custom"
      notification_channel: "in_app" | "email"
      notification_type: "info" | "warning" | "error"
      payment_status: "pending" | "succeeded" | "failed"
      spec_binding_type: "label" | "body_regex" | "branch_regex" | "manual"
      spec_status: "draft" | "pending_review" | "approved" | "archived"
      subscription_item_type: "flat" | "per_seat" | "metered"
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "incomplete"
        | "incomplete_expired"
        | "paused"
      test_environment: "development" | "staging" | "uat" | "production"
      test_run_event_type:
        | "test_started"
        | "step_started"
        | "step_completed"
        | "step_failed"
        | "element_found"
        | "element_clicked"
        | "element_filled"
        | "screenshot_captured"
        | "waiting_for_input"
        | "input_received"
        | "navigation"
        | "assertion_passed"
        | "assertion_failed"
        | "error"
        | "test_completed"
      test_run_status:
        | "pending"
        | "running"
        | "passed"
        | "failed"
        | "error"
        | "cancelled"
        | "queued"
        | "waiting_for_input"
      test_type: "ui" | "api" | "performance"
    }
    CompositeTypes: {
      invitation: {
        email: string | null
        role: string | null
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_leaf_prefixes: {
        Args: { bucket_ids: string[]; names: string[] }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_level: { Args: { name: string }; Returns: number }
      get_prefix: { Args: { name: string }; Returns: string }
      get_prefixes: { Args: { name: string }; Returns: string[] }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_permissions: [
        "roles.manage",
        "billing.manage",
        "settings.manage",
        "members.manage",
        "invites.manage",
        "specs.manage",
        "specs.view",
        "repositories.manage",
        "test_runs.view",
        "api_keys.manage",
      ],
      billing_provider: ["stripe", "lemon-squeezy", "paddle"],
      input_request_status: ["pending", "provided", "expired", "cancelled"],
      input_request_type: [
        "otp",
        "2fa",
        "captcha",
        "security_question",
        "custom",
      ],
      notification_channel: ["in_app", "email"],
      notification_type: ["info", "warning", "error"],
      payment_status: ["pending", "succeeded", "failed"],
      spec_binding_type: ["label", "body_regex", "branch_regex", "manual"],
      spec_status: ["draft", "pending_review", "approved", "archived"],
      subscription_item_type: ["flat", "per_seat", "metered"],
      subscription_status: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "paused",
      ],
      test_environment: ["development", "staging", "uat", "production"],
      test_run_event_type: [
        "test_started",
        "step_started",
        "step_completed",
        "step_failed",
        "element_found",
        "element_clicked",
        "element_filled",
        "screenshot_captured",
        "waiting_for_input",
        "input_received",
        "navigation",
        "assertion_passed",
        "assertion_failed",
        "error",
        "test_completed",
      ],
      test_run_status: [
        "pending",
        "running",
        "passed",
        "failed",
        "error",
        "cancelled",
        "queued",
        "waiting_for_input",
      ],
      test_type: ["ui", "api", "performance"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const

