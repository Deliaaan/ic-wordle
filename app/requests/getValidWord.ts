import axios from "axios";

const DEFAULT_PROXY = process.env.PROXY_URL || 'http://localhost:4000';

function cleanWord(word: string): string {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

async function getValidWord(): Promise<string> {
    const key = process.env.X_API_KEY;

    if (!key) { 
        throw new Error("API Key required to call proxy")
    }
    
    const BASE_URL = process.env.PROXY_URL || 'http://localhost:4000';

    const resp = await axios.get(`${DEFAULT_PROXY}/api/daily`, {
        headers: { 'X-API-KEY': key }
    })

    return cleanWord(resp.data.word);
}