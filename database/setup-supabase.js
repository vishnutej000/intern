const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Supabase configuration
const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...');

  try {
    // Check if tables exist by trying to query them
    console.log('📋 Checking existing tables...');
    
    const { data: incidents } = await supabase.from('incidents').select('count').limit(1);
    const { data: cameras } = await supabase.from('cameras').select('count').limit(1);
    const { data: users } = await supabase.from('users').select('count').limit(1);

    if (incidents !== null) {
      console.log('✅ incidents table exists');
    }
    if (cameras !== null) {
      console.log('✅ cameras table exists');
    }
    if (users !== null) {
      console.log('✅ users table exists');
    }

    // Insert sample data if tables are empty
    await insertSampleData();

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n📝 Please run the SQL schema manually in your Supabase dashboard:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor');
    console.log('   4. Run the contents of database/schema.sql');
  }
}

async function insertSampleData() {
  console.log('📊 Inserting sample data...');

  try {
    // Insert cameras if table is empty
    const { data: existingCameras } = await supabase.from('cameras').select('id').limit(1);
    if (!existingCameras || existingCameras.length === 0) {
      const { error: cameraError } = await supabase.from('cameras').insert([
        { name: 'Camera - 01', location: 'Shop Floor A', image_url: '/images/cam1.gif' },
        { name: 'Camera - 02', location: 'Shop Floor B', image_url: '/images/cam2.gif' },
        { name: 'Camera - 03', location: 'Shop Floor C', image_url: '/images/cam3.gif' }
      ]);
      
      if (cameraError) {
        console.error('❌ Error inserting cameras:', cameraError.message);
      } else {
        console.log('✅ Sample cameras inserted');
      }
    } else {
      console.log('ℹ️  Cameras already exist, skipping...');
    }

    // Insert incidents if table is empty
    const { data: existingIncidents } = await supabase.from('incidents').select('id').limit(1);
    if (!existingIncidents || existingIncidents.length === 0) {
      const { error: incidentError } = await supabase.from('incidents').insert([
        {
          type: 'Unauthorised Access',
          camera_location: 'Shop Floor Camera A',
          start_time: '2025-07-07T14:35:00Z',
          end_time: '2025-07-07T14:37:00Z',
          thumbnail_url: '/images/cam1.gif',
          metadata: { severity: 'medium', confidence: 0.85 }
        },
        {
          type: 'Gun Threat',
          camera_location: 'Shop Floor Camera A',
          start_time: '2025-07-07T14:35:00Z',
          end_time: '2025-07-07T14:37:00Z',
          thumbnail_url: '/images/cam2.gif',
          metadata: { severity: 'high', confidence: 0.92 }
        },
        {
          type: 'Unauthorised Access',
          camera_location: 'Shop Floor Camera A',
          start_time: '2025-07-07T14:35:00Z',
          end_time: '2025-07-07T14:37:00Z',
          thumbnail_url: '/images/cam3.gif',
          metadata: { severity: 'medium', confidence: 0.78 }
        },
        {
          type: 'Unauthorised Access',
          camera_location: 'Shop Floor Camera B',
          start_time: '2025-07-07T13:20:00Z',
          end_time: '2025-07-07T13:22:00Z',
          thumbnail_url: '/images/cam1.gif',
          metadata: { severity: 'low', confidence: 0.65 }
        },
        {
          type: 'Gun Threat',
          camera_location: 'Shop Floor Camera C',
          start_time: '2025-07-07T12:15:00Z',
          end_time: '2025-07-07T12:17:00Z',
          thumbnail_url: '/images/cam2.gif',
          metadata: { severity: 'high', confidence: 0.95 }
        }
      ]);
      
      if (incidentError) {
        console.error('❌ Error inserting incidents:', incidentError.message);
      } else {
        console.log('✅ Sample incidents inserted');
      }
    } else {
      console.log('ℹ️  Incidents already exist, skipping...');
    }

    // Insert users if table is empty
    const { data: existingUsers } = await supabase.from('users').select('id').limit(1);
    if (!existingUsers || existingUsers.length === 0) {
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      const userPasswordHash = await bcrypt.hash('user123', 10);

      const { error: userError } = await supabase.from('users').insert([
        {
          username: 'admin',
          email: 'admin@securesight.com',
          password_hash: adminPasswordHash,
          role: 'admin'
        },
        {
          username: 'user',
          email: 'user@securesight.com',
          password_hash: userPasswordHash,
          role: 'user'
        }
      ]);
      
      if (userError) {
        console.error('❌ Error inserting users:', userError.message);
      } else {
        console.log('✅ Sample users inserted (admin/admin123, user/user123)');
      }
    } else {
      console.log('ℹ️  Users already exist, skipping...');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 API Endpoints ready:');
    console.log('   GET  http://localhost:3001/api/incidents?resolved=false');
    console.log('   PATCH http://localhost:3001/api/incidents/:id/resolve');
    console.log('\n🔐 Test credentials:');
    console.log('   Username: admin, Password: admin123');
    console.log('   Username: user, Password: user123');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
  }
}

// Run the setup
setupDatabase();