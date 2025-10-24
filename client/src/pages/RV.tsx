import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RV() {
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

  // 房车配套系统
  const rvSystems = [
    {
      name: "电力系统",
      description: "完整的房车电力解决方案",
      image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop",
      features: ["太阳能板", "蓄电池", "逆变器", "充电系统"],
    },
    {
      name: "水暖系统",
      description: "舒适的水暖配套设施",
      image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop",
      features: ["净水系统", "热水器", "采暖设备", "排水系统"],
    },
    {
      name: "厨卫系统",
      description: "实用的厨房卫生间设备",
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop",
      features: ["厨房设备", "卫浴设施", "通风系统", "储物空间"],
    },
    {
      name: "智能系统",
      description: "现代化智能控制系统",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      features: ["中控系统", "监控设备", "娱乐系统", "安防系统"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面标题横幅 */}
      <section className="relative h-[300px] md:h-[400px] mt-[120px] md:mt-[130px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1920&h=600&fit=crop"
            alt="房车"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              房车配套系统
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              RV Equipment Systems
            </p>
          </div>
        </div>
      </section>

      {/* 产品介绍 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              全方位的房车配套解决方案
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              我们专注于为房车提供完整的配套系统和设备，包括电力、水暖、厨卫、智能控制等各个方面。
              与国内外知名品牌合作，确保产品质量和性能达到行业标准。
              无论是自驾旅行还是长期居住，我们都能为您打造一个舒适、便捷、安全的移动之家。
            </p>
          </div>

          {/* 配套系统展示 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {rvSystems.map((system, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={system.image}
                    alt={system.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-primary">
                    {system.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{system.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">系统组成：</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {system.features.map((feature, idx) => (
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

      {/* 产品特色 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            产品特色
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Product Features
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🔋</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">节能环保</h3>
              <p className="text-gray-600 text-center">
                采用太阳能等清洁能源，降低能耗，环保节能，让您的旅行更加绿色
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">舒适便捷</h3>
              <p className="text-gray-600 text-center">
                完善的生活设施，智能化控制系统，让您在旅途中也能享受家的舒适
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">安全可靠</h3>
              <p className="text-gray-600 text-center">
                严格的质量标准，完善的安全保护，确保您的旅行安全无忧
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 应用场景 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            应用场景
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Application Scenarios
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-80 rounded-lg overflow-hidden group cursor-pointer shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop"
                alt="自驾旅行"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-3">自驾旅行</h3>
                <p className="text-sm opacity-90">
                  配备完善的生活设施，让您在旅途中享受家的温馨，随心所欲探索世界
                </p>
              </div>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden group cursor-pointer shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop"
                alt="露营度假"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-3">露营度假</h3>
                <p className="text-sm opacity-90">
                  在大自然中享受舒适生活，智能系统让您的露营体验更加便捷愉悦
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            开启您的房车生活
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            让我们为您打造理想的移动之家
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-gray-100 border-white"
            >
              定制方案
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 border-white"
            >
              预约参观
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

