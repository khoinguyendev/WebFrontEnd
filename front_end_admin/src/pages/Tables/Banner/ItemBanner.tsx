import { useState } from "react";
import { IBanner } from "../../../types/Banner";
import axios from "axios";
import { SERVER_HOST } from "../../../configs/UrlServer";
import toast from "react-hot-toast";
import { TableCell, TableRow } from "../../../components/ui/table";
import { formatDate, urlImage } from "../../../utils/Format";
import { Link } from "react-router";
import Badge from "../../../components/ui/badge/Badge";
import ButtonLoading from "../../../utils/ButtonLoading";

interface ItemBannerProps {
  banner: IBanner;
  stt: number;
  deleteSuccess: (id: number) => void;
}
const ItemBanner = ({ banner, stt, deleteSuccess }: ItemBannerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const deleteBanner = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${SERVER_HOST}/banners/${id}`);
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
        {banner.title}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <img src={banner.image && urlImage(banner.image)} alt="Uploaded" className=" h-20 object-cover rounded" />
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {banner.position}
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {formatDate(banner.createdAt)}
      </TableCell>

      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <Link to={`/tables/banner/edit/${banner.id}`}>
          <Badge
            size="md"
            color={
              "warning"
            }
          >Sửa</Badge>
        </Link>
        <button disabled={isLoading} onClick={() => deleteBanner(banner.id)}>
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

export default ItemBanner