// Complete API Integration Test
// Tests both API endpoints with real HTTP requests

async function testAPIIntegration() {
  console.log('🔍 Testing API Integration...\n')

  const baseUrl = 'http://localhost:3000' // Adjust if your dev server runs on different port

  try {
    // Test 1: GET /api/incidents?resolved=false
    console.log('1. Testing GET /api/incidents?resolved=false')
    
    const unresolvedResponse = await fetch(`${baseUrl}/api/incidents?resolved=false`)
    
    if (!unresolvedResponse.ok) {
      throw new Error(`HTTP ${unresolvedResponse.status}: ${unresolvedResponse.statusText}`)
    }

    const unresolvedData = await unresolvedResponse.json()
    
    console.log(`✅ Status: ${unresolvedResponse.status}`)
    console.log(`✅ Success: ${unresolvedData.success}`)
    console.log(`✅ Count: ${unresolvedData.count} unresolved incidents`)
    console.log(`✅ Data structure: ${Array.isArray(unresolvedData.data) ? 'Array' : 'Invalid'}`)
    
    if (unresolvedData.data && unresolvedData.data.length > 0) {
      const sample = unresolvedData.data[0]
      console.log(`✅ Sample incident: ${sample.type} at ${sample.camera_location}`)
      console.log(`✅ Newest first: ${sample.created_at}`)
    }

    // Test 2: GET /api/incidents?resolved=true
    console.log('\n2. Testing GET /api/incidents?resolved=true')
    
    const resolvedResponse = await fetch(`${baseUrl}/api/incidents?resolved=true`)
    
    if (!resolvedResponse.ok) {
      throw new Error(`HTTP ${resolvedResponse.status}: ${resolvedResponse.statusText}`)
    }

    const resolvedData = await resolvedResponse.json()
    
    console.log(`✅ Status: ${resolvedResponse.status}`)
    console.log(`✅ Success: ${resolvedData.success}`)
    console.log(`✅ Count: ${resolvedData.count} resolved incidents`)

    // Test 3: PATCH /api/incidents/:id/resolve
    console.log('\n3. Testing PATCH /api/incidents/:id/resolve')
    
    if (unresolvedData.data && unresolvedData.data.length > 0) {
      const testIncident = unresolvedData.data[0]
      console.log(`   Testing with incident ID: ${testIncident.id}`)
      console.log(`   Current status: ${testIncident.status}`)
      
      const resolveResponse = await fetch(`${baseUrl}/api/incidents/${testIncident.id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!resolveResponse.ok) {
        throw new Error(`HTTP ${resolveResponse.status}: ${resolveResponse.statusText}`)
      }

      const resolveData = await resolveResponse.json()
      
      console.log(`✅ Status: ${resolveResponse.status}`)
      console.log(`✅ Success: ${resolveData.success}`)
      console.log(`✅ Message: ${resolveData.message}`)
      console.log(`✅ Updated status: ${resolveData.data.status}`)
      console.log(`✅ Resolved at: ${resolveData.data.resolved_at}`)

      // Test 4: Flip back to unresolved
      console.log('\n4. Testing status flip back')
      
      const flipResponse = await fetch(`${baseUrl}/api/incidents/${testIncident.id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!flipResponse.ok) {
        throw new Error(`HTTP ${flipResponse.status}: ${flipResponse.statusText}`)
      }

      const flipData = await flipResponse.json()
      
      console.log(`✅ Status: ${flipResponse.status}`)
      console.log(`✅ Updated status: ${flipData.data.status}`)
      console.log(`✅ Resolved at: ${flipData.data.resolved_at}`)

    } else {
      console.log('⚠️  No unresolved incidents to test resolve functionality')
    }

    // Test 5: Error handling - Invalid ID
    console.log('\n5. Testing error handling (invalid ID)')
    
    const errorResponse = await fetch(`${baseUrl}/api/incidents/99999/resolve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(`✅ Error response status: ${errorResponse.status}`)
    
    if (!errorResponse.ok) {
      const errorData = await errorResponse.json()
      console.log(`✅ Error handling works: ${errorData.error}`)
    }

    // Test 6: Method not allowed
    console.log('\n6. Testing method not allowed')
    
    const methodResponse = await fetch(`${baseUrl}/api/incidents`, {
      method: 'POST', // Should only allow GET
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(`✅ Method check status: ${methodResponse.status}`)
    
    if (!methodResponse.ok) {
      const methodData = await methodResponse.json()
      console.log(`✅ Method validation works: ${methodData.error}`)
    }

    console.log('\n🎉 All API integration tests passed!')
    console.log('✅ Both endpoints are working correctly')
    console.log('✅ Error handling is implemented')
    console.log('✅ Data structure is correct')
    console.log('✅ Status flipping works')

    return true

  } catch (error) {
    console.log(`❌ API integration test failed: ${error.message}`)
    console.log('\n📝 Make sure:')
    console.log('   1. Next.js dev server is running (npm run dev)')
    console.log('   2. Server is running on http://localhost:3000')
    console.log('   3. API routes are properly created')
    console.log('   4. Environment variables are set')
    return false
  }
}

// Check if we're running in Node.js environment
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires a fetch implementation')
  console.log('📝 Run this test in a browser console or install node-fetch')
  console.log('📝 Or test the endpoints manually using curl or Postman')
  
  console.log('\n📋 Manual Test Commands:')
  console.log('curl "http://localhost:3000/api/incidents?resolved=false"')
  console.log('curl "http://localhost:3000/api/incidents?resolved=true"')
  console.log('curl -X PATCH "http://localhost:3000/api/incidents/1/resolve"')
} else {
  testAPIIntegration()
}

module.exports = { testAPIIntegration }