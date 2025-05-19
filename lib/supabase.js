// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Create and export Supabase client instance
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Function to get the session
const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()  // This is the correct method now
  
  if (error) {
    console.error('Error getting session:', error.message)
    return null
  }

  return session
}

// Export the supabase client and session function
export { supabase, getSession }
