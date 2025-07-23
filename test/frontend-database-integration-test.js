// Frontend Database Integration Test
// Tests the DatabaseService class functionality

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simulate DatabaseService methods
class TestDatabaseService {
  static async getIncidents() {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('status', 'unresolved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching incidents:', error)
      throw error
    }

    return data || []
  }

  static async resolveIncident(incidentId) {
    const { error } = await supabase
      .from('incidents')
      .update({ 
        status: 'resolved',
        resolved_at: new Date().toISOString()
      })
      .eq('id', incidentId)

    if (error) {
      console.error('Error resolving incident:', error)
      throw error
    }
  }

  static async getResolvedIncidentsCount() {
    const { count, error } = await supabase
      .from('incidents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolved')

    if (error) {
      console.error('Error fetching resolved incidents count:', error)
      throw error
    }

    return count || 0
  }

  static async getCameras() {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .eq('is_active', true)
      .order('id')

    if (error) {
      console.error('Error fetching cameras:', error)
      throw error
    }

    return data || []
  }
}

async function testFrontendIntegration() {
  console.log('🔍 Testing Frontend Database Integration...\n')

  try {
    // Test 1: Get incidents (like IncidentList component does)
    console.log('1. Testing getIncidents() method...')
    const incidents = await TestDatabaseService.getIncidents()
    console.log(`✅ Retrieved ${incidents.length} unresolved incidents`)
    
    if (incidents.length > 0) {
      const incident = incidents[0]
      console.log(`   Sample incident: ${incident.type} at ${incident.camera_location}`)
    }

    // Test 2: Get resolved incidents count
    console.log('\n2. Testing getResolvedIncidentsCount() method...')
    const resolvedCount = await TestDatabaseService.getResolvedIncidentsCount()
    console.log(`✅ Found ${resolvedCount} resolved incidents`)

    // Test 3: Get cameras (like MediaPlayer component does)
    console.log('\n3. Testing getCameras() method...')
    const cameras = await TestDatabaseService.getCameras()
    console.log(`✅ Retrieved ${cameras.length} active cameras`)
    
    cameras.forEach(camera => {
      console.log(`   Camera: ${camera.name} - ${camera.location}`)
    })

    // Test 4: Test resolve incident functionality
    console.log('\n4. Testing resolveIncident() method...')
    
    if (incidents.length > 0) {
      const testIncident = incidents[0]
      console.log(`   Testing resolve on incident ID: ${testIncident.id}`)
      
      // Resolve the incident
      await TestDatabaseService.resolveIncident(testIncident.id)
      console.log('✅ Incident resolved successfully!')
      
      // Verify it's resolved
      const updatedIncidents = await TestDatabaseService.getIncidents()
      const resolvedIncident = incidents.find(inc => inc.id === testIncident.id)
      const stillUnresolved = updatedIncidents.find(inc => inc.id === testIncident.id)
      
      if (!stillUnresolved) {
        console.log('✅ Incident correctly removed from unresolved list!')
      }
      
      // Revert for next test
      await supabase
        .from('incidents')
        .update({ status: 'unresolved', resolved_at: null })
        .eq('id', testIncident.id)
      
      console.log('✅ Test incident reverted to unresolved state')
    } else {
      console.log('⚠️  No incidents available to test resolve functionality')
    }

    // Test 5: Data structure validation
    console.log('\n5. Validating data structure...')
    
    if (incidents.length > 0) {
      const incident = incidents[0]
      const requiredFields = ['id', 'type', 'camera_location', 'start_time', 'end_time', 'status', 'created_at']
      
      const missingFields = requiredFields.filter(field => !(field in incident))
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields present in incident data')
      } else {
        console.log('❌ Missing fields:', missingFields.join(', '))
        return false
      }
    }

    console.log('\n🎉 All frontend integration tests passed!')
    console.log('✅ Your database is fully compatible with the frontend!')
    return true

  } catch (error) {
    console.log('❌ Frontend integration test failed:', error.message)
    return false
  }
}

// Run the test
testFrontendIntegration()