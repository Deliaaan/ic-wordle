import axios from "axios";
import 'dotenv/config';

async function getValidWord(word: string): Promise<boolean> {
    const key = process.env.NEXT_PUBLIC_X_API_KEY;

    if (!key) { 
        throw new Error("API Key required to call proxy")
    }
    
    const BASE_URL = process.env.PROXY_URL || 'http://localhost:4000';

    try {
        const resp = await axios.get(`${BASE_URL}/api/words/${word.toLowerCase()}`, {
            headers: { 'X-API-KEY': key}, 
            validateStatus: status => status < 500
        })
        const payload = resp.data;
        console.log('Valid word response:', resp.status, payload);
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