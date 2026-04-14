import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabaseClient";

// POST /api/daily
export async function POST(request: Request) {
  try {
    const { word } = await request.json();
    if (!word || typeof word !== "string") {
      return NextResponse.json({ error: "Palabra requerida" }, { status: 400 });
    }

    // Obtener la palabra diaria
    const { data, error } = await supabase
      .from("daily_words") // Cambia por el nombre real de tu tabla
      .select("daily")
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

      const dailyWord = data?.daily?.toLowerCase();
    if (!dailyWord) {
      return NextResponse.json({ error: "No se encontró la palabra diaria" }, { status: 500 });
    }

    // Validar la palabra enviada
      const isCorrect = word.toLowerCase() === dailyWord;
    return NextResponse.json({ correct: isCorrect });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 });
  }
}
