import { supabase } from "../utils/supabaseClient";

export async function getWords() {
  const { data, error } = await supabase
    .from("words") // Cambia "words" por el nombre de tu tabla
    .select("*");
  if (error) throw error;
  return data;
}
