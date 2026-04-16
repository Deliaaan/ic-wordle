import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabaseClient";

function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export async function POST(request: Request) {
  try {
    const { word: guess } = await request.json();
    
    if (!guess || typeof guess !== 'string') {
      return NextResponse.json({ error: "Palabra requerida" }, { status: 400 });
    }

    // Limpiamos el input del usuario (ej: "Zócalo" -> "zocalo")
    const cleanGuess = removeAccents(guess);

    // 2. Consulta al diccionario y a la palabra del día
    // IMPORTANTE: Lee la nota de abajo sobre el diccionario
    const [dictionaryResponse, dailyResponse] = await Promise.all([
      supabase.from("words").select("word").eq("word_clean", cleanGuess).maybeSingle(),
      supabase.from("daily_words").select("daily").order("id", { ascending: false }).limit(1).maybeSingle()
    ]);

    if (dictionaryResponse.error && dictionaryResponse.error.code !== 'PGRST116') {
      return NextResponse.json({ error: "Error al consultar diccionario" }, { status: 500 });
    }

    if (!dictionaryResponse.data) {
      return NextResponse.json({ error: "Palabra inválida" }, { status: 400 });
    }

    if (dailyResponse.error || !dailyResponse.data?.daily) {
      return NextResponse.json({ error: "No se encontró la palabra diaria" }, { status: 500 });
    }

    // 3. Limpiamos la palabra de la base de datos antes de comparar
    const rawSolution = dailyResponse.data.daily; // Ej: "zócalo"
    const cleanSolution = removeAccents(rawSolution); // Queda como "zocalo"
    
    // 4. Comparamos las versiones limpias
    const result = gradeWordle(cleanGuess, cleanSolution);

    return NextResponse.json({
      valid: true,
      correct: cleanGuess === cleanSolution,
      result: result
    });

  } catch (err: any) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Función gradeWordle se mantiene igual...
function gradeWordle(guess: string, solution: string) {
  const wordLength = solution.length;
  const result = Array(wordLength).fill("absent");
  const solutionArr = solution.split("");
  const guessArr = guess.split("");

  for (let i = 0; i < wordLength; i++) {
    if (guessArr[i] === solutionArr[i]) {
      result[i] = "correct";
      solutionArr[i] = ""; 
    }
  }

  for (let i = 0; i < wordLength; i++) {
    if (result[i] !== "correct") {
      const indexInSolution = solutionArr.indexOf(guessArr[i]);
      if (indexInSolution !== -1) {
        result[i] = "present";
        solutionArr[indexInSolution] = ""; 
      }
    }
  }
  return result;
}