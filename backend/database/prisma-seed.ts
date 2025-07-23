// Prisma Seed File for Incident Monitoring System
// Run with: npx prisma db seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (optional)
  await prisma.incident.deleteMany()
  await prisma.camera.deleteMany()

  // Seed cameras
  console.log('📹 Creating cameras...')
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Camera - 01',
        location: 'Shop Floor A',
        image_url: '/images/cam1.gif',
        is_active: true,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera - 02',
        location: 'Vault Area',
        image_url: '/images/cam2.gif',
        is_active: true,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera - 03',
        location: 'Main Entrance',
        image_url: '/images/cam3.gif',
        is_active: true,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera - 04',
        location: 'Loading Dock',
        image_url: '/images/cam1.gif',
        is_active: true,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera - 05',
        location: 'Office Corridor',
        image_url: '/images/cam2.gif',
        is_active: true,
      },
    }),
  ])

  console.log(`✅ Created ${cameras.length} cameras`)

  // Seed incidents with 24-hour timeline
  console.log('🚨 Creating incidents...')
  
  const incidents = [
    // Early Morning (00:00 - 06:00)
    {
      type: 'Unauthorised Access',
      camera_location: 'Loading Dock Camera',
      start_time: new Date('2025-01-23T02:15:00'),
      end_time: new Date('2025-01-23T02:17:30'),
      thumbnail_url: '/images/cam1.gif',
      status: 'unresolved',
      metadata: { severity: 'high', confidence: 0.89, person_count: 1 },
    },
    {
      type: 'Motion Detection',
      camera_location: 'Main Entrance Camera',
      start_time: new Date('2025-01-23T03:45:00'),
      end_time: new Date('2025-01-23T03:46:15'),
      thumbnail_url: '/images/cam3.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-23T04:00:00'),
      metadata: { severity: 'low', confidence: 0.65, false_alarm: true },
    },
    {
      type: 'Face Recognised',
      camera_location: 'Vault Area Camera',
      start_time: new Date('2025-01-23T05:30:00'),
      end_time: new Date('2025-01-23T05:31:00'),
      thumbnail_url: '/images/cam2.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-23T05:35:00'),
      metadata: { severity: 'medium', confidence: 0.92, person_id: 'employee_001' },
    },

    // Morning Shift (06:00 - 12:00)
    {
      type: 'Unauthorised Access',
      camera_location: 'Shop Floor A Camera',
      start_time: new Date('2025-01-23T07:20:00'),
      end_time: new Date('2025-01-23T07:23:45'),
      thumbnail_url: '/images/cam1.gif',
      status: 'unresolved',
      metadata: { severity: 'medium', confidence: 0.78, person_count: 2 },
    },
    {
      type: 'Gun Threat',
      camera_location: 'Main Entrance Camera',
      start_time: new Date('2025-01-23T08:45:00'),
      end_time: new Date('2025-01-23T08:47:30'),
      thumbnail_url: '/images/cam3.gif',
      status: 'unresolved',
      metadata: { severity: 'critical', confidence: 0.95, weapon_type: 'handgun' },
    },
    {
      type: 'Face Recognised',
      camera_location: 'Office Corridor Camera',
      start_time: new Date('2025-01-23T09:15:00'),
      end_time: new Date('2025-01-23T09:15:30'),
      thumbnail_url: '/images/cam2.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-23T09:20:00'),
      metadata: { severity: 'low', confidence: 0.88, person_id: 'employee_045' },
    },
    {
      type: 'Loitering',
      camera_location: 'Loading Dock Camera',
      start_time: new Date('2025-01-23T10:30:00'),
      end_time: new Date('2025-01-23T10:35:20'),
      thumbnail_url: '/images/cam1.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-23T11:00:00'),
      metadata: { severity: 'medium', confidence: 0.72, duration_minutes: 5 },
    },
    {
      type: 'Unauthorised Access',
      camera_location: 'Vault Area Camera',
      start_time: new Date('2025-01-23T11:45:00'),
      end_time: new Date('2025-01-23T11:48:15'),
      thumbnail_url: '/images/cam2.gif',
      status: 'unresolved',
      metadata: { severity: 'high', confidence: 0.91, access_attempt: 'keypad' },
    },

    // Afternoon Shift (12:00 - 18:00)
    {
      type: 'Violence Detection',
      camera_location: 'Shop Floor A Camera',
      start_time: new Date('2025-01-23T13:20:00'),
      end_time: new Date('2025-01-23T13:22:45'),
      thumbnail_url: '/images/cam1.gif',
      status: 'unresolved',
      metadata: { severity: 'high', confidence: 0.84, person_count: 3 },
    },
    {
      type: 'Gun Threat',
      camera_location: 'Vault Area Camera',
      start_time: new Date('2025-01-23T14:35:00'),
      end_time: new Date('2025-01-23T14:37:20'),
      thumbnail_url: '/images/cam2.gif',
      status: 'unresolved',
      metadata: { severity: 'critical', confidence: 0.93, weapon_type: 'rifle' },
    },
    {
      type: 'Face Recognised',
      camera_location: 'Main Entrance Camera',
      start_time: new Date('2025-01-23T15:10:00'),
      end_time: new Date('2025-01-23T15:10:45'),
      thumbnail_url: '/images/cam3.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-23T15:15:00'),
      metadata: { severity: 'low', confidence: 0.96, person_id: 'visitor_012' },
    },
    {
      type: 'Unauthorised Access',
      camera_location: 'Office Corridor Camera',
      start_time: new Date('2025-01-23T16:25:00'),
      end_time: new Date('2025-01-23T16:28:30'),
      thumbnail_url: '/images/cam2.gif',
      status: 'unresolved',
      metadata: { severity: 'medium', confidence: 0.81, door_forced: true },
    },

    // Evening Shift (18:00 - 24:00)
    {
      type: 'Theft Detection',
      camera_location: 'Shop Floor A Camera',
      start_time: new Date('2025-01-23T19:40:00'),
      end_time: new Date('2025-01-23T19:43:15'),
      thumbnail_url: '/images/cam1.gif',
      status: 'unresolved',
      metadata: { severity: 'high', confidence: 0.87, item_removed: 'equipment' },
    },
    {
      type: 'Gun Threat',
      camera_location: 'Loading Dock Camera',
      start_time: new Date('2025-01-23T20:15:00'),
      end_time: new Date('2025-01-23T20:17:45'),
      thumbnail_url: '/images/cam1.gif',
      status: 'unresolved',
      metadata: { severity: 'critical', confidence: 0.91, weapon_type: 'handgun' },
    },
    {
      type: 'Unauthorised Access',
      camera_location: 'Main Entrance Camera',
      start_time: new Date('2025-01-23T21:30:00'),
      end_time: new Date('2025-01-23T21:33:20'),
      thumbnail_url: '/images/cam3.gif',
      status: 'unresolved',
      metadata: { severity: 'high', confidence: 0.86, after_hours: true },
    },
    {
      type: 'Vandalism',
      camera_location: 'Vault Area Camera',
      start_time: new Date('2025-01-23T22:45:00'),
      end_time: new Date('2025-01-23T22:47:30'),
      thumbnail_url: '/images/cam2.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-23T23:00:00'),
      metadata: { severity: 'medium', confidence: 0.79, property_damage: true },
    },

    // Historical resolved incidents
    {
      type: 'Unauthorised Access',
      camera_location: 'Shop Floor A Camera',
      start_time: new Date('2025-01-22T14:20:00'),
      end_time: new Date('2025-01-22T14:23:00'),
      thumbnail_url: '/images/cam1.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-22T16:30:00'),
      metadata: { severity: 'medium', confidence: 0.75 },
    },
    {
      type: 'Gun Threat',
      camera_location: 'Main Entrance Camera',
      start_time: new Date('2025-01-22T16:45:00'),
      end_time: new Date('2025-01-22T16:48:00'),
      thumbnail_url: '/images/cam3.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-22T17:15:00'),
      metadata: { severity: 'critical', confidence: 0.88 },
    },
    {
      type: 'Violence Detection',
      camera_location: 'Vault Area Camera',
      start_time: new Date('2025-01-22T18:30:00'),
      end_time: new Date('2025-01-22T18:33:00'),
      thumbnail_url: '/images/cam2.gif',
      status: 'resolved',
      resolved_at: new Date('2025-01-22T19:00:00'),
      metadata: { severity: 'high', confidence: 0.82 },
    },
  ]

  // Create incidents
  for (const incidentData of incidents) {
    await prisma.incident.create({
      data: incidentData,
    })
  }

  console.log(`✅ Created ${incidents.length} incidents`)

  // Summary
  const totalIncidents = await prisma.incident.count()
  const unresolvedCount = await prisma.incident.count({
    where: { status: 'unresolved' }
  })
  const resolvedCount = await prisma.incident.count({
    where: { status: 'resolved' }
  })

  console.log('\n📊 Seed Summary:')
  console.log(`📹 Cameras: ${cameras.length}`)
  console.log(`🚨 Total Incidents: ${totalIncidents}`)
  console.log(`🔴 Unresolved: ${unresolvedCount}`)
  console.log(`✅ Resolved: ${resolvedCount}`)

  // Threat type breakdown
  const threatTypes = await prisma.incident.groupBy({
    by: ['type'],
    _count: { type: true },
  })

  console.log('\n🎯 Threat Types:')
  threatTypes.forEach(({ type, _count }) => {
    console.log(`   ${type}: ${_count.type}`)
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n🎉 Database seeded successfully!')
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })