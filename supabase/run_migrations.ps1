# PowerShell script to run Supabase migrations

# Check if supabase CLI is installed
$supabaseCommand = Get-Command supabase -ErrorAction SilentlyContinue
if ($null -eq $supabaseCommand) {
    Write-Host "Supabase CLI is not installed. Please install it first."
    Write-Host "Run: npm install -g supabase"
    exit 1
}

# Navigate to the project root (assuming this script is in the supabase directory)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "..")

# Apply migrations
Write-Host "Applying Supabase migrations..."
supabase db push

Write-Host "Migrations completed!" 