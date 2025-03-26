import React, { useEffect, useState } from "react";
import img1 from "../assets/portfolio1.png";
import img2 from "../assets/portfolio2.png";
import img3 from "../assets/portfolio3.png";
import img4 from "../assets/portfolio4.png";
import img5 from "../assets/portfolio5.jpg";

const images = [
  { src: img1, caption: "Product Shoot – Ice Edition" },
  { src: img2, caption: "Portrait – Natural Light" },
  { src: img3, caption: "Landscape – Sunset Mountains" },
  { src: img4, caption: "Studio Portrait – Classic" },
  { src: img5, caption: "Creative Product Shot" },
];

const PortfolioSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCaptionIndex, setVisibleCaptionIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getRelativeIndex = (index) => {
    const total = images.length;
    const diff = (index - currentIndex + total) % total;

    if (diff === 0) return "current";
    if (diff === 1) return "right";
    if (diff === 2) return "hidden-right";
    if (diff === total - 1) return "left";
    if (diff === total - 2) return "hidden-left";
    return "hidden";
  };

  const getStyle = (position) => {
    switch (position) {
      case "current":
        return {
          transform: "translateX(0%) scale(1.1)",
          zIndex: 10,
          opacity: 1,
          filter: "none",
        };
      case "left":
        return {
          transform: "translateX(-120%) scale(0.85)",
          zIndex: 5,
          opacity: 0.5,
          filter: "blur(2px)",
        };
      case "right":
        return {
          transform: "translateX(120%) scale(0.85)",
          zIndex: 5,
          opacity: 0.5,
          filter: "blur(2px)",
        };
      case "hidden-left":
        return {
          transform: "translateX(-240%) scale(0.7)",
          zIndex: 1,
          opacity: 0,
        };
      case "hidden-right":
        return {
          transform: "translateX(240%) scale(0.7)",
          zIndex: 1,
          opacity: 0,
        };
      default:
        return { display: "none" };
    }
  };

  return (
    <section
      id="work"
      className="bg-black py-24 px-4 md:px-8 sm:px-6 text-white"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">My Portfolio</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Explore some of my favorite shots – portraits, landscapes, and product
          photography.
        </p>
      </div>

      {/* Görsel Alanı */}
      <div className="relative w-full flex justify-center items-center h-[80vh] sm:h-[70vh] md:h-[65vh] lg:h-[60vh] overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((img, index) => {
            const position = getRelativeIndex(index);
            const style = getStyle(position);
            if (style.display === "none") return null;

            return (
              <div
  key={index}
  style={{
    ...style,
    transition: "all 0.8s ease-in-out",
    position: "absolute",
  }}
  className="rounded-xl overflow-hidden shadow-lg w-[90vw] max-w-[600px] h-[80%] md:h-[75%] lg:h-[70%] cursor-default"
>
                <div
                  className="relative w-full h-full group"
                  onClick={() => {
                    if (isMobile) {
                      setVisibleCaptionIndex(
                        visibleCaptionIndex === index ? null : index
                      );
                    }
                  }}
                >
                  {/* Görsel */}
                  <img
  src={img.src}
  alt=""
  className="w-full h-full object-cover"
/>

                  {/* Açıklama kutusu */}
                  <div
                    className={`absolute bottom-4 left-4 max-w-[250px] transition-all duration-500 ease-in-out ${
                      visibleCaptionIndex === index
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    } md:group-hover:opacity-100`}
                  >
                    <div className="backdrop-blur-md bg-black/50 text-white text-sm px-5 py-2 rounded-full shadow-lg inline-block max-w-fit">
                      {img.caption}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
