const supabase = require('./supabase');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed cameras
    const cameras = [
      { name: 'Shop Floor Camera A', location: 'Shop Floor' },
      { name: 'Vault Camera B', location: 'Vault' },
      { name: 'Entrance Camera C', location: 'Entrance' }
    ];

    console.log('📹 Seeding cameras...');
    const { data: cameraData, error: cameraError } = await supabase
      .from('cameras')
      .insert(cameras)
      .select();

    if (cameraError) {
      console.error('Error seeding cameras:', cameraError);
      return;
    }

    console.log(`✅ Seeded ${cameraData.length} cameras`);

    // Seed incidents - 15+ incidents across 24-hour span with 3+ threat types
    const incidents = [
      // Early morning incidents
      { camera_id: 1, type: 'Unauthorised Access', ts_start: '2025-07-21T02:15:00Z', ts_end: '2025-07-21T02:30:00Z', resolved: true },
      { camera_id: 3, type: 'Face Recognised', ts_start: '2025-07-21T03:45:00Z', ts_end: '2025-07-21T03:46:00Z', resolved: true },

      // Morning incidents
      { camera_id: 2, type: 'Gun Threat', ts_start: '2025-07-21T08:20:00Z', ts_end: '2025-07-21T08:25:00Z', resolved: true },
      { camera_id: 1, type: 'Traffic Congestion', ts_start: '2025-07-21T09:30:00Z', ts_end: '2025-07-21T09:45:00Z', resolved: true },

      // Afternoon incidents
      { camera_id: 1, type: 'Unauthorised Access', ts_start: '2025-07-21T14:23:00Z', ts_end: '2025-07-21T14:37:00Z', resolved: false },
      { camera_id: 2, type: 'Face Recognised', ts_start: '2025-07-21T15:10:00Z', ts_end: '2025-07-21T15:11:00Z', resolved: true },
      { camera_id: 1, type: 'Gun Threat', ts_start: '2025-07-21T15:45:00Z', ts_end: '2025-07-21T15:50:00Z', resolved: false },
      { camera_id: 3, type: 'Unauthorised Access', ts_start: '2025-07-21T16:30:00Z', ts_end: '2025-07-21T16:45:00Z', resolved: false },

      // Evening incidents
      { camera_id: 2, type: 'Traffic Congestion', ts_start: '2025-07-21T18:15:00Z', ts_end: '2025-07-21T18:30:00Z', resolved: true },
      { camera_id: 1, type: 'Face Recognised', ts_start: '2025-07-21T19:20:00Z', ts_end: '2025-07-21T19:21:00Z', resolved: true },
      { camera_id: 3, type: 'Gun Threat', ts_start: '2025-07-21T20:45:00Z', ts_end: '2025-07-21T20:50:00Z', resolved: false },
      { camera_id: 2, type: 'Unauthorised Access', ts_start: '2025-07-21T21:30:00Z', ts_end: '2025-07-21T21:45:00Z', resolved: false },

      // Late night incidents
      { camera_id: 1, type: 'Unauthorised Access', ts_start: '2025-07-21T22:15:00Z', ts_end: '2025-07-21T22:30:00Z', resolved: false },
      { camera_id: 3, type: 'Traffic Congestion', ts_start: '2025-07-21T23:10:00Z', ts_end: '2025-07-21T23:25:00Z', resolved: false },
      { camera_id: 2, type: 'Gun Threat', ts_start: '2025-07-21T23:45:00Z', ts_end: '2025-07-21T23:50:00Z', resolved: false }
    ];

    console.log('🚨 Seeding incidents...');
    const { data: incidentData, error: incidentError } = await supabase
      .from('incidents')
      .insert(incidents)
      .select();

    if (incidentError) {
      console.error('Error seeding incidents:', incidentError);
      return;
    }

    console.log(`✅ Seeded ${incidentData.length} incidents`);

    // Seed users
    const defaultPassword = await bcrypt.hash('admin123', 10);
    const users = [
      { username: 'admin', email: 'admin@mandlac.com', password_hash: defaultPassword, role: 'admin' },
      { username: 'operator', email: 'operator@mandlac.com', password_hash: defaultPassword, role: 'operator' },
      { username: 'viewer', email: 'viewer@mandlac.com', password_hash: defaultPassword, role: 'viewer' }
    ];

    console.log('👥 Seeding users...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert(users)
      .select();

    if (userError) {
      console.error('Error seeding users:', userError);
      return;
    }

    console.log(`✅ Seeded ${userData.length} users`);
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;