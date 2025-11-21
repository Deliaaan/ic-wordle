import axios from "axios";

async function getValidWord(word: string): Promise<boolean> {
    const key = process.env.X_API_KEY;

    if (!key) { 
        throw new Error("API Key required to call proxy")
    }
    
    const BASE_URL = process.env.PROXY_URL || 'http://localhost:4000';

    try {
        const resp = await axios.get(`${BASE_URL}/api/words/${word}`, {
            headers: { 'X-API-KEY': key}, 
            params: { length: 5},
            validateStatus: status => status < 500
        })
        const payload = resp.data;
        const exists = Boolean(payload?.word)||Boolean(payload?.data?.word);

    if (!exists) {
      throw new Error("Word not valid");
    }
    return true;
    }catch (err) {
        throw err;
    }

}


export {
    getValidWord,
}