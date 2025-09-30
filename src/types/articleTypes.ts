//get Article response
export interface Article {
  _id: string;
  title: string;
  description: string;
  author: string;
  image: string;
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

// Get Detail Article response
export interface ArticleDetailResponse {
  success: boolean;
  data: ArticleDetail;
}

export interface ArticleDetail {
  _id: string;
  articleId: ArticleCard;
  title: string;
  description: string;
  author: string;
  image: string;
  date: string; // ISO date string
  content: ContentBlock[];
  __v: number;
}

export interface ArticleCard {
  _id: string;
  title: string;
  description: string;
  author: string;
  image: string;
  datePublished: string; // ISO date string
}

// export interface BulletPoint {
//   text: string;
// }

export interface ContentBlock {
  _id: string;
  header: string;
  paragraphs: string[];
  bulletPoints: [];
}


// ADD Article types

export interface ArticlePayload {
  title: string;
  description: string;
  author: string;
  date: string; // ISO date string
  image: string;
  content: ArticleSection[];
}

export interface ArticleSection {
  header: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}