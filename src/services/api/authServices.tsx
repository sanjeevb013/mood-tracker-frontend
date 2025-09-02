import axios from '@/lib/axios';

export const signup = async () => {
  const response = await axios.post('/auth/signup');
  return response.data;
};
