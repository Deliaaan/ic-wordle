"use client";

import React, { use, useEffect } from "react";
import { useGame } from "../hooks/useGame";
import Keyboard from "./keyboard";

export default function GameBoard() {
  const { guesses, current, addLetter, removeLetter, submit, gradeGuess } =
    useGame();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key;
      if (k === "Enter") {
        e.preventDefault();
        return submit();
      }
      if (k === "Backspace") {
        e.preventDefault();
        return removeLetter();
      }
      if (/^[a-zA-Z]$/.test(k)) {
        e.preventDefault();
        return addLetter(k.toUpperCase());
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addLetter, removeLetter, submit]);

  const rows = [...guesses, current].concat(Array(6).fill("")).slice(0, 6);

  return (
    <div className="mx-auto max-w-md">
      <div className="grid grid-rows-6 gap-3">
        {rows.map((row, ri) => {
          const isSubmitted = ri < guesses.length;
          const states = isSubmitted ? gradeGuess(guesses[ri]) : [];
          return (
            <div key={ri} className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, ci) => {
                const ch = (row || "")[ci] || "";
                const state: "correct" | "present" | "absent" | "empty" =
                  isSubmitted ? (states[ci] as any) : "empty";

                const colorClass =
                  state === "correct"
                    ? "bg-green-500 text-white border-green-600"
                    : state === "present"
                    ? "bg-yellow-400 text-black border-yellow-500"
                    : state === "absent"
                    ? "bg-zinc-700 text-white border-zinc-600"
                    : "bg-transparent border-zinc-400 dark:border-zinc-700";

                return (
                  <div
                    key={ci}
                    className={`aspect-square w-full flex items-center justify-center text-2xl font-bold border-2 ${colorClass}`}
                  >
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
        guesses={guesses}
        gradeGuess={(guess: string) => gradeGuess(guess).filter((state) => state !== "empty") as ("correct" | "present" | "absent")[]}
      />
    </div>
  );
}
