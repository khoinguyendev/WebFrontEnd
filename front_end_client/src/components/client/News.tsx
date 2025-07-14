import ItemNews from "./ItemNews";

const news = [
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 1",
    description: "This",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 2",
    description: "This",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 3",
    description: "This",
  },
  {
    image: "https://sadesign.vn/pictures/picfullsizes/2024/11/30/ybd1732939646.jpg",
    name: "Danh mục 4",
    description: "This",
  },
];
const News = () => {
  return (
    <div>
      <h2 className="border-b-primary border-b-4 ">
        <button className="bg-primary text-white px-5 py-2 font-bold rounded-t-lg">Tin tức mới nhất</button>
      </h2>
      <div className="grid grid-cols-12 py-2 gap-3">
        {news.map((item, index) => (
          <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3" key={index}>
            <ItemNews news={item} />
          </div>
        ))}
        {/* <div className="hidden py-2 gap-4 flex-col md:flex sm:col-span-3 sm:order-1">
          <a className="block" href="#" title="Săn sale thả ga">
            <img className="lazyload loaded" width={280} src="https://example.com/news1.jpg" alt="Sản phẩm thả ga" />
            <div className="py-2">
              <h3 className="font-bold">Tin tức mới nhất</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default News;
