import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table"
import { IProductVariant } from "../../../types/ProductVariant"
import ItemVariant from "./ItemVariant"

const ListProductVariant = ({variants}:{variants:IProductVariant[]|undefined}) => {
    if (!variants) return null
    if (variants.length === 0) return <div className="text-center text-gray-500">Chưa có sản phẩm nào</div>
    return (
        <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>

                    
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Mã sản phẩm
                    </TableCell>
                     <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Thuộc tính
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Giá
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Tồn kho
                    </TableCell>
                    
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Giảm giá
                    </TableCell>
                     <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Giá sau giảm
                    </TableCell>
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                        Hành động
                    </TableCell>
                </TableRow>
            </TableHeader>

            {/* Table Body */}

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {variants.map((variant) => (
                    <ItemVariant key={variant.id} variant={variant} />
                ))}
            </TableBody>

        </Table>
    )
}

export default ListProductVariant