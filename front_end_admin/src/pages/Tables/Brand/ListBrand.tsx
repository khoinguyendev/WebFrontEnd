import { useEffect, useState } from "react"
import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import PageMeta from "../../../components/common/PageMeta"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table"
import SnipperLoading from "../../../utils/SnipperLoading"
import { IBrand } from "../../../types/Brand"
import axios from "axios"
import { SERVER_HOST } from "../../../configs/UrlServer"
import ItemBrand from "./ItemBrand"
import { Link } from "react-router"
import Pagination from "../../../components/ui/pagination/Pagination"

const ListBrand = () => {
    const [pageCurrent, setPageCurrent] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${SERVER_HOST}/brands?page=${pageCurrent - 1}`);
                if (totalPages != response.data.data.totalPages) setTotalPages(response.data.data.totalPages);
                setBrands(response.data.data.content);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [pageCurrent]);
    const deleteSuccess = async (id: number) => {
        setBrands(brands.filter((brand) => brand.id !== id));

    };
    return (
        <>
            <PageMeta
                title="Thương hiệu"
                description="Danh sách thương hiệu"
            />
            <PageBreadcrumb pageTitle="Thương hiệu" />
            <div className="my-3">
                <Link to={"/tables/brand/add"} className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ">
                    Thêm thương hiệu
                </Link>
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
                                        Tên
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Ngày tạo
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
                                    {brands.map((brand, index) => (
                                        <ItemBrand key={brand.id} brand={brand} stt={index + 1} deleteSuccess={deleteSuccess} />
                                    ))}
                                </TableBody>
                            }
                        </Table>
                    </div>
                </div>
                {totalPages != null && totalPages > 0 && <Pagination pageCurrent={pageCurrent} setPageCurrent={setPageCurrent} totalPages={totalPages} />}

            </div>

        </>
    )
}

export default ListBrand