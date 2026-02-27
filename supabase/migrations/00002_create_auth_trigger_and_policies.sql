-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (format: username@miaoda.com)
  INSERT INTO public.profiles (id, username, full_name, phone_number, role)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.phone,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'caregiver'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Create public view for shareable profile info
CREATE VIEW public_profiles AS
  SELECT id, username, full_name, role FROM profiles;

-- RLS Policies for elderly
ALTER TABLE public.elderly ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all elderly" ON public.elderly
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Caregivers can view their own elderly" ON public.elderly
  FOR SELECT TO authenticated USING (caregiver_id = auth.uid());

CREATE POLICY "Caregivers can insert their own elderly" ON public.elderly
  FOR INSERT TO authenticated WITH CHECK (caregiver_id = auth.uid());

CREATE POLICY "Caregivers can update their own elderly" ON public.elderly
  FOR UPDATE TO authenticated USING (caregiver_id = auth.uid());

CREATE POLICY "Caregivers can delete their own elderly" ON public.elderly
  FOR DELETE TO authenticated USING (caregiver_id = auth.uid());

-- RLS Policies for medications
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view medications for their elderly" ON public.medications
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = medications.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "Users can insert medications for their elderly" ON public.medications
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = medications.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "Users can update medications for their elderly" ON public.medications
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = medications.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "Users can delete medications for their elderly" ON public.medications
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = medications.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

-- RLS Policies for schedules
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view schedules for their elderly" ON public.schedules
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = schedules.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "Users can insert schedules for their elderly" ON public.schedules
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = schedules.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "Users can update schedules for their elderly" ON public.schedules
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = schedules.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

CREATE POLICY "Users can delete schedules for their elderly" ON public.schedules
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = schedules.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

-- RLS Policies for reminders
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reminders for their elderly" ON public.reminders
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM elderly e
      WHERE e.id = reminders.elderly_id
      AND (e.caregiver_id = auth.uid() OR is_admin(auth.uid()))
    )
  );

-- RLS Policies for reminder_logs
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs for their elderly" ON public.reminder_logs
  FOR SELECT TO authenticated USING (
    caregiver_id = auth.uid() OR is_admin(auth.uid())
  );

CREATE POLICY "System can insert reminder logs" ON public.reminder_logs
  FOR INSERT TO authenticated WITH CHECK (true);