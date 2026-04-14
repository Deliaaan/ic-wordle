

/**
 * Valida si la palabra enviada es la palabra diaria usando la nueva API protegida.
 * Devuelve true si es la palabra diaria, false si no.
 */
export async function getDailyWord(word: string): Promise<boolean> {
    const cleanWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: cleanWord })
    });
    if (!res.ok) return false;
    const result = await res.json();
    return !!result.correct;
}