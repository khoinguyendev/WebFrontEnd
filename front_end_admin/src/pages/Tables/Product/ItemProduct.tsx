import { Link } from "react-router"
import Badge from "../../../components/ui/badge/Badge"
import { TableCell, TableRow } from "../../../components/ui/table"
import { IProduct } from "../../../types/Product"
import { urlList } from "../../../utils/Format"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"

const ItemProduct = ({ product, STT }: { product: IProduct, STT: number }) => {
          const { user } = useSelector((state: RootState) => state.auth);

    return (
        <TableRow >
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {STT}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {product.name}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <img src={product.image && urlList(product.image)} alt="Uploaded" className=" h-20 object-cover rounded" />
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {product.category.name}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {product.brand.name}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {product.variants[0].price.toLocaleString()}đ
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {product.variants[0].sale ? "Có" : "Không"}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {product.variants[0].stockQuantity}
            </TableCell>
            { user?.role !== "STAFF" && (
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Link to={`/product/edit/${product.id}`}>
                        <Badge
                            size="md"
                            color={
                                "warning"
                            }
                        >Sửa</Badge>
                    </Link>
                    <button >
                        <Badge
                            size="md"
                            color={
                                "error"
                            }
                        >Xóa</Badge>
                    </button>
                </TableCell>
            )}
        </TableRow>
    )
}

export default ItemProduct