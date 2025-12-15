# Supabase Configuration

This application is designed to work with **any** Supabase project through environment variables only.

## Environment Variables Required

Add these two environment variables to connect your Supabase project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Where to Add Environment Variables

### In v0
1. Open the in-chat sidebar
2. Go to "Vars" section
3. Add both environment variables

### In Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add both variables for all environments (Production, Preview, Development)

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Setup

After connecting your Supabase project, run the SQL migration scripts in order:

1. `scripts/001_create_tables.sql` - Creates all database tables
2. `scripts/002_enable_rls.sql` - Enables Row Level Security
3. `scripts/003_seed_data.sql` - Adds initial data (plans, templates)
4. `scripts/004_create_user_trigger.sql` - Auto-creates user profiles

## No Integration Lock-In

This app does NOT use v0's auto-configured Supabase integration. You have complete control over which Supabase project to connect by simply updating the environment variables.
