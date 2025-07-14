import { useState } from "react";
import { TableCell, TableRow } from "../../../components/ui/table"
import { IUser } from "../../../types/User";
import { SERVER_HOST } from "../../../configs/UrlServer";
import axios from "axios";
import toast from "react-hot-toast";
interface ItemUserProps {
  user: IUser;
  stt: number;
  deleteSuccess: (id: number) => void;
}
const role = {
    CUSTOMER: "Người dùng",
    STAFF: "Nhân viên",
    MANAGER: "Quản lý",

};
const ItemUser = ({ user, stt, deleteSuccess }: ItemUserProps) => {
    const [isLoading, setIsLoading] = useState(false);
  const deleteUser = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${SERVER_HOST}/users/${id}`);
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
        {user.name}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {user.email}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
       {role[user.role as keyof typeof role]}
      </TableCell>


      {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
      </TableCell> */}

    </TableRow>
  )
}

export default ItemUser