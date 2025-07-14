export type IOderDetail = {
    id: number;
    product:IProductOrderItem;
    quantity:number;
    message:string;
    price:number;
}

type IProductOrderItem = {
    id: number;
    price: number;
    priceSale: number | undefined;
    sku: string;
    sale: boolean;
    stockQuantity: number;

    name: string;
    image: string;
}