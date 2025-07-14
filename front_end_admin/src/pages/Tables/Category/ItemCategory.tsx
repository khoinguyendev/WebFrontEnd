import { TableCell, TableRow } from "../../../components/ui/table"
import { ICategory } from "../../../types/Category";
import ButtonLoading from "../../../utils/ButtonLoading"
import { Link } from "react-router";
import Badge from "../../../components/ui/badge/Badge";
import { useState } from "react";
import { SERVER_HOST } from "../../../configs/UrlServer";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate, urlImage } from "../../../utils/Format";
interface ItemCategoryProps {
  category: ICategory;
  stt: number;
  deleteSuccess: (id: number) => void;
}
const ItemCategory = ({ category, stt, deleteSuccess }: ItemCategoryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const deleteCategory = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${SERVER_HOST}/categories/${id}`);
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
        {category.name}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <img src={category.image && urlImage(category.image)} alt="Uploaded" className=" h-20 object-cover rounded" />
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {category.showHome ? "Có" : "Không"}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {formatDate(category.createdAt)}
      </TableCell>

      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <Link to={`/tables/category/edit/${category.id}`}>
          <Badge
            size="md"
            color={
              "warning"
            }
          >Sửa</Badge>
        </Link>
        <button disabled={isLoading} onClick={() => deleteCategory(category.id)}>
          <Badge
            size="md"
            color={
              "error"
            }
          >{isLoading ? <ButtonLoading /> : "Xóa"}</Badge>
        </button>
      </TableCell>

    </TableRow>
  )
}

export default ItemCategory