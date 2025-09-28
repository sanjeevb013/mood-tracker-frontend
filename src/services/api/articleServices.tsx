import axios from "@/lib/axios";

export const getArticle = async (page: number) => {
  const response = await axios.get(`/articles/get-article?page=${page}`);
  return response.data;
};
