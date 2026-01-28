
import axios from "axios";
//import { environment } from '../environments/dev';



function cleanWord(word: string): string {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

async function getDailyWord(): Promise<string> {
    const key = process.env.NEXT_PUBLIC_X_API_KEY;

    //console.log('Client API Key:', key);

    if (!key) {
        throw new Error("API Key required to call proxy")
    }
    const BASE_URL = process.env.PROXY_URL || 'http://localhost:4000'; //Esto solo es para desarrollo???

    console.log('Calling:', `${BASE_URL}/api/daily`);
    const resp = await axios.get(`${BASE_URL}/api/daily`, {
        headers: { 'X-API-KEY': key },
    });

    const payload = resp.data; 
    const word = payload.word || payload?.data?.word;

    if (!word) {
        throw new Error("No word found in rae proxy response xd")
    }

    return cleanWord(word);
}


export {
    getDailyWord,
}