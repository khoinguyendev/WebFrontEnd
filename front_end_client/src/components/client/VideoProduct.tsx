const VideoProduct = () => {
  return (
    <div>
      <p className="font-bold text-gray1 text-xl">Video đập hộp</p>
      <div className="w-full my-2" data-video="https://www.youtube.com/embed/XAZH5Qwwy4M">
        <iframe className="w-full h-[320px]" src="https://www.youtube.com/embed/XAZH5Qwwy4M" allow="autoplay; encrypted-media" allowFullScreen />
      </div>
    </div>
  );
};

export default VideoProduct;
