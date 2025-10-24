import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Yacht() {
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

  // 游艇配套系统
  const yachtSystems = [
    {
      name: "导航系统",
      description: "先进的船舶导航和定位系统",
      image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop",
      features: ["GPS定位", "电子海图", "雷达系统", "自动驾驶"],
    },
    {
      name: "动力系统",
      description: "高性能游艇动力解决方案",
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&h=600&fit=crop",
      features: ["高效引擎", "低油耗", "静音设计", "环保节能"],
    },
    {
      name: "舒适系统",
      description: "豪华游艇舒适配套设备",
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop",
      features: ["空调系统", "娱乐设备", "照明系统", "卫浴设施"],
    },
    {
      name: "安全系统",
      description: "全方位的安全保障系统",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      features: ["消防设备", "救生设备", "监控系统", "通讯设备"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面标题横幅 */}
      <section className="relative h-[300px] md:h-[400px] mt-[120px] md:mt-[130px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&h=600&fit=crop"
            alt="游艇"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              游艇配套系统
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Yacht Equipment Systems
            </p>
          </div>
        </div>
      </section>

      {/* 产品介绍 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              高端游艇配套解决方案
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              我们专注于为豪华游艇提供全方位的配套系统和设备，涵盖导航、动力、舒适和安全等各个方面。
              与世界顶级品牌合作，确保每一个细节都达到最高标准。
              无论是私人游艇还是商务游艇，我们都能提供量身定制的解决方案，让您的航海之旅更加安全、舒适、愉悦。
            </p>
          </div>

          {/* 配套系统展示 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {yachtSystems.map((system, index) => (
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
                    <h4 className="font-semibold text-gray-800">系统特点：</h4>
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

      {/* 服务优势 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            服务优势
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Service Advantages
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold mb-2">顶级品牌</h3>
              <p className="text-gray-600 text-sm">
                与国际顶级游艇设备品牌深度合作
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-lg font-bold mb-2">定制方案</h3>
              <p className="text-gray-600 text-sm">
                根据客户需求提供个性化定制服务
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-lg font-bold mb-2">专业安装</h3>
              <p className="text-gray-600 text-sm">
                经验丰富的技术团队提供专业安装
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-bold mb-2">售后保障</h3>
              <p className="text-gray-600 text-sm">
                完善的售后服务体系，全程无忧
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 案例展示 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            成功案例
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Success Stories
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="group relative h-80 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  src={`https://images.unsplash.com/photo-156926397910${item}-865ab7cd8d13?w=600&h=800&fit=crop`}
                  alt={`案例 ${item}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">豪华游艇项目 {item}</h3>
                  <p className="text-sm opacity-90">
                    为客户提供全套游艇配套系统解决方案
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            打造您的梦想游艇
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            让我们的专业团队为您提供最优质的游艇配套方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-gray-100 border-white"
            >
              预约咨询
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 border-white"
            >
              查看更多案例
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

