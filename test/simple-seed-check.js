// Simple test to check if we have seed data for API testing
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tfvmzwiwwqpsuhffymnk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdm16d2l3d3Fwc3VoZmZ5bW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTM2MDIsImV4cCI6MjA2ODgyOTYwMn0.TMoqcsA7I4HtHsHd6MZ7Xge1AEG42mrYQnXn3Nwrl0U'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSeedData() {
  console.log('🔍 Checking seed data for API testing...\n')

  try {
    // Get unresolved incidents
    const { data: unresolved, error: unresolvedError } = await supabase
      .from('incidents')
      .select('*')
      .eq('status', 'unresolved')
      .order('created_at', { ascending: false })

    if (unresolvedError) {
      console.log('❌ Error fetching unresolved incidents:', unresolvedError.message)
      return false
    }

    // Get resolved incidents
    const { data: resolved, error: resolvedError } = await supabase
      .from('incidents')
      .select('*')
      .eq('status', 'resolved')
      .order('created_at', { ascending: false })

    if (resolvedError) {
      console.log('❌ Error fetching resolved incidents:', resolvedError.message)
      return false
    }

    console.log('📊 Current Data Status:')
    console.log(`🔴 Unresolved incidents: ${unresolved.length}`)
    console.log(`✅ Resolved incidents: ${resolved.length}`)
    console.log(`📝 Total incidents: ${unresolved.length + resolved.length}`)

    if (unresolved.length > 0) {
      console.log('\n🔴 Sample unresolved incident:')
      const sample = unresolved[0]
      console.log(`   ID: ${sample.id}`)
      console.log(`   Type: ${sample.type}`)
      console.log(`   Location: ${sample.camera_location}`)
      console.log(`   Status: ${sample.status}`)
      console.log(`   Created: ${new Date(sample.created_at).toLocaleString()}`)
    }

    if (resolved.length > 0) {
      console.log('\n✅ Sample resolved incident:')
      const sample = resolved[0]
      console.log(`   ID: ${sample.id}`)
      console.log(`   Type: ${sample.type}`)
      console.log(`   Location: ${sample.camera_location}`)
      console.log(`   Status: ${sample.status}`)
      console.log(`   Resolved: ${sample.resolved_at ? new Date(sample.resolved_at).toLocaleString() : 'N/A'}`)
    }

    console.log('\n🎯 API Testing Ready:')
    console.log(`✅ Can test GET /api/incidents?resolved=false (${unresolved.length} incidents)`)
    console.log(`✅ Can test GET /api/incidents?resolved=true (${resolved.length} incidents)`)
    console.log(`✅ Can test PATCH /api/incidents/:id/resolve (${unresolved.length > 0 ? 'ready' : 'no unresolved incidents'})`)

    return true

  } catch (error) {
    console.log('❌ Error checking seed data:', error.message)
    return false
  }
}

checkSeedData()