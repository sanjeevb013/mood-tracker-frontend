import axios from '@/lib/axios';
import { LoginData, SignupPayload } from "../../types/authTypes"

export const signup = async (data:SignupPayload) => {
  const response = await axios.post('/auth/signup',data);
  return response.data;
};

export const loginApi = async (data:LoginData) => {
  const response = await axios.post('/auth/login',data);
  return response.data;
};
