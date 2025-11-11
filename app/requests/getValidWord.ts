
import axios from "axios";
const BASE_URL = 'https://rae-api.com/api'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*, https://rae-api.com';

async function getValidWord(word: string): Promise<string> {
  const response = await axios.get(`${BASE_URL}/words/${word}`, { params: { max_length: 5, min_length: 5 } });
  const data = await response.data?.data;
  return data.word;
}

export {
    getValidWord,
}