
// import axios from "axios";
// const BASE_URL = 'https://rae-api.com/api'

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*, https://rae-api.com';
// function cleanWord(word: string): string {
//     return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
// }

// async function getDailyWord(): Promise<string> {
//   const response = await axios.get(`${BASE_URL}/random`, { params: { max_length: 5, min_length: 5 } });
//   const data = await response.data?.data;
//   const word = data.word;
//   return cleanWord(word);
// }

// export {
//     getDailyWord,
// }