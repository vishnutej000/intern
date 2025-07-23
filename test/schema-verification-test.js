// Schema Verification Test
// Run this after executing the database schema

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifySchema() {
  console.log('🔍 Verifying Database Schema...\n')

  try {
    // Check incidents table structure
    console.log('1. Checking incidents table...')
    const { data: incidents, error: incError } = await supabase
      .from('incidents')
      .select('*')
      .limit(1)
    
    if (incError) {
      console.log('❌ Incidents table missing:', incError.message)
      console.log('\n📋 TO FIX: Go to Supabase SQL Editor and run:')
      console.log('   1. Copy content from database/schema.sql')
      console.log('   2. Paste in SQL Editor')
      console.log('   3. Click RUN')
      return false
    }
    console.log('✅ Incidents table exists!')

    // Check cameras table structure
    console.log('2. Checking cameras table...')
    const { data: cameras, error: camError } = await supabase
      .from('cameras')
      .select('*')
      .limit(1)
    
    if (camError) {
      console.log('❌ Cameras table missing:', camError.message)
      return false
    }
    console.log('✅ Cameras table exists!')

    // Check sample data
    console.log('3. Checking sample data...')
    const { data: allIncidents } = await supabase.from('incidents').select('*')
    const { data: allCameras } = await supabase.from('cameras').select('*')
    
    console.log(`✅ Found ${allIncidents?.length || 0} incidents`)
    console.log(`✅ Found ${allCameras?.length || 0} cameras`)

    if ((allIncidents?.length || 0) === 0) {
      console.log('⚠️  No sample incidents found - schema may not have run completely')
    }

    if ((allCameras?.length || 0) === 0) {
      console.log('⚠️  No sample cameras found - schema may not have run completely')
    }

    console.log('\n🎉 Schema verification complete!')
    
    if ((allIncidents?.length || 0) > 0 && (allCameras?.length || 0) > 0) {
      console.log('✅ Database is fully set up and ready!')
      return true
    } else {
      console.log('⚠️  Database tables exist but sample data is missing')
      return false
    }

  } catch (error) {
    console.log('❌ Schema verification failed:', error.message)
    return false
  }
}

verifySchema()