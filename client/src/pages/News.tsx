import { useState } from "react";
import { ArrowUp, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function News() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("全部");

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

  // 新闻分类
  const categories = ["全部", "公司动态", "行业资讯", "展会活动", "产品发布"];

  // 新闻数据
  const newsItems = [
    {
      id: 1,
      title: "好利来与GUIDI达成战略合作",
      category: "公司动态",
      date: "2025-01-15",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
      summary: "深圳市好利来贸易有限公司与意大利知名品牌GUIDI正式签署战略合作协议，将在船舶配套领域展开深度合作。",
      featured: true,
    },
    {
      id: 2,
      title: "2025 中国（上海）第二十八届国际船艇及其技术设备展览会",
      category: "展会活动",
      date: "2025-03-20",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      summary: "我们将参加在上海举办的国际船艇展，展示最新的船舶配套产品和解决方案。",
      featured: true,
    },
    {
      id: 3,
      title: "2025年第26届北京国际房车露营展览会",
      category: "展会活动",
      date: "2025-04-10",
      image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop",
      summary: "好利来将携最新房车配套系统亮相北京国际房车展，欢迎莅临参观。",
      featured: true,
    },
    {
      id: 4,
      title: "新一代智能游艇导航系统正式发布",
      category: "产品发布",
      date: "2025-01-05",
      image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop",
      summary: "我们推出的新一代智能导航系统，集成了最新的GPS技术和人工智能算法。",
      featured: false,
    },
    {
      id: 5,
      title: "全球船舶配套市场趋势分析",
      category: "行业资讯",
      date: "2024-12-28",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop",
      summary: "2024年全球船舶配套市场呈现稳步增长态势，环保和智能化成为主要发展方向。",
      featured: false,
    },
    {
      id: 6,
      title: "好利来荣获\"优秀供应商\"称号",
      category: "公司动态",
      date: "2024-12-15",
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&h=600&fit=crop",
      summary: "凭借优质的产品和服务，好利来被多家合作伙伴评为年度优秀供应商。",
      featured: false,
    },
    {
      id: 7,
      title: "房车配套系统升级方案推出",
      category: "产品发布",
      date: "2024-12-01",
      image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop",
      summary: "针对现有房车用户，我们推出了系统升级方案，提升使用体验。",
      featured: false,
    },
    {
      id: 8,
      title: "绿色船舶技术发展论坛成功举办",
      category: "行业资讯",
      date: "2024-11-20",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      summary: "业内专家齐聚一堂，共同探讨船舶行业的绿色发展之路。",
      featured: false,
    },
  ];

  // 根据分类筛选新闻
  const filteredNews = selectedCategory === "全部" 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  // 特色新闻（前3条）
  const featuredNews = newsItems.filter(item => item.featured);
  // 普通新闻
  const regularNews = filteredNews.filter(item => !item.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面标题横幅 */}
      <section className="relative h-[300px] md:h-[400px] mt-[120px] md:mt-[130px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=600&fit=crop"
            alt="新闻动态"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              新闻动态
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              News & Updates
            </p>
          </div>
        </div>
      </section>

      {/* 新闻分类 */}
      <section className="py-8 bg-white border-b sticky top-[120px] md:top-[130px] z-30">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* 特色新闻 */}
      {selectedCategory === "全部" && (
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">热点新闻</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 大图新闻 */}
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group cursor-pointer shadow-lg">
                <img
                  src={featuredNews[0]?.image}
                  alt={featuredNews[0]?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredNews[0]?.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {featuredNews[0]?.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                    {featuredNews[0]?.title}
                  </h3>
                  <p className="text-sm opacity-90">{featuredNews[0]?.summary}</p>
                </div>
              </div>

              {/* 小图新闻 */}
              <div className="flex flex-col gap-6">
                {featuredNews.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className="relative h-[242px] rounded-lg overflow-hidden group cursor-pointer shadow-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-center gap-3 mb-2 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1 drop-shadow-lg">
                        {item.title}
                      </h3>
                      <p className="text-xs opacity-90 line-clamp-2">{item.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 新闻列表 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {selectedCategory === "全部" ? "更多新闻" : selectedCategory}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    阅读更多 →
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="flex justify-center mt-12 gap-2">
            <Button variant="outline" size="sm">上一页</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">下一页</Button>
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

