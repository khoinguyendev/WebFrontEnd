import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_HOST } from "../../../configs/UrlServer";
import SnipperLoading from "../../../utils/SnipperLoading";
import ItemImage from "./ItemImage";
import Pagination from "../../../components/ui/pagination/Pagination";
import { IImage } from "../../../types/Image";
import ModalAddImage from "./ModalAddImage";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";

const ListImage = () => {
    const [pageCurrent, setPageCurrent] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [images, setImages] = useState<IImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${SERVER_HOST}/images?page=${pageCurrent - 1}`);
                setImages(response.data.data.content);
                if (totalPages != response.data.data.totalPages) setTotalPages(response.data.data.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [load, pageCurrent]);
    const deleteImage = (id: string) => {
        const newI = images.filter((i) => i.publicId != id);
        setImages(newI);
    };
    return (
        <>
            <PageMeta
                title="Hình ảnh"
                description="Kho lưu trữ hình ảnh"
            />
            <PageBreadcrumb pageTitle="Hình ảnh" />
            <div className="my-3">
                <button onClick={() => setOpenModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ">
                    Thêm hình ảnh
                </button>
            </div>
            <div className="space-y-6">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        STT
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Hình ảnh
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Url
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
                            {isLoading ? <SnipperLoading /> :
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {images.map((image, index) => (
                                        <ItemImage key={image.id} deleteImage={() => deleteImage(image.publicId)} image={image} stt={20 * (pageCurrent - 1) + index + 1} />
                                    ))}
                                </TableBody>
                            }
                        </Table>
                    </div>
                </div>
            </div>
            {totalPages != null && totalPages > 0 && <Pagination pageCurrent={pageCurrent} setPageCurrent={setPageCurrent} totalPages={totalPages} />}

            {openModal && <ModalAddImage setOpenModal={setOpenModal} setLoad={setLoad} />}
        </>
    )
    //   return (
    //     <div>
    //       <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
    //         <div className="w-full mb-1">
    //           <div className="mb-4">
    //             <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Kho lưu trữ</h1>
    //           </div>
    //           <button
    //             type="button"
    //             onClick={() => setOpenModal(true)}
    //             className="block text-white bg-green-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
    //           >
    //             Thêm ảnh
    //           </button>
    //         </div>
    //       </div>
    //       <div className="flex flex-col">
    //         <div className="overflow-x-auto">
    //           <div className="inline-block min-w-full align-middle">
    //             <div className="overflow-hidden shadow">
    //               <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
    //                 <thead className="bg-gray-100 dark:bg-gray-700">
    //                   <tr>
    //                     <th scope="col" className="p-4">
    //                       <div className="flex items-center">
    //                         {/* <input id="checkbox-all" type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /> */}
    //                         <label htmlFor="checkbox-all" className="sr-only">
    //                           checkbox
    //                         </label>
    //                       </div>
    //                     </th>
    //                     <th scope="col" className="p-4 w-[2rem] text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
    //                       <div className="flex items-center">STT</div>
    //                     </th>

    //                     <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
    //                       Hình ảnh
    //                     </th>
    //                     <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
    //                       Url
    //                     </th>
    //                     <th scope="col" className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
    //                       Hành động
    //                     </th>
    //                   </tr>
    //                 </thead>
    //                 <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
    //                   {isLoading ? (
    //                     <tr>
    //                       <td colSpan={100} className="text-center py-4">
    //                         <SnipperLoading />
    //                       </td>
    //                     </tr>
    //                   ) : (
    //                     images.length > 0 && images?.map((image, index) => <ItemImage key={image.id} deleteImage={() => deleteImage(image.publicId)} image={image} stt={20 * (pageCurrent - 1) + index + 1} />)
    //                   )}
    //                 </tbody>
    //               </table>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       {totalPages!=null&&totalPages>0 && <Pagination pageCurrent={pageCurrent} setPageCurrent={setPageCurrent} totalPages={totalPages} />}

    //       {openModal && <ModalAddImage setOpenModal={setOpenModal} setLoad={setLoad}/>}
    //     </div>
    //   );
};

export default ListImage;