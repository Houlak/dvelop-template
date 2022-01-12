import axios from '../axios';

export async function getExample(exampleData: string) {
  const res = await axios.post('api/example', exampleData);
  return res.data;
}
