import axios from '@/lib/axios';
import { UpdateProfile } from '@/types/profileTypes';

export const getProfile = async (userId:string) => {
    const resp = await axios.get(`/profile/${userId}`)
    return resp.data
}

export const updateProfile = async (userId:string,profile:UpdateProfile) => {
    const resp = await axios.put(`/profile/${userId}`, profile)
    return resp.data
}

