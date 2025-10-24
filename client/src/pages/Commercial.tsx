import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Commercial() {
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

  // 商业船应用领域
  const applications = [
    {
      name: "渔业船舶",
      description: "专业渔业作业船舶配套设备",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop",
      solutions: ["捕捞设备", "冷藏系统", "导航系统", "通讯设备"],
    },
    {
      name: "货运船舶",
      description: "高效货运船舶配套系统",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      solutions: ["装卸设备", "货物管理", "动力系统", "安全监控"],
    },
    {
      name: "客运船舶",
      description: "舒适安全的客运船配套",
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&h=600&fit=crop",
      solutions: ["座椅系统", "安全设施", "娱乐设备", "卫生设施"],
    },
    {
      name: "工程船舶",
      description: "专业工程作业船舶设备",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      solutions: ["作业设备", "起重系统", "定位系统", "动力配套"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面标题横幅 */}
      <section className="relative h-[300px] md:h-[400px] mt-[120px] md:mt-[130px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1920&h=600&fit=crop"
            alt="商业船"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              商业船配套系统
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Commercial Vessel Equipment
            </p>
          </div>
        </div>
      </section>

      {/* 产品介绍 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              专业的商业船舶配套方案
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              我们为各类商业船舶提供全面的配套设备和系统解决方案，涵盖渔业、货运、客运、工程等多个领域。
              凭借多年的行业经验和专业技术，我们能够为客户提供高效、可靠、经济的配套方案。
              从设备选型、系统集成到安装调试，我们提供全程专业服务，确保船舶安全高效运营。
            </p>
          </div>

          {/* 应用领域展示 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {applications.map((app, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={app.image}
                    alt={app.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-primary">
                    {app.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{app.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">配套方案：</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {app.solutions.map((solution, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                          {solution}
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

      {/* 核心优势 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            核心优势
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Core Advantages
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">01</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">行业经验</h3>
              <p className="text-gray-600 text-center text-sm">
                多年商业船舶配套经验，深入了解行业需求
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">02</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">品质保证</h3>
              <p className="text-gray-600 text-center text-sm">
                严格的质量控制体系，确保产品可靠耐用
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">03</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">成本优化</h3>
              <p className="text-gray-600 text-center text-sm">
                合理的方案设计，帮助客户降低运营成本
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-primary">04</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">快速响应</h3>
              <p className="text-gray-600 text-center text-sm">
                高效的服务团队，快速响应客户需求
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 服务流程 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            服务流程
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Service Process
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { step: "01", title: "需求分析", desc: "了解客户具体需求" },
                { step: "02", title: "方案设计", desc: "制定配套方案" },
                { step: "03", title: "设备采购", desc: "采购优质设备" },
                { step: "04", title: "安装调试", desc: "专业安装调试" },
                { step: "05", title: "售后服务", desc: "持续技术支持" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-3 mx-auto text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h4 className="font-bold mb-1 text-gray-800">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            需要商业船配套方案？
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            我们的专业团队将为您提供最适合的解决方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-gray-100 border-white"
            >
              获取方案
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 border-white"
            >
              在线咨询
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

