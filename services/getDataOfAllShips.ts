import axios from 'axios'

const fetchShips = async (page: number): Promise<Ships> => {
  return await axios.get(`https://swapi.dev/api/starships/?page=${page}`);
};

export interface Ships {
  next: string | null,
  results: Array<object>,
  name: string
}

export default fetchShips;