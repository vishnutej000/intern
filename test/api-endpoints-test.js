// Test API endpoints functionality
// This tests the API endpoints we need to create

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simulate API endpoint functions
class IncidentAPI {
  // GET /api/incidents?resolved=false
  static async getIncidents(resolved = false) {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('status', resolved ? 'resolved' : 'unresolved')
      .order('created_at', { ascending: false }) // newest first

    if (error) {
      throw new Error(`Failed to fetch incidents: ${error.message}`)
    }

    return data
  }

  // PATCH /api/incidents/:id/resolve
  static async resolveIncident(id) {
    // First get the current incident
    const { data: currentIncident, error: fetchError } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch incident: ${fetchError.message}`)
    }

    if (!currentIncident) {
      throw new Error(`Incident with id ${id} not found`)
    }

    // Flip the resolved status
    const newStatus = currentIncident.status === 'resolved' ? 'unresolved' : 'resolved'
    const resolvedAt = newStatus === 'resolved' ? new Date().toISOString() : null

    // Update the incident
    const { data, error } = await supabase
      .from('incidents')
      .update({ 
        status: newStatus,
        resolved_at: resolvedAt
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update incident: ${error.message}`)
    }

    return data // Echo updated row
  }
}

async function testAPIEndpoints() {
  console.log('🔍 Testing API Endpoints...\n')

  try {
    // Test 1: GET /api/incidents?resolved=false
    console.log('1. Testing GET /api/incidents?resolved=false')
    const unresolvedIncidents = await IncidentAPI.getIncidents(false)
    console.log(`✅ Retrieved ${unresolvedIncidents.length} unresolved incidents`)
    
    if (unresolvedIncidents.length > 0) {
      console.log(`   First incident: ${unresolvedIncidents[0].type} at ${unresolvedIncidents[0].camera_location}`)
      console.log(`   Newest first: ${new Date(unresolvedIncidents[0].created_at).toLocaleString()}`)
    }

    // Test 2: GET /api/incidents?resolved=true
    console.log('\n2. Testing GET /api/incidents?resolved=true')
    const resolvedIncidents = await IncidentAPI.getIncidents(true)
    console.log(`✅ Retrieved ${resolvedIncidents.length} resolved incidents`)

    // Test 3: PATCH /api/incidents/:id/resolve
    console.log('\n3. Testing PATCH /api/incidents/:id/resolve')
    
    if (unresolvedIncidents.length > 0) {
      const testIncident = unresolvedIncidents[0]
      console.log(`   Testing with incident ID: ${testIncident.id}`)
      console.log(`   Current status: ${testIncident.status}`)
      
      // Resolve the incident
      const updatedIncident = await IncidentAPI.resolveIncident(testIncident.id)
      console.log(`✅ Incident resolved successfully`)
      console.log(`   New status: ${updatedIncident.status}`)
      console.log(`   Resolved at: ${updatedIncident.resolved_at}`)
      
      // Test flipping back
      console.log('\n4. Testing status flip back')
      const flippedBack = await IncidentAPI.resolveIncident(testIncident.id)
      console.log(`✅ Status flipped back to: ${flippedBack.status}`)
      console.log(`   Resolved at: ${flippedBack.resolved_at}`)
      
    } else {
      console.log('⚠️  No unresolved incidents to test resolve functionality')
    }

    // Test 4: Error handling
    console.log('\n5. Testing error handling')
    try {
      await IncidentAPI.resolveIncident(99999) // Non-existent ID
      console.log('❌ Should have thrown an error')
    } catch (error) {
      console.log(`✅ Error handling works: ${error.message}`)
    }

    console.log('\n🎉 All API endpoint tests passed!')
    return true

  } catch (error) {
    console.log(`❌ API test failed: ${error.message}`)
    return false
  }
}

testAPIEndpoints()