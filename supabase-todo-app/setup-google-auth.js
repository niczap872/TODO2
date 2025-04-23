#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    console.log('\n=== Supabase Google OAuth Setup ===\n');
    
    // Get Supabase credentials
    const supabaseUrl = await question('Enter your Supabase URL: ');
    const supabaseKey = await question('Enter your Supabase service_role key: ');
    
    // Get Google credentials
    console.log('\nYou need to create OAuth credentials in the Google Cloud Console:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a new project or select an existing one');
    console.log('3. Go to "APIs & Services" > "Credentials"');
    console.log('4. Click "Create Credentials" > "OAuth client ID"');
    console.log('5. Set Application Type to "Web application"');
    console.log(`6. Add this redirect URI: ${supabaseUrl}/auth/v1/callback\n`);
    
    const clientId = await question('Enter your Google Client ID: ');
    const clientSecret = await question('Enter your Google Client Secret: ');
    
    // Initialize Supabase client with service_role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('\nUpdating Supabase auth settings...');
    
    // Update auth settings with Google provider
    const { error } = await supabase.auth.admin.updateConfig({
      providers: {
        google: {
          enabled: true,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: `${supabaseUrl}/auth/v1/callback`,
        }
      }
    });
    
    if (error) {
      throw error;
    }
    
    console.log('\n✅ Google OAuth setup complete!');
    console.log('\nNext steps:');
    console.log('1. Make sure your Supabase database has RLS policies configured');
    console.log('2. Start your Next.js application with "npm run dev"');
    console.log('3. Try signing in with Google\n');
    
  } catch (error) {
    console.error('\n❌ Error setting up Google OAuth:', error.message);
  } finally {
    rl.close();
  }
}

main();
