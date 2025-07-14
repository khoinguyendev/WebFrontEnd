import { ICategory } from "./Category";
import { IProduct } from "./Product";

export type ICategoryWithProducts ={
  products: IProduct[];
  category:ICategory;
};


