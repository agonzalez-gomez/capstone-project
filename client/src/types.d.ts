export type ArticleList = {
  slug: string;
  category: string;
  subtitle: string;
  title: string;
}[];

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
