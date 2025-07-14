import { IAttributeVariant } from "./AttributeVariant";

export type IProductVariant = {
    id: number;
    price: number;
    priceSale: number | undefined;
    sku: string;
    sale: boolean;
    attributes:IAttributeVariant[];
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
}