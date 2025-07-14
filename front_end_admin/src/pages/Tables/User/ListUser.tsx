import { Link } from "react-router"
import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import PageMeta from "../../../components/common/PageMeta"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table"
import SnipperLoading from "../../../utils/SnipperLoading"
import { useEffect, useState } from "react"
import { IUser } from "../../../types/User"
import { SERVER_HOST } from "../../../configs/UrlServer"
import axios from "axios"
import Pagination from "../../../components/ui/pagination/Pagination"
import ItemUser from "./ItemUser"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
const tabs = [
    { id: "CUSTOMER", lable: "Người dùng" },
    { id: "STAFF", lable: "Nhân viên" },
    { id: "MANAGER", lable: "Quản lý" },


];
const getAllowedTabs = (role: string) => {
  if (role === "ADMIN") return tabs;
  if (role === "MANAGER") return tabs.filter((tab) => tab.id === "CUSTOMER" || tab.id === "STAFF");
  return []; // role khác thì không có tab nào
};
const ListUser = () => {
        const { user } = useSelector((state: RootState) => state.auth);

    const [pageCurrent, setPageCurrent] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
        const [activeTab, setActiveTab] = useState("CUSTOMER");

    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${SERVER_HOST}/users/by-role?role=${activeTab}&page=${pageCurrent - 1}`);
                if (totalPages != response.data.data.totalPages) setTotalPages(response.data.data.totalPages);
                setUsers(response.data.data.content);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [pageCurrent, activeTab]);
    const deleteSuccess = async (id: number) => {
        setUsers(users.filter((user) => user.id !== id));

    };
    const handleSetActive = (id: string) => {
        setActiveTab(id);
    };
  return (
     <>
            <PageMeta
                title="Người dùng"
                description="Danh sách người dùng"
            />
            {activeTab!="STAFF" && <div className="my-3">
                <Link to={"/tables/user/add"} className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ">
                    Thêm 
                </Link>
            </div>}
            <div className="w-full mb-1">
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                        {getAllowedTabs(user?.role || "").map((tab) => (
                            <li key={tab.id} className="me-2" role="presentation">
                                <button
                                    className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors ${activeTab === tab.id
                                        ? "text-purple-600 border-purple-600 dark:text-purple-500 dark:border-purple-500"
                                        : "text-gray-500 hover:text-gray-600 border-transparent hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                        }`}
                                    onClick={() => handleSetActive(tab.id)}
                                    type="button"
                                >
                                    {tab.lable}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
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
                                        Email
                                    </TableCell>
                                   <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Chức vụ
                                    </TableCell>
                                  
                                   

                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            {isLoading ? <SnipperLoading /> :
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {users.map((user, index) => (
                                        <ItemUser key={user.id} user={user} stt={index + 1} deleteSuccess={deleteSuccess} />
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

export default ListUser