const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zdnjnaffaqifqumedsix.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkbmpuYWZmYXFpZnF1bWVkc2l4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0NzE2OCwiZXhwIjoyMDk3NTIzMTY4fQ.znehb6D0YITIrk0RBeO4rfcBeAG8l3_slX1Ei5cS9KU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setup() {
  console.log('Creating test user...');

  const { data: user, error } = await supabase.auth.admin.createUser({
    email: 'test@entreprise.ma',
    password: 'Test123456',
    email_confirm: true,
    user_metadata: { full_name: 'Test Entreprise' },
  });

  if (error) {
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('User created successfully!');
  console.log('Email: test@entreprise.ma');
  console.log('Password: Test123456');
  console.log('User ID:', user.user.id);

  console.log('\nDatabase setup instructions:');
  console.log('=============================');
  console.log('1. Go to https://supabase.com/dashboard/project/zdnjnaffaqifqumedsix/sql/new');
  console.log('2. Open the file supabase-schema.sql');
  console.log('3. Copy all content and paste it in the SQL editor');
  console.log('4. Click "Run" or Ctrl+Enter');
}

setup();
