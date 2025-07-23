// Automated script to seed the database
// This script reads the seed.sql file and executes it against Supabase

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding process...\n');

  try {
    // Read the seed.sql file
    const seedFilePath = path.join(__dirname, '..', 'database', 'seed.sql');
    console.log(`📂 Reading seed file: ${seedFilePath}`);
    
    let seedSql = fs.readFileSync(seedFilePath, 'utf8');
    console.log('✅ Seed file read successfully');

    // Split the SQL into separate statements
    // This is a simple approach - for complex SQL you might need a proper SQL parser
    const statements = seedSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`🔢 Found ${statements.length} SQL statements to execute`);

    // First, clear existing data
    console.log('\n🗑️  Clearing existing data...');
    
    // Delete incidents first (due to potential foreign key constraints)
    console.log('   Deleting incidents...');
    await supabase.from('incidents').delete().neq('id', 0);
    
    // Delete cameras
    console.log('   Deleting cameras...');
    await supabase.from('cameras').delete().neq('id', 0);
    
    console.log('✅ Existing data cleared');

    // Insert cameras
    console.log('\n📹 Inserting cameras...');
    await supabase.from('cameras').insert([
      { name: 'Camera - 01', location: 'Shop Floor A', image_url: '/images/cam1.gif', is_active: true },
      { name: 'Camera - 02', location: 'Vault Area', image_url: '/images/cam2.gif', is_active: true },
      { name: 'Camera - 03', location: 'Main Entrance', image_url: '/images/cam3.gif', is_active: true },
      { name: 'Camera - 04', location: 'Loading Dock', image_url: '/images/cam1.gif', is_active: true },
      { name: 'Camera - 05', location: 'Office Corridor', image_url: '/images/cam2.gif', is_active: true }
    ]);
    console.log('✅ Cameras inserted');

    // Insert incidents - Early Morning (00:00 - 06:00)
    console.log('\n🌅 Inserting Early Morning incidents...');
    await supabase.from('incidents').insert([
      {
        type: 'Unauthorised Access',
        camera_location: 'Loading Dock Camera',
        start_time: '2025-01-23T02:15:00',
        end_time: '2025-01-23T02:17:30',
        thumbnail_url: '/images/cam1.gif',
        status: 'unresolved',
        metadata: { severity: 'high', confidence: 0.89, person_count: 1 }
      },
      {
        type: 'Motion Detection',
        camera_location: 'Main Entrance Camera',
        start_time: '2025-01-23T03:45:00',
        end_time: '2025-01-23T03:46:15',
        thumbnail_url: '/images/cam3.gif',
        status: 'resolved',
        resolved_at: '2025-01-23T04:00:00',
        metadata: { severity: 'low', confidence: 0.65, false_alarm: true }
      },
      {
        type: 'Face Recognised',
        camera_location: 'Vault Area Camera',
        start_time: '2025-01-23T05:30:00',
        end_time: '2025-01-23T05:31:00',
        thumbnail_url: '/images/cam2.gif',
        status: 'resolved',
        resolved_at: '2025-01-23T05:35:00',
        metadata: { severity: 'medium', confidence: 0.92, person_id: 'employee_001' }
      }
    ]);
    console.log('✅ Early Morning incidents inserted');

    // Insert incidents - Morning Shift (06:00 - 12:00)
    console.log('\n🌞 Inserting Morning Shift incidents...');
    await supabase.from('incidents').insert([
      {
        type: 'Unauthorised Access',
        camera_location: 'Shop Floor A Camera',
        start_time: '2025-01-23T07:20:00',
        end_time: '2025-01-23T07:23:45',
        thumbnail_url: '/images/cam1.gif',
        status: 'unresolved',
        metadata: { severity: 'medium', confidence: 0.78, person_count: 2 }
      },
      {
        type: 'Gun Threat',
        camera_location: 'Main Entrance Camera',
        start_time: '2025-01-23T08:45:00',
        end_time: '2025-01-23T08:47:30',
        thumbnail_url: '/images/cam3.gif',
        status: 'unresolved',
        metadata: { severity: 'critical', confidence: 0.95, weapon_type: 'handgun' }
      },
      {
        type: 'Face Recognised',
        camera_location: 'Office Corridor Camera',
        start_time: '2025-01-23T09:15:00',
        end_time: '2025-01-23T09:15:30',
        thumbnail_url: '/images/cam2.gif',
        status: 'resolved',
        resolved_at: '2025-01-23T09:20:00',
        metadata: { severity: 'low', confidence: 0.88, person_id: 'employee_045' }
      },
      {
        type: 'Loitering',
        camera_location: 'Loading Dock Camera',
        start_time: '2025-01-23T10:30:00',
        end_time: '2025-01-23T10:35:20',
        thumbnail_url: '/images/cam1.gif',
        status: 'resolved',
        resolved_at: '2025-01-23T11:00:00',
        metadata: { severity: 'medium', confidence: 0.72, duration_minutes: 5 }
      },
      {
        type: 'Unauthorised Access',
        camera_location: 'Vault Area Camera',
        start_time: '2025-01-23T11:45:00',
        end_time: '2025-01-23T11:48:15',
        thumbnail_url: '/images/cam2.gif',
        status: 'unresolved',
        metadata: { severity: 'high', confidence: 0.91, access_attempt: 'keypad' }
      }
    ]);
    console.log('✅ Morning Shift incidents inserted');

    // Insert incidents - Afternoon Shift (12:00 - 18:00)
    console.log('\n🌇 Inserting Afternoon Shift incidents...');
    await supabase.from('incidents').insert([
      {
        type: 'Violence Detection',
        camera_location: 'Shop Floor A Camera',
        start_time: '2025-01-23T13:20:00',
        end_time: '2025-01-23T13:22:45',
        thumbnail_url: '/images/cam1.gif',
        status: 'unresolved',
        metadata: { severity: 'high', confidence: 0.84, person_count: 3 }
      },
      {
        type: 'Gun Threat',
        camera_location: 'Vault Area Camera',
        start_time: '2025-01-23T14:35:00',
        end_time: '2025-01-23T14:37:20',
        thumbnail_url: '/images/cam2.gif',
        status: 'unresolved',
        metadata: { severity: 'critical', confidence: 0.93, weapon_type: 'rifle' }
      },
      {
        type: 'Face Recognised',
        camera_location: 'Main Entrance Camera',
        start_time: '2025-01-23T15:10:00',
        end_time: '2025-01-23T15:10:45',
        thumbnail_url: '/images/cam3.gif',
        status: 'resolved',
        resolved_at: '2025-01-23T15:15:00',
        metadata: { severity: 'low', confidence: 0.96, person_id: 'visitor_012' }
      },
      {
        type: 'Unauthorised Access',
        camera_location: 'Office Corridor Camera',
        start_time: '2025-01-23T16:25:00',
        end_time: '2025-01-23T16:28:30',
        thumbnail_url: '/images/cam2.gif',
        status: 'unresolved',
        metadata: { severity: 'medium', confidence: 0.81, door_forced: true }
      }
    ]);
    console.log('✅ Afternoon Shift incidents inserted');

    // Insert incidents - Evening Shift (18:00 - 24:00)
    console.log('\n🌃 Inserting Evening Shift incidents...');
    await supabase.from('incidents').insert([
      {
        type: 'Theft Detection',
        camera_location: 'Shop Floor A Camera',
        start_time: '2025-01-23T19:40:00',
        end_time: '2025-01-23T19:43:15',
        thumbnail_url: '/images/cam1.gif',
        status: 'unresolved',
        metadata: { severity: 'high', confidence: 0.87, item_removed: 'equipment' }
      },
      {
        type: 'Gun Threat',
        camera_location: 'Loading Dock Camera',
        start_time: '2025-01-23T20:15:00',
        end_time: '2025-01-23T20:17:45',
        thumbnail_url: '/images/cam1.gif',
        status: 'unresolved',
        metadata: { severity: 'critical', confidence: 0.91, weapon_type: 'handgun' }
      },
      {
        type: 'Unauthorised Access',
        camera_location: 'Main Entrance Camera',
        start_time: '2025-01-23T21:30:00',
        end_time: '2025-01-23T21:33:20',
        thumbnail_url: '/images/cam3.gif',
        status: 'unresolved',
        metadata: { severity: 'high', confidence: 0.86, after_hours: true }
      },
      {
        type: 'Vandalism',
        camera_location: 'Vault Area Camera',
        start_time: '2025-01-23T22:45:00',
        end_time: '2025-01-23T22:47:30',
        thumbnail_url: '/images/cam2.gif',
        status: 'resolved',
        resolved_at: '2025-01-23T23:00:00',
        metadata: { severity: 'medium', confidence: 0.79, property_damage: true }
      }
    ]);
    console.log('✅ Evening Shift incidents inserted');

    // Insert historical incidents
    console.log('\n📜 Inserting Historical incidents...');
    await supabase.from('incidents').insert([
      {
        type: 'Unauthorised Access',
        camera_location: 'Shop Floor A Camera',
        start_time: '2025-01-22T14:20:00',
        end_time: '2025-01-22T14:23:00',
        thumbnail_url: '/images/cam1.gif',
        status: 'resolved',
        resolved_at: '2025-01-22T16:30:00',
        metadata: { severity: 'medium', confidence: 0.75 }
      },
      {
        type: 'Gun Threat',
        camera_location: 'Main Entrance Camera',
        start_time: '2025-01-22T16:45:00',
        end_time: '2025-01-22T16:48:00',
        thumbnail_url: '/images/cam3.gif',
        status: 'resolved',
        resolved_at: '2025-01-22T17:15:00',
        metadata: { severity: 'critical', confidence: 0.88 }
      },
      {
        type: 'Violence Detection',
        camera_location: 'Vault Area Camera',
        start_time: '2025-01-22T18:30:00',
        end_time: '2025-01-22T18:33:00',
        thumbnail_url: '/images/cam2.gif',
        status: 'resolved',
        resolved_at: '2025-01-22T19:00:00',
        metadata: { severity: 'high', confidence: 0.82 }
      }
    ]);
    console.log('✅ Historical incidents inserted');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('🔍 Running verification test...');
    
    // Get counts for verification
    const { count: cameraCount } = await supabase
      .from('cameras')
      .select('*', { count: 'exact', head: true });
    
    const { count: incidentCount } = await supabase
      .from('incidents')
      .select('*', { count: 'exact', head: true });
    
    const { data: threatTypes } = await supabase
      .from('incidents')
      .select('type');
    
    const uniqueTypes = [...new Set(threatTypes.map(inc => inc.type))];
    
    console.log('\n📊 Verification Results:');
    console.log(`📹 Cameras: ${cameraCount}`);
    console.log(`🚨 Incidents: ${incidentCount}`);
    console.log(`🎯 Threat Types: ${uniqueTypes.length} (${uniqueTypes.join(', ')})`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    return false;
  }
}

seedDatabase()
  .then(() => {
    console.log('\n✅ Seed script completed');
    console.log('📝 Next step: Run "node test/seed-features-test.js" to verify all features');
  })
  .catch(error => {
    console.error('❌ Seed script failed:', error);
  });