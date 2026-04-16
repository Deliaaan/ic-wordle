"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export type LetterState = "correct" | "present" | "absent" | "empty";

// Definimos un tipo para el historial con los resultados del servidor
type GuessHistory = {
  word: string;
  result: LetterState[];
};

export function useGame({ wordLength = 6, maxGuesses = 6 } = {}) {
  // Ahora guardamos objetos de tipo GuessHistory
  const [history, setHistory] = useState<GuessHistory[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);

  const addLetter = useCallback((l: string) => {
    if (finished) return;
    setCurrent((c) => (c.length < wordLength ? (c + l).toUpperCase() : c));
  }, [finished, wordLength]);

  const removeLetter = useCallback(() => {
    if (finished) return;
    setCurrent((c) => c.slice(0, -1));
  }, [finished]);

  const submit = useCallback(async () => {
    if (finished || current.length !== wordLength) return;

    try {
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: current })
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        setCurrent("");
        return;
      }

      // Guardamos la palabra Y el resultado que calculó el servidor
      const newHistory = [...history, { word: current, result: data.result }];
      setHistory(newHistory);
      setCurrent("");

      if (data.correct || newHistory.length >= maxGuesses) {
        setFinished(true);
      }
    } catch (err) {
      toast.error("Error de conexión");
    }
  }, [current, finished, history, maxGuesses, wordLength]);

  return {
    history,
    current,
    finished,
    addLetter,
    removeLetter,
    submit,
  };
}