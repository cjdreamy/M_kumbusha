-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('caregiver', 'admin');

-- Create relationship enum
CREATE TYPE public.relationship_type AS ENUM ('employed_caregiver', 'relative', 'next_of_kin', 'family_member', 'friend', 'other');

-- Create reminder channel enum
CREATE TYPE public.reminder_channel AS ENUM ('sms', 'voice', 'both');

-- Create reminder status enum
CREATE TYPE public.reminder_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'confirmed', 'missed');

-- Create language enum
CREATE TYPE public.language_type AS ENUM ('english', 'kiswahili');

-- Create frequency enum
CREATE TYPE public.frequency_type AS ENUM ('daily', 'weekly', 'custom');

-- Create profiles table (synced with auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone_number text,
  backup_contact text,
  relationship relationship_type,
  employment_status text,
  emergency_contact text,
  notification_forwarding_number text,
  role user_role NOT NULL DEFAULT 'caregiver'::user_role,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create elderly table
CREATE TABLE public.elderly (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  age int,
  primary_contact text,
  secondary_contact text,
  medical_conditions text[],
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create medications table
CREATE TABLE public.medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid NOT NULL REFERENCES public.elderly(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text,
  frequency text,
  instructions text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create schedules table (for reminders)
CREATE TABLE public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  elderly_id uuid NOT NULL REFERENCES public.elderly(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  schedule_type text NOT NULL, -- 'medication', 'exercise', 'appointment', 'custom'
  frequency frequency_type NOT NULL DEFAULT 'daily'::frequency_type,
  time_of_day time NOT NULL,
  days_of_week int[], -- 0=Sunday, 1=Monday, etc. NULL for daily
  custom_dates date[], -- for custom frequency
  channel reminder_channel NOT NULL DEFAULT 'sms'::reminder_channel,
  language language_type NOT NULL DEFAULT 'english'::language_type,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create reminders table (individual reminder instances)
CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  elderly_id uuid NOT NULL REFERENCES public.elderly(id) ON DELETE CASCADE,
  scheduled_time timestamptz NOT NULL,
  status reminder_status NOT NULL DEFAULT 'pending'::reminder_status,
  retry_count int NOT NULL DEFAULT 0,
  max_retries int NOT NULL DEFAULT 3,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create reminder_logs table (for tracking all reminder attempts)
CREATE TABLE public.reminder_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id uuid NOT NULL REFERENCES public.reminders(id) ON DELETE CASCADE,
  elderly_id uuid NOT NULL REFERENCES public.elderly(id) ON DELETE CASCADE,
  caregiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  channel reminder_channel NOT NULL,
  status reminder_status NOT NULL,
  message text,
  error_message text,
  sent_at timestamptz,
  delivered_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_elderly_caregiver ON public.elderly(caregiver_id);
CREATE INDEX idx_medications_elderly ON public.medications(elderly_id);
CREATE INDEX idx_schedules_elderly ON public.schedules(elderly_id);
CREATE INDEX idx_schedules_active ON public.schedules(is_active);
CREATE INDEX idx_reminders_schedule ON public.reminders(schedule_id);
CREATE INDEX idx_reminders_status ON public.reminders(status);
CREATE INDEX idx_reminders_scheduled_time ON public.reminders(scheduled_time);
CREATE INDEX idx_reminder_logs_reminder ON public.reminder_logs(reminder_id);
CREATE INDEX idx_reminder_logs_elderly ON public.reminder_logs(elderly_id);
CREATE INDEX idx_reminder_logs_caregiver ON public.reminder_logs(caregiver_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_elderly_updated_at BEFORE UPDATE ON public.elderly
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON public.schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON public.reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();