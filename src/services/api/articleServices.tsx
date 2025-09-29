import axios from "@/lib/axios";

export const getArticle = async (page: number) => {
  const response = await axios.get(`/articles/get-article?page=${page}`);
  return response.data;
};

export const getDetailedArticle = async (id:string) =>{
    const response = await axios.get(`articles/main-article/${id}`);
    return response.data;
}