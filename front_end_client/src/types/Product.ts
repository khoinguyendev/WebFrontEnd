import { IBrand } from "./Brand";
import { ICategory } from "./Category";
import { IProductVariant } from "./ProductVariant";

export type IProduct = {
    id: number;
    name: string;
    image: string;
    description: string;
    detail: string;
    createdAt: string;
    updatedAt: string;
    category: ICategory;
    brand: IBrand;
    variants: IProductVariant[];
}
export type IProductToday = {
  id: number;
  product: IProduct;
};
