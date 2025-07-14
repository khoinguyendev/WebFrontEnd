import { ICategory } from "./Category";

export type IBanner = {
  id: number;
  link: string;
  image: string;
  content: string | null;
  position: string;
  category: ICategory;
};
