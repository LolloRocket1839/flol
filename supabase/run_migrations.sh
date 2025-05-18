#!/bin/bash

# This script runs all pending Supabase migrations

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "Supabase CLI is not installed. Please install it first."
    echo "Run: npm install -g supabase"
    exit 1
fi

# Navigate to the project root (assuming this script is in the supabase directory)
cd "$(dirname "$0")"/..

# Apply migrations
echo "Applying Supabase migrations..."
supabase db push

echo "Migrations completed!" 