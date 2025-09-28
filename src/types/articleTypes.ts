export interface Article {
  _id: string;
  title: string;
  description: string;
  author: string;
  image: string;
  slug: string;
  datePublished: string; // ISO string
  createdAt: string;     // ISO string
  updatedAt: string;     // ISO string
  __v: number;
}

export interface GetArticlesResponse {
  page: number;
  limit: number;
  totalPages: number;
  totalArticles: number;
  articles: Article[];
}