import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Outboard() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 监听滚动显示返回顶部按钮
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 产品系列数据
  const productSeries = [
    {
      name: "舷外机系列",
      description: "高性能舷外机，适用于各类船艇",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      features: ["高效节能", "低噪音", "易维护", "耐用可靠"],
    },
    {
      name: "操控系统",
      description: "精准的船舶操控系统",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      features: ["灵敏操控", "安全可靠", "人体工学设计", "易于安装"],
    },
    {
      name: "燃油系统",
      description: "高效燃油供给系统",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop",
      features: ["节能环保", "稳定供给", "防腐蚀", "长寿命"],
    },
    {
      name: "配件系统",
      description: "全套舷外机配套配件",
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&h=600&fit=crop",
      features: ["原厂品质", "完整配套", "快速交付", "技术支持"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面标题横幅 */}
      <section className="relative h-[300px] md:h-[400px] mt-[120px] md:mt-[130px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=600&fit=crop"
            alt="舷外机船配套"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              舷外机船配套
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Outboard Motor Boat Equipment
            </p>
          </div>
        </div>
      </section>

      {/* 产品介绍 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              专业的舷外机配套解决方案
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              我们提供全方位的舷外机船配套产品和服务，包括高性能舷外机、操控系统、燃油系统及各类配件。
              与多家国际知名品牌合作，确保产品质量和性能达到行业领先水平。
              无论是休闲娱乐还是专业作业，我们都能为您提供最适合的解决方案。
            </p>
          </div>

          {/* 产品系列展示 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {productSeries.map((series, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={series.image}
                    alt={series.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-primary">
                    {series.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{series.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">产品特点：</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {series.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术优势 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            技术优势
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Technical Advantages
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">01</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">国际品质</h3>
              <p className="text-gray-600 text-center">
                与国际知名品牌合作，确保产品符合国际标准，质量可靠
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">02</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">专业服务</h3>
              <p className="text-gray-600 text-center">
                专业的技术团队提供全方位的售前咨询和售后服务支持
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">03</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">完整方案</h3>
              <p className="text-gray-600 text-center">
                提供从产品选型到安装调试的一站式解决方案
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            需要了解更多信息？
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            我们的专业团队随时为您提供咨询服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-gray-100 border-white"
            >
              联系我们
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 border-white"
            >
              下载产品手册
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* 返回顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-40"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

