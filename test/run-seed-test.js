// Test script to verify seed data
// Run this after executing the seed SQL

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSeedData() {
  console.log('🔍 Testing Seed Data...\n')

  try {
    // Test cameras
    console.log('📹 Checking cameras...')
    const { data: cameras, error: camError } = await supabase
      .from('cameras')
      .select('*')
      .order('id')

    if (camError) {
      console.log('❌ Error fetching cameras:', camError.message)
      return false
    }

    console.log(`✅ Found ${cameras.length} cameras:`)
    cameras.forEach(cam => {
      console.log(`   ${cam.name} - ${cam.location}`)
    })

    // Test incidents by status
    console.log('\n🚨 Checking incidents...')
    const { data: allIncidents, error: incError } = await supabase
      .from('incidents')
      .select('*')
      .order('start_time', { ascending: false })

    if (incError) {
      console.log('❌ Error fetching incidents:', incError.message)
      return false
    }

    const unresolved = allIncidents.filter(inc => inc.status === 'unresolved')
    const resolved = allIncidents.filter(inc => inc.status === 'resolved')

    console.log(`✅ Total incidents: ${allIncidents.length}`)
    console.log(`🔴 Unresolved: ${unresolved.length}`)
    console.log(`✅ Resolved: ${resolved.length}`)

    // Test threat types
    console.log('\n🎯 Threat type breakdown:')
    const threatTypes = {}
    allIncidents.forEach(inc => {
      threatTypes[inc.type] = (threatTypes[inc.type] || 0) + 1
    })

    Object.entries(threatTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`)
    })

    // Test 24-hour timeline
    console.log('\n⏰ Timeline verification:')
    const timeRanges = {
      'Early Morning (00:00-06:00)': 0,
      'Morning Shift (06:00-12:00)': 0,
      'Afternoon Shift (12:00-18:00)': 0,
      'Evening Shift (18:00-24:00)': 0
    }

    allIncidents.forEach(inc => {
      const hour = new Date(inc.start_time).getHours()
      if (hour >= 0 && hour < 6) timeRanges['Early Morning (00:00-06:00)']++
      else if (hour >= 6 && hour < 12) timeRanges['Morning Shift (06:00-12:00)']++
      else if (hour >= 12 && hour < 18) timeRanges['Afternoon Shift (12:00-18:00)']++
      else if (hour >= 18 && hour < 24) timeRanges['Evening Shift (18:00-24:00)']++
    })

    Object.entries(timeRanges).forEach(([range, count]) => {
      console.log(`   ${range}: ${count} incidents`)
    })

    // Test critical incidents
    console.log('\n🚨 Critical incidents:')
    const criticalIncidents = unresolved.filter(inc => 
      inc.type === 'Gun Threat' || 
      inc.type === 'Violence Detection' ||
      (inc.metadata && inc.metadata.severity === 'critical')
    )
    
    console.log(`⚠️  ${criticalIncidents.length} critical unresolved incidents`)
    criticalIncidents.forEach(inc => {
      const time = new Date(inc.start_time).toLocaleTimeString()
      console.log(`   ${time} - ${inc.type} at ${inc.camera_location}`)
    })

    // Verify requirements
    console.log('\n✅ Requirements Check:')
    console.log(`📹 Cameras (need 3+): ${cameras.length >= 3 ? '✅' : '❌'} (${cameras.length})`)
    console.log(`🚨 Incidents (need 12+): ${allIncidents.length >= 12 ? '✅' : '❌'} (${allIncidents.length})`)
    console.log(`🎯 Threat types (need 3+): ${Object.keys(threatTypes).length >= 3 ? '✅' : '❌'} (${Object.keys(threatTypes).length})`)
    console.log(`⏰ 24-hour coverage: ${Object.values(timeRanges).every(count => count > 0) ? '✅' : '❌'}`)
    console.log(`🖼️  Thumbnails: ${allIncidents.every(inc => inc.thumbnail_url) ? '✅' : '❌'}`)

    console.log('\n🎉 Seed data verification complete!')
    return true

  } catch (error) {
    console.log('❌ Test failed:', error.message)
    return false
  }
}

testSeedData()