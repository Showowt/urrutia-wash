// ═══════════════════════════════════════════════════════
// URRUTIA — Database Types
// Hand-written to match Supabase generated type format.
// After first deploy: npx supabase gen types typescript
// --project-id $PROJECT_ID > src/types/database.ts
// ═══════════════════════════════════════════════════════

export type MembershipTier = "SOLO" | "DUO" | "FLEET";
export type MembershipStatus = "active" | "paused" | "cancelled";
export type ServiceType = "express" | "classic" | "detail" | "ceramic";
export type LocationType = "lvac" | "mobile";
export type WashStatus =
  | "queued"
  | "started"
  | "washing"
  | "detailing"
  | "finishing"
  | "ready"
  | "complete";
export type ReferralStatus = "pending" | "completed" | "expired";

// Re-exported convenience types derived from the Database map below
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type Wash = Database["public"]["Tables"]["washes"]["Row"];
export type Membership = Database["public"]["Tables"]["memberships"]["Row"];
export type Referral = Database["public"]["Tables"]["referrals"]["Row"];
export type SmsLog = Database["public"]["Tables"]["sms_log"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

// ═══ Database schema map ═══════════════════════════════
// Format mirrors `npx supabase gen types typescript` output exactly.
// __InternalSupabase is required by @supabase/supabase-js v2.105+
// to auto-resolve PostgrestVersion without an explicit client option.
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string;
          name: string | null;
          email: string | null;
          membership_tier: MembershipTier | null;
          membership_started_at: string | null;
          membership_renews_at: string | null;
          punch_count: number;
          referral_code: string | null;
          referred_by: string | null;
          referral_credit_cents: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          name?: string | null;
          email?: string | null;
          membership_tier?: MembershipTier | null;
          membership_started_at?: string | null;
          membership_renews_at?: string | null;
          punch_count?: number;
          referral_code?: string | null;
          referred_by?: string | null;
          referral_credit_cents?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          name?: string | null;
          email?: string | null;
          membership_tier?: MembershipTier | null;
          membership_started_at?: string | null;
          membership_renews_at?: string | null;
          punch_count?: number;
          referral_code?: string | null;
          referred_by?: string | null;
          referral_credit_cents?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          year: number | null;
          make: string | null;
          model: string | null;
          color: string | null;
          plate: string;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          year?: number | null;
          make?: string | null;
          model?: string | null;
          color?: string | null;
          plate: string;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          year?: number | null;
          make?: string | null;
          model?: string | null;
          color?: string | null;
          plate?: string;
          is_primary?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      washes: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string | null;
          service_type: ServiceType;
          location: LocationType;
          mobile_address: string | null;
          scheduled_for: string | null;
          status: WashStatus;
          status_updated_at: string;
          amount_cents: number | null;
          tip_cents: number;
          before_photo_url: string | null;
          after_photo_url: string | null;
          detailer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_id?: string | null;
          service_type: ServiceType;
          location: LocationType;
          mobile_address?: string | null;
          scheduled_for?: string | null;
          status?: WashStatus;
          status_updated_at?: string;
          amount_cents?: number | null;
          tip_cents?: number;
          before_photo_url?: string | null;
          after_photo_url?: string | null;
          detailer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vehicle_id?: string | null;
          service_type?: ServiceType;
          location?: LocationType;
          mobile_address?: string | null;
          scheduled_for?: string | null;
          status?: WashStatus;
          status_updated_at?: string;
          amount_cents?: number | null;
          tip_cents?: number;
          before_photo_url?: string | null;
          after_photo_url?: string | null;
          detailer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string | null;
          tier: MembershipTier;
          status: MembershipStatus;
          current_period_end: string | null;
          washes_used_this_cycle: number;
          washes_allowed_this_cycle: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id?: string | null;
          tier: MembershipTier;
          status: MembershipStatus;
          current_period_end?: string | null;
          washes_used_this_cycle?: number;
          washes_allowed_this_cycle?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string | null;
          tier?: MembershipTier;
          status?: MembershipStatus;
          current_period_end?: string | null;
          washes_used_this_cycle?: number;
          washes_allowed_this_cycle?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referee_id: string;
          status: ReferralStatus;
          credit_amount_cents: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referee_id: string;
          status?: ReferralStatus;
          credit_amount_cents?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referee_id?: string;
          status?: ReferralStatus;
          credit_amount_cents?: number;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      sms_log: {
        Row: {
          id: string;
          user_id: string | null;
          wash_id: string | null;
          template: string | null;
          body: string | null;
          twilio_sid: string | null;
          sent_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          wash_id?: string | null;
          template?: string | null;
          body?: string | null;
          twilio_sid?: string | null;
          sent_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          wash_id?: string | null;
          template?: string | null;
          body?: string | null;
          twilio_sid?: string | null;
          sent_at?: string;
        };
        Relationships: [];
      };
      promo_codes: {
        Row: {
          id: string;
          phone: string;
          code: string;
          discount_percent: number;
          free_addon: string | null;
          used: boolean;
          used_at: string | null;
          order_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          code: string;
          discount_percent?: number;
          free_addon?: string | null;
          used?: boolean;
          used_at?: string | null;
          order_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          code?: string;
          discount_percent?: number;
          free_addon?: string | null;
          used?: boolean;
          used_at?: string | null;
          order_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          name: string;
          text: string;
          stars: number;
          ago: string;
          vehicle: string | null;
          source: string;
          featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          text: string;
          stars?: number;
          ago?: string;
          vehicle?: string | null;
          source?: string;
          featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          text?: string;
          stars?: number;
          ago?: string;
          vehicle?: string | null;
          source?: string;
          featured?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
