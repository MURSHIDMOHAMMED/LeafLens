import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // We intentionally throw to surface misconfiguration early in dev
  // At runtime, callers can handle via try/catch if importing dynamically
  console.warn('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

export interface IdentificationRecord {
  id?: string;
  created_at?: string;
  user_input_type: 'text' | 'image';
  user_text?: string | null;
  image_mime?: string | null;
  result_name?: string | null;
  result_scientific?: string | null;
  result_confidence?: number | null;
  result_native_region?: string | null;
  result_common_uses?: string | null;
  result_light?: string | null;
  result_watering?: string | null;
  result_temperature?: string | null;
  result_additional_tips?: string[] | null;
  result_care_info?: string | null;
}

export const saveIdentification = async (record: IdentificationRecord) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Configure env variables.');
  }
  const { data, error } = await supabase
    .from('identifications')
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return data as IdentificationRecord;
};


