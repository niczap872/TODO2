#!/bin/bash

echo "=== Taskify Todo App Setup ==="
echo

# Install dependencies
echo "Installing dependencies..."
npm install

# Setup Supabase schema
echo "Setting up Supabase schema..."
node setup-todo-schema.js

# Setup Google OAuth
echo "Setting up Google OAuth..."
node setup-google-auth.js

echo
echo "Setup complete! Run 'npm run dev' to start the application."
