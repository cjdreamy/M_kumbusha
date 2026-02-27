// Database types matching Supabase schema

export type UserRole = 'caregiver' | 'admin';

export type RelationshipType = 
  | 'employed_caregiver' 
  | 'relative' 
  | 'next_of_kin' 
  | 'family_member' 
  | 'friend' 
  | 'other';

export type ReminderChannel = 'sms' | 'voice' | 'both';

export type ReminderStatus = 
  | 'pending' 
  | 'sent' 
  | 'delivered' 
  | 'failed' 
  | 'confirmed' 
  | 'missed';

export type LanguageType = 'english' | 'kiswahili';

export type FrequencyType = 'daily' | 'weekly' | 'custom';

export type ScheduleType = 'medication' | 'exercise' | 'appointment' | 'custom';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  phone_number: string | null;
  backup_contact: string | null;
  relationship: RelationshipType | null;
  employment_status: string | null;
  emergency_contact: string | null;
  notification_forwarding_number: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Elderly {
  id: string;
  caregiver_id: string;
  full_name: string;
  age: number | null;
  primary_contact: string | null;
  secondary_contact: string | null;
  medical_conditions: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  elderly_id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  elderly_id: string;
  title: string;
  description: string | null;
  schedule_type: ScheduleType;
  frequency: FrequencyType;
  time_of_day: string;
  days_of_week: number[] | null;
  custom_dates: string[] | null;
  channel: ReminderChannel;
  language: LanguageType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  schedule_id: string;
  elderly_id: string;
  scheduled_time: string;
  status: ReminderStatus;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

export interface ReminderLog {
  id: string;
  reminder_id: string;
  elderly_id: string;
  caregiver_id: string;
  channel: ReminderChannel;
  status: ReminderStatus;
  message: string | null;
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  confirmed_at: string | null;
  created_at: string;
}

// Extended types with relations
export interface ElderlyWithDetails extends Elderly {
  medications?: Medication[];
  schedules?: Schedule[];
  caregiver?: Profile;
}

export interface ScheduleWithElderly extends Schedule {
  elderly?: Elderly;
}

export interface ReminderLogWithDetails extends ReminderLog {
  elderly?: Elderly;
  caregiver?: Profile;
}

// Form types
export interface ElderlyFormData {
  full_name: string;
  age: number | null;
  primary_contact: string;
  secondary_contact: string;
  medical_conditions: string[];
  notes: string;
}

export interface ScheduleFormData {
  elderly_id: string;
  title: string;
  description: string;
  schedule_type: ScheduleType;
  frequency: FrequencyType;
  time_of_day: string;
  days_of_week: number[];
  custom_dates: string[];
  channel: ReminderChannel;
  language: LanguageType;
  is_active: boolean;
}

export interface ProfileFormData {
  full_name: string;
  phone_number: string;
  backup_contact: string;
  relationship: RelationshipType;
  employment_status: string;
  emergency_contact: string;
  notification_forwarding_number: string;
}

// Dashboard stats
export interface DashboardStats {
  total_elderly: number;
  active_schedules: number;
  pending_reminders: number;
  missed_reminders_today: number;
  reminders_sent_today: number;
  confirmed_reminders_today: number;
}
