export type ArticleList = {
  slug: string;
  category: string;
  subtitle: string;
  title: string;
}[];

export type Feedback = {
  rating: number;
  comments: string;
};

export type SessionUpdate = {
  page?: number;
  resolved?: boolean;
  rating?: number;
  comments?: string;
};

export type ArticleStats = {
  sessions: number;
  resolved: number;
  ratings: number;
  averageRating: number | null;
  resolvedByPage: { page: number; count: number }[];
};

export type ArticleDetail = {
  _id: string;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  pages: {
    _id: string;
    title: string;
    imgURL?: string;
    content: string;
    page: number;
  }[];
};
