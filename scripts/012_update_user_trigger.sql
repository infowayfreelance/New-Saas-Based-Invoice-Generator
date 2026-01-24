-- Updated function to handle new user registration with country and currencies
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  basic_plan_id UUID;
  user_country_code TEXT;
  user_city TEXT;
  user_default_currency TEXT;
BEGIN
  -- Get the Basic plan ID (new users start with Basic for trial)
  SELECT id INTO basic_plan_id FROM plans WHERE code = 'BASIC' LIMIT 1;
  
  -- Extract country_code, city, and default_currency from metadata
  user_country_code := COALESCE(NEW.raw_user_meta_data ->> 'country_code', 'US');
  user_city := NEW.raw_user_meta_data ->> 'city';
  user_default_currency := COALESCE(NEW.raw_user_meta_data ->> 'default_currency', 'USD');
  
  -- Insert into users table
  INSERT INTO public.users (id, email, name, plan_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NULL),
    basic_plan_id,
    'USER'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create default user settings with country and city
  INSERT INTO public.user_settings (user_id, default_currency, country_code, city, theme)
  VALUES (NEW.id, user_default_currency, user_country_code, user_city, 'SYSTEM')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default email settings
  INSERT INTO public.user_email_settings (user_id, use_system_email, reply_to_email)
  VALUES (NEW.id, true, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default enabled currencies (user's country currency + USD, GBP, EUR)
  -- Insert user's default currency
  INSERT INTO public.user_currencies (user_id, currency_code, is_default)
  VALUES (NEW.id, user_default_currency, true)
  ON CONFLICT (user_id, currency_code) DO NOTHING;
  
  -- Insert USD if not already added
  IF user_default_currency != 'USD' THEN
    INSERT INTO public.user_currencies (user_id, currency_code, is_default)
    VALUES (NEW.id, 'USD', false)
    ON CONFLICT (user_id, currency_code) DO NOTHING;
  END IF;
  
  -- Insert GBP if not already added
  IF user_default_currency != 'GBP' THEN
    INSERT INTO public.user_currencies (user_id, currency_code, is_default)
    VALUES (NEW.id, 'GBP', false)
    ON CONFLICT (user_id, currency_code) DO NOTHING;
  END IF;
  
  -- Insert EUR if not already added
  IF user_default_currency != 'EUR' THEN
    INSERT INTO public.user_currencies (user_id, currency_code, is_default)
    VALUES (NEW.id, 'EUR', false)
    ON CONFLICT (user_id, currency_code) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
