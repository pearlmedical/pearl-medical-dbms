// db.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynymhvbgvgsbxmkxckut.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueW1odmJndmdzYnhta3hja3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQxMDU0MDYsImV4cCI6MjAxOTY4MTQwNn0.gIk1HNmszxG2CzT0HVA53t2rnfPUA-iG8G5xEHkUmxQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
