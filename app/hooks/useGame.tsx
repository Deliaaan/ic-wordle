"use client";

import { useCallback, useEffect, useState } from "react";
import { getDailyWord } from "../requests/getDailyWord";
import { getValidWord } from "../requests/getValidWord";
import { toast, Bounce } from "react-toastify";

export type LetterState = "correct" | "present" | "absent" | "empty";

export function useGame({
  wordLength = 5,
  maxGuesses = 6,
}: {
  solution?: string;
  wordLength?: number;
  maxGuesses?: number;
} = {}) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);
  const [solution, setSolution] = useState<string>("");

  useEffect(() => {
    const upSol = solution.toUpperCase();
    if (guesses.includes(upSol)) setFinished(true);
    if (guesses.length >= maxGuesses && !guesses.includes(upSol)) setFinished(true);
  }, [guesses, solution, maxGuesses]);

  useEffect(() => {
    async function fetchDailyWord() {
      const word = await getDailyWord();
      if (word) {
        setSolution(word);
      }
    }
    fetchDailyWord();
  }, []);


  const addLetter = useCallback(
    (l: string) => {
      if (finished) return;
      if (current.length >= wordLength) return;
      setCurrent((c) => (c + l).slice(0, wordLength).toUpperCase());
    },
    [current, finished, wordLength]
  );

  const removeLetter = useCallback(() => {
    if (finished) return;
    setCurrent((c) => c.slice(0, -1));
  }, [finished]);

  const submit = useCallback(async () => {
  if (finished) return;
  if (current.length !== wordLength) return;

  try {
    // Valida la palabra primero
    const isValid = await getValidWord(current);
    console.log("Current word: ", current);
    console.log("Is valid:", isValid);  // Registra el resultado de la validación sin llamar de nuevo
    setGuesses((g) => [...g, current.toUpperCase()]);
  } catch (err) {
    toast.error("Palabra no válida", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  } finally {
    setCurrent("");
  }
}, [current, finished, wordLength]);

  function gradeGuess(guess: string) {
    const res: LetterState[] = Array(wordLength).fill("absent");
    const sol = solution.toUpperCase().split("");
    const g = guess.toUpperCase().split("");

    g.forEach((ch, i) => {
      if (ch === sol[i]) {
        res[i] = "correct";
        sol[i] = "";
      }
    });

    g.forEach((ch, i) => {
      if (res[i] === "correct") return;
      const idx = sol.indexOf(ch);
      if (idx !== -1) {
        res[i] = "present";
        sol[idx] = "";
      } else {
        res[i] = "absent";
      }
    });

    return res;
  }

  return {
    guesses,
    current,
    finished,
    addLetter,
    removeLetter,
    submit,
    gradeGuess,
  };
}