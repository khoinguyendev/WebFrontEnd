import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import PageMeta from "../../../components/common/PageMeta"
import axios from "axios";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table"
import { IProduct } from "../../../types/Product";
import { SERVER_HOST } from "../../../configs/UrlServer";
import ItemProduct from "./ItemProduct";
import SnipperLoading from "../../../utils/SnipperLoading";
import { Link } from "react-router";
import Pagination from "../../../components/ui/pagination/Pagination";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ListProduct = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [keyword, setKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const [pageCurrent, setPageCurrent] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let response;
                if (isSearching && keyword.trim()) {
                    response = await axios.get(`${SERVER_HOST}/products/search?query=${keyword}&page=${pageCurrent - 1}&size=10`);
                } else {
                    response = await axios.get(`${SERVER_HOST}/products?page=${pageCurrent - 1}&size=10`);
                }
                setProducts(response.data.data.content);
                if (totalPages !== response.data.data.totalPages) setTotalPages(response.data.data.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [pageCurrent, isSearching]);

    const handleSearch = () => {
        setIsSearching(true);
        setPageCurrent(1);
    };

    const handleClearSearch = () => {
        setIsSearching(false);
        setKeyword("");
        setPageCurrent(1);
    };

    return (
        <>
            <PageMeta
                title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Sản phẩm" />
            {user?.role !== "STAFF" && (
                <div className="my-3">
                    <Link to="/product/add" className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ">
                        Thêm sản phẩm
                    </Link>
                </div>
            )}
            <div className="my-3 flex items-center gap-4">
                <div className="relative">
                    <button onClick={handleSearch} className="absolute -translate-y-1/2 left-4 top-1/2 cursor-pointer">
                        <svg
                            className="fill-gray-500 dark:fill-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                fill=""
                            />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                    />
                </div>
                {isSearching && (
                    <button
                        onClick={handleClearSearch}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                        Hủy
                    </button>
                )}
            </div>
            <div className="space-y-6">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">STT</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tên sản phẩm</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Hình ảnh</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Danh mục</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Thương hiệu</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Giá</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Giảm giá</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tồn kho</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Hành động</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell >
                                            <SnipperLoading />
                                        </TableCell>
                                    </TableRow>
                                ) : products.map((product, index) => (
                                    <ItemProduct key={product.id} product={product} STT={(pageCurrent - 1) * 10 + index + 1} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {totalPages != null && totalPages > 0 && (
                    <Pagination
                        pageCurrent={pageCurrent}
                        setPageCurrent={setPageCurrent}
                        totalPages={totalPages}
                    />
                )}
            </div>
        </>
    );
};


export default ListProduct