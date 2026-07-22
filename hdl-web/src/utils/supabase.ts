import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbdpajectsvsiokzwqtr.supabase.co';
const supabaseKey = 'sb_publishable_PZ-CvdIkZ-WWvBcaFI58Qw_w7rRnYnz';

export const supabase = createClient(supabaseUrl, supabaseKey);
