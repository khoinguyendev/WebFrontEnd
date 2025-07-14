import { useParams } from "react-router-dom";
import Bread from "../../components/client/Bread";
import DescriptionProduct from "../../components/client/DescriptionProduct";
import ProductImage from "../../components/client/ProductImage";
import ProductInfo from "../../components/client/ProductInfo";
import ProductSpecification from "../../components/client/ProductSpecification";
import SimilarProduct from "../../components/client/SimilarProduct";
import VideoProduct from "../../components/client/VideoProduct";
import ViewedProduct from "../../components/client/ViewedProduct";
import { useEffect, useState } from "react";
import { IProduct } from "../../types/Product";
import axios from "axios";
import { SERVER_HOST } from "../../config/Url";
import SnipperLoading from "../../components/admin/SnipperLoading";
import { useDispatch } from "react-redux";
import { addToViewed } from "../../redux/productViewtedSlice";

const ProductDetail = () => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const { id } = useParams();
  useEffect(() => {
    console.log(id);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const responseProduct = await axios.get(`${SERVER_HOST}/products/${id}`);
        const productData: IProduct = responseProduct.data;

        dispatch(addToViewed(productData));
        setProduct(productData);
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi đường dẫn thay đổi
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if (!product) return null;
  return (
    <div>
      <div className="custom-container py-4">
        <Bread title="Sản phẩm" />
        {isLoading ? (
          <SnipperLoading />
        ) : (
          
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-9">
              <div className="grid grid-cols-12">
                <div className="col-span-5">
                  <ProductImage image={product?.image} />
                </div>
                <div className="col-span-7 ms-4">
                  <ProductInfo product={product} />
                </div>
                {/* <div className="col-span-12 my-5">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <ProductSpecification />
                    </div>
                    <div className="col-span-6">
                      <VideoProduct />
                    </div>
                  </div>
                </div> */}
                <div className="col-span-12 my-5">
                  <DescriptionProduct product={product} />
                </div>
              </div>
            </div>

            <div className="col-span-3">
              <SimilarProduct product={product} />
            </div>
          </div>
        )}

        <div>
          <ViewedProduct />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
