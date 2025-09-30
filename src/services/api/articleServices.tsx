import axios from "@/lib/axios";
import { ArticlePayload } from "@/types/articleTypes";

export const getArticle = async (page: number) => {
  const response = await axios.get(`/articles/get-article?page=${page}`);
  return response.data;
};

export const getDetailedArticle = async (id:string) =>{
    const response = await axios.get(`articles/main-article/${id}`);
    return response.data;
}

//add article 
export const addArticle = async (data:ArticlePayload) =>{
    const response = await axios.post("articles/add-article",data);
    return response.data;
}