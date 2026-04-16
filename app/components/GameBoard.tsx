"use client";

import React, { useEffect, useMemo } from "react";
import { useGame } from "../hooks/useGame";
import Keyboard from "./keyboard";

export default function GameBoard() {
  // 1. Desestructuramos 'history' en lugar de 'guesses'
  const { history, current, addLetter, removeLetter, submit } = useGame();

  // 2. Creamos una lista de palabras simple para la lógica de las filas
  const guessesWords = useMemo(() => history.map((h) => h.word), [history]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "Enter") { e.preventDefault(); return submit(); }
      if (k === "Backspace") { e.preventDefault(); return removeLetter(); }
      if (/^[a-zA-ZñÑ]$/.test(k)) { e.preventDefault(); return addLetter(k.toUpperCase()); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addLetter, removeLetter, submit]);

  // 3. Ajustamos la generación de filas usando las palabras del historial
  const rows = [...guessesWords, current].concat(Array(6).fill("")).slice(0, 6);

  return (
    <div className="mx-auto max-w-md">
      <div className="grid grid-rows-6 gap-3">
        {rows.map((row, ri) => {
          const isSubmitted = ri < history.length;
          // 4. Obtenemos los estados directamente del historial (ya calculados por el servidor)
          const states = isSubmitted ? history[ri].result : [];
          
          return (
            <div key={ri} className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, ci) => {
                const ch = (row || "")[ci] || "";
                const state = isSubmitted ? states[ci] : "empty";

                const colorClass =
                  state === "correct"
                    ? "bg-green-500 text-white border-green-600"
                    : state === "present"
                    ? "bg-yellow-400 text-black border-yellow-500"
                    : state === "absent"
                    ? "bg-zinc-700 text-white border-zinc-600"
                    : "bg-transparent border-zinc-400 dark:border-zinc-700";

                return (
                  <div key={ci} className={`aspect-square w-full flex items-center justify-center text-2xl font-bold border-2 ${colorClass}`}>
                    {ch}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      
      <Keyboard 
        onKey={(key) => {
          if (key === "Enter") submit();
          else if (key === "Backspace") removeLetter();
          else addLetter(key);
        }}
        guesses={guessesWords}
        // Pasamos una función que simplemente busque el estado en el historial si es necesario
        gradeGuess={() => []} 
      />
    </div>
  );
}
