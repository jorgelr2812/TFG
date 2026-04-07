import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://lkxepxetmlelkjkvsoks.supabase.co";
const SUPABASE_KEY = "sb_publishable_q9el2WqRhZwtfxXtTDvjNw_-FBHcCWK";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
