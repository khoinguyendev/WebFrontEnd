import Badge from "../../../components/ui/badge/Badge"
import { TableCell, TableRow } from "../../../components/ui/table"
import { formatDate } from "../../../utils/Format";
import axios from "axios";
import { SERVER_HOST } from "../../../configs/UrlServer";
import toast from "react-hot-toast";
import { useState } from "react";
import ButtonLoading from "../../../utils/ButtonLoading";
import { IOrder } from "../../../types/Order";
import ModalDetailOrder from "./ModalDetailOrder";
interface ItemOrderProps {
  order: IOrder;
  stt: number;
  deleteSuccess: (id: string) => void;
}
const status = {
  PENDING: "Xác nhận",
  PREPARING: "Giao hàng",
  DELIVERING: "Đã giao",
  DELIVERED: "Hoàn thành",
};
const ItemOrder = ({ order, stt, deleteSuccess }: ItemOrderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleConfirm = async (id: string, status: string) => {
    if (status === "PENDING") {
      status = "PREPARING";
    } else if (status === "PREPARING") {
      status = "DELIVERING";
    } else if (status === "DELIVERING") {
      status = "DELIVERED";
    } else {
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(`${SERVER_HOST}/orders/${id}`, {
        status: status,
      });
      toast.success("Đã cập nhật đơn hàng");
      deleteSuccess(id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = async (id: string) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
        if (!confirmed) return;

        try {
            setIsLoading(true);
            const data = {
                status: "CANCELED"
            }
            await axios.put(`${SERVER_HOST}/orders/${id}`, data);
            toast.success("Hủy đơn thành công");
            deleteSuccess(id);
        } catch (error) {
            console.log(error);
            toast.error("Hủy đơn không thành công");
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <>
      <TableRow >

        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {stt}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {order.id}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {/* <p>{order.user.name}</p> */}
          <p>{order.phone}</p>
          <p className="line-clamp-1">{order.address}</p>

        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {order.totalPrice.toLocaleString()}đ
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {formatDate(order.createdAt)}
        </TableCell>

        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <button onClick={() => setOpenModal(true)}
          >
            <Badge
              size="md"
              color={
                "info"
              }
            >Xem chi tiết</Badge>
          </button>
          <button onClick={() => handleConfirm(order.id, order.status)}>
            <Badge
              size="md"
              color={
                "warning"
              }
            >            {isLoading ? <ButtonLoading /> : status[order.status as keyof typeof status]}
            </Badge>
          </button>
          {order.status != "DELIVERED" && order.status != "CANCELED" && <button disabled={isLoading} onClick={()=>handleCancel(order.id)}>
            <Badge
              size="md"
              color={
                "error"
              }
            >{isLoading ? <ButtonLoading /> : "Hủy"}</Badge>
          </button>}

        </TableCell>
        {openModal && <ModalDetailOrder setOpenModal={setOpenModal} order={order} />}

      </TableRow>
    </>

  )
}

export default ItemOrder