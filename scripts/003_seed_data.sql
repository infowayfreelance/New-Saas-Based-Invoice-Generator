-- Seed plans
INSERT INTO plans (name, code, price_monthly, invoice_limit_per_day, invoice_limit_per_month, features_json) VALUES
('Guest', 'GUEST', 0, 3, 15, '{"download_pdf": true, "send_email": false, "save_clients": false, "templates": ["minimal"], "analytics": false, "recurring": false, "payment_tracking": false}'::jsonb),
('Basic', 'BASIC', 5.00, 5, 30, '{"download_pdf": true, "send_email": true, "save_clients": false, "templates": ["minimal"], "analytics": false, "recurring": false, "payment_tracking": false}'::jsonb),
('Standard', 'STANDARD', 12.00, NULL, NULL, '{"download_pdf": true, "send_email": true, "save_clients": true, "templates": ["minimal", "classic", "modern"], "analytics": "basic", "recurring": false, "payment_tracking": false, "logo_upload": true, "branding": true}'::jsonb),
('Pro', 'PRO', 29.99, NULL, NULL, '{"download_pdf": true, "send_email": true, "save_clients": true, "templates": ["minimal", "classic", "modern", "premium", "elegant"], "analytics": "full", "recurring": true, "payment_tracking": true, "logo_upload": true, "branding": true, "watermark": true, "signature": true, "auto_reminders": true}'::jsonb)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  price_monthly = EXCLUDED.price_monthly,
  invoice_limit_per_day = EXCLUDED.invoice_limit_per_day,
  invoice_limit_per_month = EXCLUDED.invoice_limit_per_month,
  features_json = EXCLUDED.features_json;

-- Seed global settings
INSERT INTO global_settings (id, free_guest_daily_limit, free_guest_monthly_limit, basic_daily_limit, basic_monthly_limit)
VALUES ('00000000-0000-0000-0000-000000000001', 3, 15, 5, 30)
ON CONFLICT (id) DO NOTHING;

-- Seed default invoice templates (global)
INSERT INTO invoice_templates (id, user_id, name, is_default, layout_config, primary_color, accent_color, min_plan) VALUES
('00000000-0000-0000-0000-000000000001', NULL, 'Minimal', true, '{"style": "minimal", "showLogo": true, "showWatermark": false}'::jsonb, '#000000', '#3b82f6', 'BASIC'),
('00000000-0000-0000-0000-000000000002', NULL, 'Classic', false, '{"style": "classic", "showLogo": true, "showWatermark": false}'::jsonb, '#1f2937', '#059669', 'STANDARD'),
('00000000-0000-0000-0000-000000000003', NULL, 'Modern', false, '{"style": "modern", "showLogo": true, "showWatermark": false}'::jsonb, '#0f172a', '#8b5cf6', 'STANDARD'),
('00000000-0000-0000-0000-000000000004', NULL, 'Premium', false, '{"style": "premium", "showLogo": true, "showWatermark": true}'::jsonb, '#18181b', '#f59e0b', 'PRO'),
('00000000-0000-0000-0000-000000000005', NULL, 'Elegant', false, '{"style": "elegant", "showLogo": true, "showWatermark": true}'::jsonb, '#292524', '#ec4899', 'PRO')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  layout_config = EXCLUDED.layout_config,
  primary_color = EXCLUDED.primary_color,
  accent_color = EXCLUDED.accent_color,
  min_plan = EXCLUDED.min_plan;
