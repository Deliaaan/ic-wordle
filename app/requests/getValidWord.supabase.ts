// import { NextResponse } from "next/server";
// import { supabase } from "@/app/utils/supabaseClient";
// import { getValidWord } from "@/app/requests/getValidWord.supabase"; // Asegura que la ruta sea correcta

// export async function POST(request: Request) {
//   try {
//     const { word: guess } = await request.json();
    
//     // 1. Validación de Diccionario usando tu función existente
//     const isValid = await getValidWord(guess);

//     if (!isValid) {
//       return NextResponse.json({ 
//         valid: false, 
//         error: "Esa palabra no existe en nuestro diccionario." 
//       });
//     }

//     // 2. Obtención de palabra diaria (Solo si la palabra del usuario es válida)
//     const { data: solutionData } = await supabase
//       .from("daily_words")
//       .select("daily")
//       .order("id", { ascending: false })
//       .limit(1)
//       .maybeSingle();

//     if (!solutionData?.daily) {
//       return NextResponse.json({ error: "Error al recuperar la solución" }, { status: 500 });
//     }

//     const solution = solutionData.daily.toLowerCase();
//     const result = gradeWordle(guess.toLowerCase(), solution);

//     return NextResponse.json({
//       valid: true,
//       correct: guess.toLowerCase() === solution,
//       result
//     });

//   } catch (err: any) {
//     return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 });
//   }
// }

// function gradeWordle(guess: string, solution: string) {
//   const result = Array(solution.length).fill("absent");
//   const solArr = solution.split("");
//   const gueArr = guess.split("");

//   gueArr.forEach((char, i) => {
//     if (char === solArr[i]) {
//       result[i] = "correct";
//       solArr[i] = "";
//     }
//   });

//   gueArr.forEach((char, i) => {
//     if (result[i] !== "correct" && solArr.includes(char)) {
//       result[i] = "present";
//       solArr[solArr.indexOf(char)] = "";
//     }
//   });

//   return result;
// }