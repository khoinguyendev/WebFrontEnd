import Badge from "../../../components/ui/badge/Badge"
import { TableCell, TableRow } from "../../../components/ui/table"
import { IProductVariant } from "../../../types/ProductVariant"

const ItemVariant = ({ variant }: { variant: IProductVariant }) => {
    if(variant.attributes.length === 0) return null
    return (
        <TableRow >
            
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {variant.sku}
            </TableCell>
           <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {variant.attributes.map((attribute, index) => (
                    <span key={index} className="text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {attribute.attribute.name}: <span className="text-green-500">{attribute.attributeValue.value}</span>
                        {index < variant.attributes.length - 1 ? ", " : ""}
                    </span>
                ))}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {variant.price}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {variant.stockQuantity}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {variant.sale ? "Có" : "Không"}
            </TableCell>
             <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {variant.priceSale}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <button>
                    <Badge
                        size="md"
                        color={
                            "warning"
                        }
                    >Sửa</Badge>
                </button>
                <button >
                    <Badge
                        size="md"
                        color={
                            "error"
                        }
                    >Xóa</Badge>
                </button>
            </TableCell>

        </TableRow>
    )
}

export default ItemVariant