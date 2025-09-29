import {  ArticleDetailResponse, GetArticlesResponse } from "@/types/articleTypes";
import { useGetApi } from "./api/useFetchData";
import { getArticle, getDetailedArticle } from "@/services/api/articleServices";
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