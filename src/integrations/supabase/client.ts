// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jqhhsdsilsvathnesblu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaGhzZHNpbHN2YXRobmVzYmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMjQyNDIsImV4cCI6MjA2MDcwMDI0Mn0.UMenFlK23nJxQqLG4Kulq1Yqlva4kRz554SAZuzKWWs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);