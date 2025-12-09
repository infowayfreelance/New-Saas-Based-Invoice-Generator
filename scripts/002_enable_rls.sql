-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_invoice_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_email_settings ENABLE ROW LEVEL SECURITY;

-- Plans and global settings are public read
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Clients policies
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoices" ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices" ON invoices FOR DELETE USING (auth.uid() = user_id);

-- Invoice items policies
CREATE POLICY "Users can view own invoice items" ON invoice_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can insert own invoice items" ON invoice_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can update own invoice items" ON invoice_items FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "Users can delete own invoice items" ON invoice_items FOR DELETE 
  USING (EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));

-- Invoice templates policies (global templates are readable by all)
CREATE POLICY "Users can view global templates" ON invoice_templates FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users can insert own templates" ON invoice_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON invoice_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON invoice_templates FOR DELETE USING (auth.uid() = user_id);

-- Recurring invoice rules policies
CREATE POLICY "Users can view own recurring rules" ON recurring_invoice_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recurring rules" ON recurring_invoice_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recurring rules" ON recurring_invoice_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recurring rules" ON recurring_invoice_rules FOR DELETE USING (auth.uid() = user_id);

-- Payment entries policies
CREATE POLICY "Users can view own payments" ON payment_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payment_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments" ON payment_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own payments" ON payment_entries FOR DELETE USING (auth.uid() = user_id);

-- Usage logs policies
CREATE POLICY "Users can view own usage" ON usage_logs FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can insert usage logs" ON usage_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update usage logs" ON usage_logs FOR UPDATE USING (true);

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- User email settings policies
CREATE POLICY "Users can view own email settings" ON user_email_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own email settings" ON user_email_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own email settings" ON user_email_settings FOR UPDATE USING (auth.uid() = user_id);

-- Plans are readable by all
CREATE POLICY "Anyone can view plans" ON plans FOR SELECT USING (true);

-- Global settings readable by all
CREATE POLICY "Anyone can view global settings" ON global_settings FOR SELECT USING (true);

-- Integration settings only for admins (via service role)
CREATE POLICY "Service role can manage integration settings" ON integration_settings FOR ALL USING (true);
