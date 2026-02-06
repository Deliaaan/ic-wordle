"use client";

import React, { useMemo } from "react";

const ROWS = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKLÑ".split(""),
    ["Enter", ..."ZXCVBNM".split(""), "Backspace"],
]

export default function Keyboard({
    onKey,
    guesses,
    gradeGuess,
}:{
    onKey: (key: string) => void,
    guesses: string[],
    gradeGuess: (guess: string) => ("correct" | "present" | "absent")[],
}) {
    const keyStates = useMemo(() => {
        const map: Record<string, "correct"|"present"|"absent"|"empty"> = {};
        for (const guess of guesses) {
            const states = gradeGuess(guess);
            for (let i = 0; i < guess.length; i++) {
                const ch = guess[i].toUpperCase();
                const st = states[i];
                
                if (st === "correct") {
                    map[ch] = "correct";
                } else if (st === "present" && map[ch] !== "correct") {
                    map[ch] = "present";
                } else if (!map[ch]) {
                    map[ch] = "absent";
                }
            }
        }
        return map;
    }, [guesses, gradeGuess]);

    const getColorClass = (state: string) => {
        const baseClass = "h-12 rounded px-3 font-semibold text-white";
        switch(state) {
            case "correct": return `${baseClass} bg-green-600`;
            case "present": return `${baseClass} bg-yellow-600`;
            case "absent": return `${baseClass} bg-gray-600`;
            default: return `${baseClass} bg-transparent border-white border-1 p-2`;
        }
    };

    return (
        <div className="space-y-2 mt-6">
            {ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2">
                   {row.map((k) => {
                        const state = keyStates[k.toUpperCase()] ?? "empty";    
                        const colorClass = getColorClass(state);
                        return (
                            <button
                                key={k}
                                onClick={() => onKey(k)}
                                className={colorClass}
                                aria-label={`key-${k}`}
                            >
                            {k === "Backspace" ? "⌫" : k}
                            </button>
                        )
                   })}
                </div>
            ))}
        </div>
    )
}
