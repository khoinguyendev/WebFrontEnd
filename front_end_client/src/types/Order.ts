import { IUser } from "./User";
import { IOderDetail } from "./OrderDetail";

export type IOrder = {
    id:string;
    user:IUser;
    totalPrice:number;
    status:string;
    phone:string;
    address:string;
     shippingPrice:number;
    productPrice:number;
    paymentStatus:string;
    orderDetails:IOderDetail[];
    paymentMethod:string;
    createdAt:string;
    updatedAt:string;

}

