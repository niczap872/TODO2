# Troubleshooting

If you're experiencing issues with the Todo application, here are some common problems and solutions:

## 403 Forbidden Errors When Adding/Accessing Todos

This usually indicates an issue with authentication or Row Level Security (RLS) in Supabase.

### Check Authentication
1. Make sure you've successfully signed in with Google
2. Check the browser console for authentication errors
3. Verify that your Google OAuth is properly set up in Supabase

### Check Row Level Security (RLS)
1. Go to Supabase dashboard
2. Navigate to the SQL editor
3. Run the queries in `verify-rls.sql` to check if RLS is enabled properly
4. If RLS is not enabled or policies are missing, run the SQL from `paste.txt` again

### Check Database Schema
1. Ensure the todos table has a `user_id` column
2. Verify that the schemas match what's in `paste.txt`

## Next.js Image Component Warnings

If you see warnings about legacy props like "layout" or "objectFit" for the Next.js Image component:

1. Make sure you've updated the components as described in this troubleshooting guide
2. Use `fill` instead of `layout="fill"`
3. Use `style={{ objectFit: "cover" }}` instead of `objectFit="cover"`

## Manual Schema Setup

If the script doesn't work, you can manually set up the schema:

1. Navigate to the Supabase dashboard
2. Go to the SQL editor
3. Paste the contents of `paste.txt`
4. Run the SQL

## Manual Google OAuth Setup

1. Create OAuth credentials in Google Cloud Console
2. Set the redirect URI to `https://your-supabase-project.supabase.co/auth/v1/callback`
3. In Supabase dashboard, go to Authentication → Providers
4. Enable Google provider and enter your Client ID and Client Secret

## Check for Network Issues

If you see network errors in the console:

1. Verify your Supabase URL and anon key in `.env.local`
2. Make sure your Supabase project is active
3. Check if there are CORS issues (look for CORS errors in the console)
