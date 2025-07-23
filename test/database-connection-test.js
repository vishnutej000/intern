// Database Connection Test
// Run this test to verify Supabase database is working

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase Database Connection...\n')

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...')
    const { data, error } = await supabase.from('incidents').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      return false
    }
    console.log('✅ Connection successful!')

    // Test 2: Check if tables exist
    console.log('\n2. Checking if tables exist...')
    
    // Check incidents table
    const { data: incidents, error: incidentsError } = await supabase
      .from('incidents')
      .select('*')
      .limit(1)
    
    if (incidentsError) {
      console.log('❌ Incidents table not found:', incidentsError.message)
      console.log('📝 Please run the database schema from database/schema.sql')
      return false
    }
    console.log('✅ Incidents table exists!')

    // Check cameras table
    const { data: cameras, error: camerasError } = await supabase
      .from('cameras')
      .select('*')
      .limit(1)
    
    if (camerasError) {
      console.log('❌ Cameras table not found:', camerasError.message)
      console.log('📝 Please run the database schema from database/schema.sql')
      return false
    }
    console.log('✅ Cameras table exists!')

    // Test 3: Check data
    console.log('\n3. Checking sample data...')
    
    const { data: allIncidents, error: dataError } = await supabase
      .from('incidents')
      .select('*')
    
    if (dataError) {
      console.log('❌ Error fetching data:', dataError.message)
      return false
    }
    
    console.log(`✅ Found ${allIncidents.length} incidents in database`)
    
    if (allIncidents.length === 0) {
      console.log('⚠️  No sample data found. Please run the INSERT statements from schema.sql')
    }

    // Test 4: Test resolve functionality
    console.log('\n4. Testing resolve functionality...')
    
    const unresolvedIncidents = allIncidents.filter(inc => inc.status === 'unresolved')
    
    if (unresolvedIncidents.length > 0) {
      const testIncident = unresolvedIncidents[0]
      console.log(`Testing resolve on incident ID: ${testIncident.id}`)
      
      // Try to resolve an incident
      const { error: resolveError } = await supabase
        .from('incidents')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', testIncident.id)
      
      if (resolveError) {
        console.log('❌ Resolve test failed:', resolveError.message)
        return false
      }
      
      // Revert the change
      await supabase
        .from('incidents')
        .update({ status: 'unresolved', resolved_at: null })
        .eq('id', testIncident.id)
      
      console.log('✅ Resolve functionality works!')
    } else {
      console.log('⚠️  No unresolved incidents to test resolve functionality')
    }

    console.log('\n🎉 All database tests passed!')
    console.log('✅ Your Supabase database is fully functional!')
    return true

  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
    return false
  }
}

// Run the test
testDatabaseConnection()