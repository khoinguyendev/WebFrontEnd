import { Link } from "react-router";
import Badge from "../../../components/ui/badge/Badge"
import { TableCell, TableRow } from "../../../components/ui/table"
import { IBrand } from "../../../types/Brand"
import { formatDate } from "../../../utils/Format";
import axios from "axios";
import { SERVER_HOST } from "../../../configs/UrlServer";
import toast from "react-hot-toast";
import { useState } from "react";
import ButtonLoading from "../../../utils/ButtonLoading";
interface ItemBrandProps {
  brand: IBrand;
  stt: number;
  deleteSuccess: (id: number) => void;
}
const ItemBrand = ({ brand,stt, deleteSuccess }: ItemBrandProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const deleteBrand = async (id: number) => {
        try {
            setIsLoading(true);
            await axios.delete(`${SERVER_HOST}/brands/${id}`);
            toast.success("Xóa thành công");
            deleteSuccess(id);
        } catch (error) {
            console.log(error);
            toast.error("Xóa thất bại");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <TableRow >
            
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {stt}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {brand.name}
            </TableCell>
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {formatDate(brand.createdAt)}
            </TableCell>

            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <Link to={`/tables/brand/edit/${brand.id}`}>
                    <Badge
                        size="md"
                        color={
                            "warning"
                        }
                    >Sửa</Badge>
                </Link>
                <button disabled={isLoading} onClick={() => deleteBrand(brand.id)}>
                    <Badge
                        size="md"
                        color={
                            "error"
                        }
                    >{isLoading?<ButtonLoading/>:"Xóa"}</Badge>
                </button>
            </TableCell>

        </TableRow>
    )
}

export default ItemBrand