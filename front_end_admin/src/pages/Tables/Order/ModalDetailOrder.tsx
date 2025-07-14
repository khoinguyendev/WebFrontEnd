import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table"
import { IOrder } from "../../../types/Order"
import {  urlList } from "../../../utils/Format"

const ModalDetailOrder = ({ setOpenModal, order }: { setOpenModal: (b: boolean) => void, order: IOrder }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-95 z-9999 px-4">
            <div className="bg-white w-full max-w-3xl h-[90vh] rounded-lg shadow-lg relative p-6 flex flex-col gap-4 overflow-hidden">
                {/* Nút đóng */}
                <button
                    onClick={() => setOpenModal(false)}
                    className="absolute top-2 right-2 h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                    ✕
                </button>
                <div className="h-[90vh] overflow-y-auto rounded-lg">
                    <h2 className="text-xl  text-center">Thông tin đơn hàng</h2>
                    <div className="grid grid-cols-1 gap-6 mt-4">
                        <div>
                            <p>Tên người đặt: {order.user.name}</p>
                            <p>Số điện thoại: {order.phone}</p>
                            <p>Địa chỉ: {order.address}</p>
                        </div>
                        <div>
                            <Table>
                                {/* Table Header */}
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>

                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Tên sản phẩm
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Ảnh
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Số lượng
                                        </TableCell>

                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Đơn giá
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Thành tiền
                                        </TableCell>

                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {order.orderDetails.map((order) => (
                                        <TableRow key={order.id}>


                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {order.product.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <img src={order.product.image && urlList(order.product.image)} alt="Uploaded" className=" h-20 object-cover rounded" />
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {order.quantity}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {order.price.toLocaleString()}đ
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {(order.quantity * order.price).toLocaleString()}đ
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default ModalDetailOrder