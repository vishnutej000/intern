// Test to verify all seed data features are working
// This test checks if the seed data meets all requirements

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSeedFeatures() {
  console.log('🔍 Testing Seed Data Features...\n')

  try {
    // Get all data
    const { data: cameras } = await supabase.from('cameras').select('*').order('id')
    const { data: incidents } = await supabase.from('incidents').select('*').order('start_time')

    console.log('📊 CURRENT DATABASE STATUS:')
    console.log(`📹 Cameras: ${cameras?.length || 0}`)
    console.log(`🚨 Incidents: ${incidents?.length || 0}`)

    // Check requirements
    const requirements = {
      cameras: {
        required: 3,
        current: cameras?.length || 0,
        status: (cameras?.length || 0) >= 3 ? '✅' : '❌'
      },
      incidents: {
        required: 12,
        current: incidents?.length || 0,
        status: (incidents?.length || 0) >= 12 ? '✅' : '❌'
      },
      threatTypes: {
        required: 3,
        current: [...new Set(incidents?.map(inc => inc.type) || [])].length,
        status: [...new Set(incidents?.map(inc => inc.type) || [])].length >= 3 ? '✅' : '❌'
      }
    }

    console.log('\n🎯 REQUIREMENTS CHECK:')
    console.log(`📹 Cameras (need ${requirements.cameras.required}+): ${requirements.cameras.status} (${requirements.cameras.current})`)
    console.log(`🚨 Incidents (need ${requirements.incidents.required}+): ${requirements.incidents.status} (${requirements.incidents.current})`)
    console.log(`🎯 Threat Types (need ${requirements.threatTypes.required}+): ${requirements.threatTypes.status} (${requirements.threatTypes.current})`)

    // Check 24-hour coverage
    const timeRanges = {
      'Early Morning (00:00-06:00)': 0,
      'Morning (06:00-12:00)': 0,
      'Afternoon (12:00-18:00)': 0,
      'Evening (18:00-24:00)': 0
    }

    incidents?.forEach(inc => {
      const hour = new Date(inc.start_time).getHours()
      if (hour >= 0 && hour < 6) timeRanges['Early Morning (00:00-06:00)']++
      else if (hour >= 6 && hour < 12) timeRanges['Morning (06:00-12:00)']++
      else if (hour >= 12 && hour < 18) timeRanges['Afternoon (12:00-18:00)']++
      else if (hour >= 18 && hour < 24) timeRanges['Evening (18:00-24:00)']++
    })

    const has24HourCoverage = Object.values(timeRanges).every(count => count > 0)
    console.log(`⏰ 24-Hour Coverage: ${has24HourCoverage ? '✅' : '❌'}`)

    // Check thumbnails
    const hasAllThumbnails = incidents?.every(inc => inc.thumbnail_url) || false
    console.log(`🖼️  Thumbnails: ${hasAllThumbnails ? '✅' : '❌'}`)

    // Detailed breakdown
    console.log('\n📋 DETAILED BREAKDOWN:')
    
    if (cameras?.length) {
      console.log('\n📹 Cameras:')
      cameras.forEach(cam => {
        console.log(`   ${cam.name} - ${cam.location}`)
      })
    }

    if (incidents?.length) {
      const threatTypes = {}
      incidents.forEach(inc => {
        threatTypes[inc.type] = (threatTypes[inc.type] || 0) + 1
      })

      console.log('\n🎯 Threat Types:')
      Object.entries(threatTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`)
      })

      console.log('\n⏰ Timeline Distribution:')
      Object.entries(timeRanges).forEach(([range, count]) => {
        console.log(`   ${range}: ${count}`)
      })
    }

    // Overall status
    const allRequirementsMet = 
      requirements.cameras.status === '✅' &&
      requirements.incidents.status === '✅' &&
      requirements.threatTypes.status === '✅' &&
      has24HourCoverage &&
      hasAllThumbnails

    console.log('\n🎉 OVERALL STATUS:')
    if (allRequirementsMet) {
      console.log('✅ ALL SEED FEATURES ARE WORKING!')
      console.log('🎯 Your database meets all requirements')
    } else {
      console.log('⚠️  SEED DATA NEEDS TO BE RUN')
      console.log('📝 TO FIX: Run the seed data from database/seed.sql in Supabase SQL Editor')
      console.log('   1. Go to Supabase SQL Editor')
      console.log('   2. Copy content from database/seed.sql')
      console.log('   3. Paste and click RUN')
      console.log('   4. Run this test again')
    }

    return allRequirementsMet

  } catch (error) {
    console.log('❌ Test failed:', error.message)
    return false
  }
}

testSeedFeatures()