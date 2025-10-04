import {  ArticleDetailResponse, ArticlePayload, GetArticlesResponse } from "@/types/articleTypes";
import { useGetApi, usePostApi } from "../api/useFetchData";
import { addArticle, getArticle, getDetailedArticle } from "@/services/api/articleServices";
import { keepPreviousData } from "@tanstack/react-query";

export function useGetArticle(page:number){
    return useGetApi<GetArticlesResponse>(["article", page],()=>getArticle(page),{
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetDetailedArticle(id:string){
  return useGetApi<ArticleDetailResponse>(["detailArticle", id],()=>getDetailedArticle(id),{
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5
  })
}

export function useDispatchArticle() {
  return usePostApi<ArticleDetailResponse, ArticlePayload>(
    addArticle,
    {
      onSuccess: () => {
        console.log("Article posted successfully!");
      },
    }
  );
}