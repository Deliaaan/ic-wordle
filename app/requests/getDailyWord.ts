
import axios from "axios";

function cleanWord(word: string): string {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

async function getDailyWord(): Promise<string> {
    const key = process.env.X_API_KEY;
    if (!key) {
        throw new Error("API Key required to call proxy")
    }
    const BASE_URL = process.env.PROXY_URL || 'http://localhost:4000'; // Esto solo es para desarrollo???

    const resp = await axios.get(`${BASE_URL}/api/daily`, {
        headers: { 'X-API-KEY': key }
    })

    const payload = resp.data;
    const word = payload.word || payload?.data?.word;

    if (!word) {
        throw new Error("No word found in rae proxy response xd")
    }

    return cleanWord(word);
}

// async function getDailyWord(): Promise<string> {
//   const response = await axios.get(`${BASE_URL}/random`, { params: { max_length: 5, min_length: 5 } });
//   const data = await response.data?.data;
//   const word = data.word;
//   return cleanWord(word);
// }

export {
    getDailyWord,
}