import { Link } from "react-router-dom";
import { ICategory } from "../../types/Category";
import { urlImage } from "../../util/Format";

const ItemCategory = ({ item }: { item: ICategory }) => {
  return (
    <Link to={`/danh-muc/${item.id}`} key={item.id} className="flex flex-col items-center p-3 group">
      <img className="h-[80px] w-[80px] object-cover rounded-full transition-transform duration-500 group-hover:rotate-45" src={urlImage(item.image)} alt={item.name} />
      <p className="text-center mt-2 text-gray1 text-[15px]">{item.name}</p>
    </Link>
  );
};

export default ItemCategory;
