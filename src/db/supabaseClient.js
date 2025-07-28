import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.PROJECT_URL
const key = process.env.PROJECT_ANON_KEY

const supabase = createClient(url, key)

export default supabase