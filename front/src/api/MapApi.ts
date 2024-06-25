import axios from 'axios';

export const MapApi = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const findCenter = async (jsondata: any) => {
  const response = await MapApi.post('/api/map/findcenter', jsondata);
  console.log(response.data);
  return response.data;
};
