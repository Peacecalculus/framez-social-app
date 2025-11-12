import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual Supabase project credentials
// Get these from: https://supabase.com/dashboard → Your Project → Settings → API
const supabaseUrl = "https://lkqfkajvgqqixzqkcymq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrcWZrYWp2Z3FxaXh6cWtjeW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjI0NTcsImV4cCI6MjA3ODEzODQ1N30.QJ35ffmhWS-sbjRM7VdrpIObKEgSoorAdJiH41U5O84";

// Initialize Supabase client with AsyncStorage for persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
