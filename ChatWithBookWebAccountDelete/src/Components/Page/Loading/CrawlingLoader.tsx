import "./Loading.css";
import Lottie from "lottie-react";
import animationData from "../../../../public/assets/lottie/dotLoader.json";

const CrawlingLoader = () => {
  return (
    <div className="loading-overlay-new">
      <div style={{ width: "150px", height: "150px" }}>
        <Lottie animationData={animationData} loop={true} />
      </div>
      <div className="loader-text">we're crawling your site...</div>
    </div>
  );
};

export default CrawlingLoader;
