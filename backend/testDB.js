import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

const { data, error } = await supabase.from('restaurantes').select('*').limit(5)

if (error) {
  console.log('❌ Error:', error.message)
} else {
  console.log('✅ Conexión exitosa! Datos:', data)
}