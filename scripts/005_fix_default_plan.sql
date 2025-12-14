-- Fix: New users should default to GUEST plan, not BASIC
-- This migration updates the trigger to assign the FREE (GUEST) plan to new users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  guest_plan_id UUID;
BEGIN
  -- Get the Guest plan ID (new users start with FREE plan)
  SELECT id INTO guest_plan_id FROM plans WHERE code = 'GUEST' LIMIT 1;
  
  -- Insert into users table
  INSERT INTO public.users (id, email, name, plan_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NULL),
    guest_plan_id, -- Assign GUEST plan instead of BASIC
    'USER'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create default user settings
  INSERT INTO public.user_settings (user_id, default_currency, theme)
  VALUES (NEW.id, 'USD', 'SYSTEM')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default email settings
  INSERT INTO public.user_email_settings (user_id, use_system_email, reply_to_email)
  VALUES (NEW.id, true, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger to ensure the updated function is used
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
