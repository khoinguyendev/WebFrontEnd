import { IAttribute } from "./Attribute";
import { IAttributeValue } from "./AttributeValue";

export type IAttributeVariant = {
    id:number;
    attribute:IAttribute;
    attributeValue:IAttributeValue
}