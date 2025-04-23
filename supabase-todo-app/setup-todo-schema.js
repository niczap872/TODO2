#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    console.log('\n=== Supabase Todo Schema Setup ===\n');
    
    // Get Supabase credentials
    const supabaseUrl = await question('Enter your Supabase URL: ');
    const supabaseKey = await question('Enter your Supabase service_role key: ');
    
    // Initialize Supabase client with service_role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('\nReading SQL schema...');
    const sql = fs.readFileSync('./paste.txt', 'utf8');
    
    console.log('Applying SQL schema to Supabase...');
    const { error } = await supabase.rpc('pgclient_exec', { query: sql });
    
    if (error) {
      throw error;
    }
    
    console.log('\n✅ Todo schema setup complete!');
    console.log('\nNext steps:');
    console.log('1. Set up Google OAuth using "./setup-google-auth.js"');
    console.log('2. Start your Next.js application with "npm run dev"');
    console.log('3. Try signing in with Google and creating tasks\n');
    
  } catch (error) {
    console.error('\n❌ Error setting up schema:', error.message);
    console.log('\nTip: You might need to manually run the SQL through the Supabase dashboard SQL editor.');
  } finally {
    rl.close();
  }
}

main();
