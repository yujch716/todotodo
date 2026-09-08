export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      calendar_event: {
        Row: {
          category_id: string | null;
          created_at: string | null;
          description: string | null;
          end_at: string;
          id: string;
          is_all_day: boolean;
          start_at: string;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_at: string;
          id?: string;
          is_all_day?: boolean;
          start_at: string;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_at?: string;
          id?: string;
          is_all_day?: boolean;
          start_at?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_event_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          },
        ];
      };
      category: {
        Row: {
          color: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          color: string;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          color?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_log: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          is_completed: boolean | null;
          memo: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          is_completed?: boolean | null;
          memo?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          is_completed?: boolean | null;
          memo?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_timetable: {
        Row: {
          category_id: string | null;
          content: string;
          created_at: string | null;
          daily_log_id: string;
          end_notified_at: string | null;
          end_time: string;
          id: string;
          start_notified_at: string | null;
          start_time: string;
          updated_at: string | null;
        };
        Insert: {
          category_id?: string | null;
          content: string;
          created_at?: string | null;
          daily_log_id: string;
          end_notified_at?: string | null;
          end_time: string;
          id?: string;
          start_notified_at?: string | null;
          start_time: string;
          updated_at?: string | null;
        };
        Update: {
          category_id?: string | null;
          content?: string;
          created_at?: string | null;
          daily_log_id?: string;
          end_notified_at?: string | null;
          end_time?: string;
          id?: string;
          start_notified_at?: string | null;
          start_time?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "daily_timeline_daily_log_fkey";
            columns: ["daily_log_id"];
            isOneToOne: false;
            referencedRelation: "daily_log";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_timetable_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_todo: {
        Row: {
          content: string;
          created_at: string | null;
          daily_log_id: string;
          group_id: string;
          id: string;
          is_checked: boolean | null;
          order_index: number;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          daily_log_id: string;
          group_id: string;
          id?: string;
          is_checked?: boolean | null;
          order_index?: number;
          user_id?: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          daily_log_id?: string;
          group_id?: string;
          id?: string;
          is_checked?: boolean | null;
          order_index?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "checklist_item_checklist_id_fkey";
            columns: ["daily_log_id"];
            isOneToOne: false;
            referencedRelation: "daily_log";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_todo_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "daily_todo_group";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_todo_group: {
        Row: {
          category_id: string | null;
          created_at: string | null;
          daily_log_id: string;
          id: string;
          sort_order: number | null;
          title: string;
          user_id: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string | null;
          daily_log_id: string;
          id?: string;
          sort_order?: number | null;
          title: string;
          user_id?: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string | null;
          daily_log_id?: string;
          id?: string;
          sort_order?: number | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_todo_group_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_todo_group_daily_log_id_fkey";
            columns: ["daily_log_id"];
            isOneToOne: false;
            referencedRelation: "daily_log";
            referencedColumns: ["id"];
          },
        ];
      };
      goal: {
        Row: {
          created_at: string | null;
          emoji: string;
          end_date: string | null;
          group_id: string | null;
          id: string;
          repeat_days: string[] | null;
          start_date: string | null;
          status: string;
          target_value: number | null;
          title: string;
          type: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          emoji?: string;
          end_date?: string | null;
          group_id?: string | null;
          id?: string;
          repeat_days?: string[] | null;
          start_date?: string | null;
          status?: string;
          target_value?: number | null;
          title: string;
          type: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          emoji?: string;
          end_date?: string | null;
          group_id?: string | null;
          id?: string;
          repeat_days?: string[] | null;
          start_date?: string | null;
          status?: string;
          target_value?: number | null;
          title?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "challenge_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "goal_group";
            referencedColumns: ["id"];
          },
        ];
      };
      goal_checklist_item: {
        Row: {
          content: string;
          created_at: string | null;
          goal_id: string;
          id: string;
          is_checked: boolean;
          order_index: number;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          goal_id: string;
          id?: string;
          is_checked?: boolean;
          order_index?: number;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          goal_id?: string;
          id?: string;
          is_checked?: boolean;
          order_index?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goal_checklist_item_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goal";
            referencedColumns: ["id"];
          },
        ];
      };
      goal_group: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      goal_log: {
        Row: {
          created_at: string | null;
          date: string;
          goal_id: string;
          id: string;
          memo: string | null;
          user_id: string;
          value: number | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          goal_id: string;
          id?: string;
          memo?: string | null;
          user_id: string;
          value?: number | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          goal_id?: string;
          id?: string;
          memo?: string | null;
          user_id?: string;
          value?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "goal_log_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goal";
            referencedColumns: ["id"];
          },
        ];
      };
      memo: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          auth: string;
          created_at: string;
          endpoint: string;
          id: string;
          p256dh: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          auth: string;
          created_at?: string;
          endpoint: string;
          id?: string;
          p256dh: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          auth?: string;
          created_at?: string;
          endpoint?: string;
          id?: string;
          p256dh?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      due_timetable_notifications: {
        Args: { p_from: string; p_to: string };
        Returns: {
          content: string;
          daily_log_id: string;
          kind: string;
          timetable_id: string;
          user_id: string;
        }[];
      };
      timetable_slot_at: {
        Args: { p_date: string; p_time: string };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
