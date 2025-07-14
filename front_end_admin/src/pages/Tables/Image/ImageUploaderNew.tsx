import { useEffect, useState } from "react";
import axios from "axios";
import { IImage } from "../../../types/Image";
import { SERVER_HOST } from "../../../configs/UrlServer";
import SnipperLoading from "../../../utils/SnipperLoading";
import Pagination from "../../../components/ui/pagination/Pagination";
import ModalAddImage from "./ModalAddImage";


interface ImageUploaderNew {
    setOpenModal: (o: boolean) => void;
    setImageUrl: (image: string) => void;
}

const ImageUploaderNew = ({ setOpenModal, setImageUrl }: ImageUploaderNew) => {
    const [pageCurrent, setPageCurrent] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [images, setImages] = useState<IImage[]>([]);
    const [modalAddImmage, setModalAddImage] = useState(false);
    const [load, setLoad] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
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
    }, [pageCurrent, load]);
    const handleSelectImage = (image: string) => {
        setImageUrl(image);
        setOpenModal(false);
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-95 z-9999 px-4">
            <div className="bg-white w-[1200px] h-[90vh] rounded-lg shadow-lg relative p-5">
                <button onClick={() => setOpenModal(false)} className="absolute h-10 w-10 rounded-full flex items-center justify-center bg-white -top-5 -right-5 text-gray1 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => setModalAddImage(true)}
                    className="block text-white bg-green-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                    Thêm ảnh
                </button>
                <div className="grid grid-cols-6 gap-3 overflow-y-auto max-h-[80vh] py-2 pb-[120px]">
                    {isLoading ? (
                        <SnipperLoading />
                    ) : (
                        images.length > 0 &&
                        images?.map((image, index) => (
                            <div key={index} className="flex justify-center w-full">
                                <img
                                    onClick={() => handleSelectImage(image.url)}
                                    src={image.url}
                                    alt="..."
                                    className="object-cover h-32 cursor-pointer  rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                                />
                            </div>
                        ))
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t flex flex-col md:flex-row justify-between items-center gap-3">
                    {totalPages != null && totalPages > 0 && (
                        <Pagination
                            pageCurrent={pageCurrent}
                            setPageCurrent={setPageCurrent}
                            totalPages={totalPages}
                        />
                    )}

                </div>
            </div>
            {modalAddImmage && <ModalAddImage setOpenModal={setModalAddImage} setLoad={setLoad} />}

        </div>
    );
};

export default ImageUploaderNew;
